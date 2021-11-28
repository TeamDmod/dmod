import clientPromise from 'lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ApiUser } from 'typings/typings';

// TODO: Add checks for user permissions - allow admins to edit other users
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // request information
  const {
    query: { id },
    method,
  } = req;

  // get the session
  const session = await getSession({ req });
  const { user }: any = (session as unknown) || {};

  // get database
  const client = await clientPromise;
  const db = client.db();

  switch (method) {
    case 'GET':
      // Get data from the database
      res.status(200).json({ id, username: `${user.username}#${user.discriminator}` });
      break;
    case 'PUT':
      // if the session is not authenticated, return an error
      if (!session || user.uid !== id) {
        res.status(401).json({ message: 'You are not authenticated' });
        return;
      }
      // Update data in the database
      const data = await db.collection('users').findOneAndUpdate({ uid: id }, { $set: JSON.parse(req.body) });
      res.status(200).json(JSON.parse(JSON.stringify(data)));
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
