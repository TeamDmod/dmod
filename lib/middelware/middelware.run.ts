import { NextApiRequest, NextApiResponse } from 'next';

export type API = (req: NextApiRequest, res: NextApiResponse) => Promise<any> | any;
/**
 * Nextjs API Middleware resolver
 * =========================
 */
export default async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, result => (result instanceof Error ? reject(result) : resolve(result)));
  });
}
