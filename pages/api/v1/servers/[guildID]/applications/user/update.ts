import rateLimit from 'lib/rateLimiting';
import type { NextApiRequest, NextApiResponse } from 'next';

export default rateLimit({ max: 15 }, async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
