import withSession from 'lib/session';
import { NextApiResponse } from 'next';
import { withSessionRequest } from 'typings/typings';
import crypto from 'crypto-js';
import credentialsData from 'models/credentials';
import connectToDatabase from 'lib/mongodb.connection';
import userModule from 'models/users';

export function decryptToken(token: string, string: boolean = false) {
  const decript = crypto.AES.decrypt(token, process.env.ENCRIPT_KEY);
  return string ? decript.toString(crypto.enc.Utf8) : decript;
}
const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export default withSession(async (req: withSessionRequest, res: NextApiResponse) => {
  const user = req.session.get('user');

  if (!user) return res.json({ user: null });
  await connectToDatabase();

  const results = await credentialsData.findOne({ _id: user.id });
  const decryptAccessToken = decryptToken(results.AccessToken, true);

  const fetchedUser = await fetch(`${API_ENDPOINT}/users/@me`, {
    headers: {
      Authorization: `Bearer ${decryptAccessToken}`,
    },
  }).then(json);
  const user_ = await userModule.findOne({ _id: user.id });
  const user_object = user_.toObject();

  if (user_object.avatar !== fetchedUser.avatar || user_object.username !== fetchedUser.username || user_object.discriminator !== fetchedUser.discriminator) {
    await user_.updateOne(
      Object.fromEntries(
        Object.entries(
          ['avatar', 'username', 'discriminator']
            .filter(prop => user_object[prop] !== fetchedUser[prop])
            .map(prop => {
              return { [prop]: fetchedUser[prop] };
            })
        ).reduce((prev, [, curr]) => [...prev, ...Object.entries(curr)], [])
      )
    );
  }
  res.json({ user: { ...fetchedUser, ...(user_object ? { vanity: user_object.vanity } : {}) } });
});
