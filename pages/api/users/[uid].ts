import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// GET / PUT users/[uid] - get and update user data
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // query: { uid: string }
  const {
    query: { uid },
    method,
  } = req;

  // make uid string
  const uidStr = typeof uid === 'string' ? uid : uid[0];

  // Get session
  const session = await getSession({ req });
  // Get user data
  const user = await prisma.user.findUnique({
    where: {
      uid: uidStr,
    },
  });

  // Check if user exists
  if (!user) {
    res.status(404).json({
      message: 'User not found',
    });
    return;
  }

  // Get profile data
  const profile = await prisma.profile.findFirst({
    where: {
      userId: user.id,
    },
  });

  switch (method) {
    case 'GET':
      // Get data from the database
      if (session && session.user.uid === uidStr) {
        // Return all the user data
        res.status(200).json({ ...user, profile });
      } else {
        // Check profile is public
        profile.public
          ? // Return only the public data
            res.status(200).json({
              uid: user.uid,
              username: user.username,
              discriminator: user.discriminator,
              avatar: user.avatar,
              profile: {
                bio: profile.bio,
                banner: profile.banner,
                pronouns: profile.pronouns,
                vanity: profile.vanity,
                timezone: profile.timezone,
                flags: profile.flags,
              },
            })
          : // Return nothing
            res.status(200).end('Profile not found');
      }
      break;
    case 'PUT':
      // if the session is not authenticated, return an error
      if (!session || user.uid !== uid) {
        res.status(401).json({ message: 'You are not authenticated' });
        return;
      }
      // Update data in the database
      const data = await prisma.user.update({
        where: {
          uid: uidStr,
        },
        data: {
          ...req.body,
        },
      });
      res.status(200).json(data);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
