import connectToDatabase from 'lib/mongodb.connection';
import userModule from 'models/users';
import type { NextApiRequest, NextApiResponse } from 'next';

const MAX_RETURN = 20;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await connectToDatabase();

  if (req.query.id && typeof req.query.id === 'string') {
    const user = await userModule.findOne({ _id: req.query.id as string });
    return user
      ? res.json(Object.fromEntries(Object.entries(user.toObject()).filter(d => !['updates_access'].includes(d[0]))))
      : res.json({ code: 404, message: 'User not found' });
  }

  if (req.query.max && typeof req.query.max !== 'string' && !Number.isNaN(+req.query.max) && +req.query.max > MAX_RETURN)
    return res.json({ code: 400, message: '"max" must be a valid number' });
  if (req.query.q && typeof req.query.q !== 'string') return res.json({ code: 400, message: '"q" must be string' });
  if (req.query.vanity && typeof req.query.vanity !== 'string') return res.json({ code: 400, message: '"vanity" must be string' });

  const str = req.query.q ? decodeURIComponent(req.query.q as string).replace(/[^0-9a-zA-Z=\-_%'":; ]*/g, '') : null;
  const vanitySearch = req.query.vanity as string;
  const searchReg = str ? new RegExp(str, 'i') : vanitySearch ?? null;

  if ((str || '__').length <= 0) return res.json({ code: 400, message: 'Invalid "q"' });
  if (!searchReg) return res.json({ code: 400, message: 'invalid search "q"' });

  const users = await userModule
    .find({
      ...(req.query.q ? { username: { $regex: searchReg } } : {}),
      ...(req.query.vanity ? { vanity: vanitySearch } : {}),
    })
    .limit(+req.query.max ?? MAX_RETURN);

  res.json(
    users.map(u => {
      return Object.fromEntries(Object.entries(u.toObject()).filter(d => !['updates_access'].includes(d[0])));
    })
  );
};
