import { decryptToken } from 'lib/backend-utils';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import credentialsData from 'models/credentials';
import tokenModule from 'models/token';
import userModule from 'models/users';
import { NextApiResponse } from 'next';
import { withSessionRequest } from 'typings/typings';

const API_ENDPOINT = 'https://discord.com/api/v8';
const json = (res: Response) => res.json();

export default withSession(async (req: withSessionRequest, res: NextApiResponse) => {
  const user = req.session.get('user');

  if (!user || (user && !user.id)) return res.json({ user: null });
  await connectToDatabase();

  const results = await credentialsData.findOne({ _id: user.id });
  if (!results) return res.json({ user: null });
  const decryptAccessToken = decryptToken(results.AccessToken, true);

  const fetchedUser = await fetch(`${API_ENDPOINT}/users/@me`, {
    headers: {
      Authorization: `Bearer ${decryptAccessToken}`,
    },
  }).then(json);

  /**
   * Check for a unauth code error meaning that the user most likely
   * deauthed from discord and not worn out session, so try session destroying and credentials.
   */
  if (fetchedUser.code === 0) {
    try {
      results.delete();
      const tokengFind = await tokenModule.find({ type: 'gatewayUser', for: user.id });
      const tokenFind = await tokenModule.find({ type: 'user', for: user.id });

      if (tokengFind.length > 0) {
        await tokenModule.deleteMany({
          $and: tokengFind.map(() => ({ for: user.id, type: 'gatewayUser' })),
        });
      }

      if (tokenFind.length > 0) {
        await tokenModule.deleteMany({
          $and: tokenFind.map(() => ({ for: user.id, type: 'user' })),
        });
      }
      req.session.destroy();
      // eslint-disable-next-line no-empty
    } catch (_) {}
    return res.json({ user: null });
  }

  const user_ = await userModule.findOne({ _id: user.id });
  if (!user_) return res.json({ user: null });
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
