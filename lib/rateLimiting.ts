import rate from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Nextjs API Middleware resolver
 * =========================
 */
export async function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, result => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

type API = (req: NextApiRequest, res: NextApiResponse) => Promise<any> | any;
const defaultOptions: rate.Options = {
  max: 7,
  windowMs: 60 * 1000,
  message: JSON.stringify({ message: 'Too many requests, please try again later.', code: 429 }),
};

/**
 * API Rateliming Middleware
 * ========================
 * Nextjs API implementation of expresses rate limit module
 */
export default function rateLimit(options: rate.Options | API, handler?: API): API {
  const ops = typeof options === 'object' ? Object.assign(defaultOptions, options) : defaultOptions;
  const ApiHandle = typeof options === 'function' ? options : handler;
  const Limiting = rate(ops);
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, Limiting);
    return ApiHandle(req, res);
  };
}
