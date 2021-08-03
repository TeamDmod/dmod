import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  return res.json({
    url: process.env.NODE_ENV === 'production' ? 'wss://gateway.dmod.gg' : 'ws://localhost:7102',
  });
};
