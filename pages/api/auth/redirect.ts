import btoa from 'btoa';
import crypto from 'crypto-js';
import { DEFAULT_FLAGS } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import credentials from 'models/credentials';
import users from 'models/users';
import { customAlphabet } from 'nanoid';
import { NextApiResponse } from 'next';
import { withSessionRequest } from 'typings/typings';

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export default withSession(async (req: withSessionRequest, res: NextApiResponse) => {
  if (!req.query.code) res.redirect('/api/auth/login');
  await connectToDatabase();

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

  req.session.set('user', { id: user.id });
  await req.session.save();

  const credentials_ = await credentials.findOne({ _id: user.id });
  const user_ = await users.findOne({ _id: user.id });

  let vanityURL: string;
  if (!user_) {
    const updatesAccessToken = customAlphabet(process.env.USER_SCRAMBLER, 86)();
    const _u = await users.create({
      _id: user.id,
      avatar: user.avatar,
      username: user.username,
      discriminator: user.discriminator,
      site_flags: DEFAULT_FLAGS,
      updates_access: updatesAccessToken,
      vanity: `${user.id + user.discriminator}~`,
    });
    vanityURL = _u.vanity;
  } else {
    const _u = await users.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
        },
      }
    );
    vanityURL = _u.vanity;
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

  res.redirect(`/${vanityURL ?? ''}`);
});
