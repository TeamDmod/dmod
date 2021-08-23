import rateLimit from 'lib/rateLimiting';
import type { NextApiRequest, NextApiResponse } from 'next';

export default rateLimit({ max: 1 }, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
