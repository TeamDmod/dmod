import btoa from 'btoa';
import crypto from 'crypto-js';
import { hasBetaAccess } from 'lib/backend-utils';
import { DEFAULT_FLAGS } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import credentials from 'models/credentials';
import StateTokenModule from 'models/stateToken';
import tokenModule from 'models/token';
import users from 'models/users';
import { NextApiResponse } from 'next';
import { withSessionRequest } from 'typings/typings';

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export default withSession(async (req: withSessionRequest, res: NextApiResponse) => {
  if (req.query.error) return res.redirect('/api/auth/login');
  if (!req.query.code) return res.redirect('/api/auth/login');
  if (!req.query.state) return res.redirect('/api/auth/login');
  if (typeof req.query.state !== 'string' || typeof req.query.code !== 'string') return res.redirect('/');
  await connectToDatabase();

  const stateToken = await StateTokenModule.findOne({ token: req.query.state as string });
  if (!stateToken || stateToken.token !== req.query.state) return res.redirect('/api/auth/login');
  await stateToken.deleteOne();

  const params = new URLSearchParams();
  params.set('grant_type', 'authorization_code');
  params.set('code', req.query.code as string);
  params.set('redirect_uri', process.env.REDIRECT_URL);
  const btoaString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const userAccessData = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params.toString(),
    headers: {
      Authorization: `Basic ${btoa(btoaString)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(json);

  const encryptedAccesssToken = crypto.AES.encrypt(userAccessData.access_token, process.env.ENCRYPT_KEY).toString();
  const encryptedRefreshToken = crypto.AES.encrypt(userAccessData.refresh_token, process.env.ENCRYPT_KEY).toString();

  // Get the user to set the users refresh and access to their id.
  const user = await fetch(`${API_ENDPOINT}/users/@me`, {
    headers: { Authorization: `Bearer ${userAccessData.access_token}` },
  }).then(json);

  const access = await hasBetaAccess(user.id);
  if (!access) return res.redirect('/?_access=0');

  req.session.set('user', { id: user.id });
  await req.session.save();

  const credentials_ = await credentials.findOne({ _id: user.id });
  const user_ = await users.findOne({ _id: user.id });

  function MakeToken(state = ''): string {
    const rand = () => Math.random().toString(36).substr(2);
    return `${rand()}.${rand() + rand()}=.${state}`;
  }

  interface tokenback {
    hash: string;
    token: string;
  }

  async function MakeTokenSave(T: string, type: string): Promise<tokenback> {
    const hash = crypto.SHA512(T.repeat(3)).toString();
    await tokenModule.create({
      type,
      for: user.id,
      token: T,
      tokenHash: hash,
    });

    return { hash, token: T };
  }

  const GATEWAYTOKEN = MakeToken(req.query.state as string);
  const TOKEN = MakeToken(req.query.state as string);

  const tokengFind = await tokenModule.find({ type: 'gatewayUser', from: user.id });
  if (tokengFind.length > 0) {
    await tokenModule.deleteMany({
      $and: tokengFind.map(tok => ({ token: tok.token, for: user.id, type: 'gatewayUser' })),
    });
    // past tokens have been deleted of type 'gatewayUser' to this user
  }
  // create a new token
  const { hash: GatewayHash } = await MakeTokenSave(GATEWAYTOKEN, 'gatewayUser');

  const tokenFind = await tokenModule.find({ from: user.id, type: 'user' });
  if (tokenFind.length > 0) {
    await tokenModule.deleteMany({
      $and: tokenFind.map(tok => ({ token: tok.token, for: user.id, type: 'user' })),
    });
    // past tokens have been deleted of type 'user' to this user
  }

  // NOTE: current "updates_access" will be replaced by this. as the user token
  const { token: UserToken } = await MakeTokenSave(TOKEN, 'user');

  if (!user_) {
    await users.create({
      _id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator,
      site_flags: DEFAULT_FLAGS,
      vanity: `${user.id + user.discriminator}~`,
    });
  } else {
    await users.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
        },
      }
    );
  }

  if (!credentials_) {
    await credentials.create({
      _id: user.id,
      AccessToken: encryptedAccesssToken,
      RefreshToken: encryptedRefreshToken,
    });
  } else {
    credentials.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          AccessToken: encryptedAccesssToken,
          RefreshToken: encryptedRefreshToken,
        },
      }
    );
  }

  const script = `
  <script>
  localStorage.setItem('@pup/token', "${UserToken}");
  localStorage.setItem('@pup/hash', "${GatewayHash}");
  window.close();
  </script>
  `;

  res.send(script);
});
