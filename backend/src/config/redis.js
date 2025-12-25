import { createClient } from 'redis';

// Render provides Redis URL - handle TLS if using rediss://
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const clientOptions = {
  url: redisUrl
};

// If using secure Redis (rediss://), enable TLS
if (redisUrl.startsWith('rediss://')) {
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
