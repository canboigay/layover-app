import { createClient } from 'redis';

// Handle both redis:// and rediss:// protocols (Render uses rediss://)
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
  socket: {
    // Enable TLS for rediss:// protocol
    tls: redisUrl.startsWith('rediss://'),
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient, connectRedis };
