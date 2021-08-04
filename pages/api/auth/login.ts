import connectToDatabase from 'lib/mongodb.connection';
import redis from 'lib/redis';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();

  const token: string = (() => {
    const rand = () => Math.random().toString(36).substr(2);
    return rand() + rand();
  })();
  await redis.setex(`STATE:TOKENS:${token}`, 35, token);

  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=${['identify', 'guilds'].join(
      '%20'
    )}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URL)}&state=${token}`
  );
};
