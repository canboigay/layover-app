import { createClient } from 'redis';

// Get Redis URL from environment
const redisUrl = process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL || 'redis://localhost:6379';

console.log('Redis URL protocol:', redisUrl.split('://')[0]);

// Validate Redis URL
if (!redisUrl || (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://'))) {
  console.error('Invalid or missing REDIS_URL. Got:', redisUrl);
  throw new Error('REDIS_URL must start with redis:// or rediss://');
}

const clientOptions = {
  url: redisUrl
};

// If using secure Redis (rediss://), enable TLS
if (redisUrl.startsWith('rediss://')) {
  console.log('Using secure Redis connection (TLS)');
  clientOptions.socket = {
    tls: true,
    rejectUnauthorized: false
  };
}

const redisClient = createClient(clientOptions);

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient, connectRedis };
