import Redis from 'ioredis';

const { REDIS_PORT, REDIS_HOST } = process.env;

const host = REDIS_HOST.length <= 0 ? null : REDIS_HOST;
const port = REDIS_PORT.length <= 0 ? null : +REDIS_PORT;

const redis = new Redis(port, host);

export default redis;
