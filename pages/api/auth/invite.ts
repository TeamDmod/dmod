import connectToDatabase from 'lib/mongodb.connection';
import StateTokenModule from 'models/stateToken';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();

  const token: string = (() => {
    const rand = () => Math.random().toString(36).substr(2);
    return rand() + rand() + rand();
  })();
  await StateTokenModule.create({ token });

  return res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=${['bot'].join('%20')}&permissions=85056&guild_id=${
      req.query.id ?? ''
    }&disable_guild_select=true&response_type=code&redirect_uri=${encodeURIComponent(process.env.INVITE_REDIRECT_URL)}&state=${token}`
  );
};
