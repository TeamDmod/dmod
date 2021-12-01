import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

// GET all users - get all users (pageinated)
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // query: { page: number, count: number }
  const {
    query: { page = 1, count = 10 },
    method,
  } = req;

  // only allow GET requests
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  // make page and count numbers
  const pageNum =
    typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : parseInt(page[0], 10);
  const countNum =
    typeof count === 'string'
      ? parseInt(count, 10)
      : typeof count === 'number'
      ? count
      : parseInt(count[0], 10);

  // prevent negative page numbers
  if (pageNum < 1) {
    res.status(400).end('Page must be greater than 0');
    return;
  }

  // prevent count being negative
  if (countNum < 1) {
    res.status(400).end('Count must be greater than 0');
    return;
  }

  // prevent count being too large
  if (countNum > 100) {
    res.status(400).end('Count must be less than 100');
    return;
  }

  // get users
  const users = await prisma.user.findMany({
    skip: (pageNum - 1) * countNum,
    take: countNum,
    select: {
      uid: true,
      username: true,
      discriminator: true,
      avatar: true,
      profile: {
        select: {
          bio: true,
          banner: true,
          pronouns: true,
          vanity: true,
          timezone: true,
          flags: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  // send response
  res.status(200).json(users);
};
