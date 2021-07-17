import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  return res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=${['bot'].join('%20')}&permissions=4257737855&guild_id=${
      req.query.id ?? ''
    }&disable_guild_select=true&response_type=code&redirect_uri=${encodeURIComponent(process.env.INVITE_REDIRECT_URL)}&state=${req.query.state ?? 'no'}`
  );
};
