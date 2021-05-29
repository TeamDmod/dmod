import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.REDIRECT_URL
    )}&state=${req.query.state ?? 'no'}`
  );
};
