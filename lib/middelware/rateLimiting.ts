import rate from 'express-rate-limit';

import runMiddleware, { API } from './middelware.run';

const defaultOptions: rate.Options = {
  max: 7,
  windowMs: 60 * 1000,
  handler(req, res) {
    res.status(429).json({ message: 'Too many requests, please try again later.', code: 429 });
  },
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
  return async (req, res) => {
    await runMiddleware(req, res, Limiting);
    return ApiHandle(req, res);
  };
}
