import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import tokenModule from 'models/token';
import { NextApiResponse } from 'next';
import { withSessionRequest } from 'typings/typings';

export default withSession(async (req: withSessionRequest, res: NextApiResponse) => {
  const session = req.session.get('user');
  if (!session?.id) return res.redirect('/');
  await connectToDatabase();

  const tokengFind = await tokenModule.find({ type: 'gatewayUser', for: session.id });
  const tokenFind = await tokenModule.find({ type: 'user', for: session.id });

  if (tokengFind.length > 0) {
    await tokenModule.deleteMany({
      $and: tokengFind.map(() => ({ for: session.id, type: 'gatewayUser' })),
    });
  }

  if (tokenFind.length > 0) {
    await tokenModule.deleteMany({
      $and: tokenFind.map(() => ({ for: session.id, type: 'user' })),
    });
  }

  req.session.destroy();
  res.json({ msg: 'logged out!!' });
});
