import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { redisClient, connectRedis } from './config/redis.js';
import sessionRoutes from './routes/sessions.js';
import profileRoutes from './routes/profiles.js';
import { handleSocketConnection } from './sockets/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', redis: redisClient.isOpen });
});

// Socket.io connection handling
io.on('connection', (socket) => handleSocketConnection(socket, io));

// Start server
const PORT = process.env.PORT || 3001;

connectRedis().then(() => {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Redis connected`);
  });
}).catch(err => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});

export { io };
