import { redisClient } from '../config/redis.js';

// Rate limiting map for messages
const messageRateLimits = new Map();

export const handleSocketConnection = (socket, io) => {
  console.log('Client connected:', socket.id);

  socket.on('join_session', async ({ sessionId, userId }) => {
    try {
      const sessionStr = await redisClient.get(`session:${sessionId}`);
      
      if (!sessionStr) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const session = JSON.parse(sessionStr);
      const member = session.members.find(m => m.userId === userId);

      if (!member) {
        socket.emit('error', { message: 'User not in session' });
        return;
      }

      socket.join(sessionId);
      socket.sessionId = sessionId;
      socket.userId = userId;

      io.to(sessionId).emit('user_joined', {
        userId,
        name: member.name,
        airline: member.airline,
        timestamp: Date.now()
      });

      socket.emit('session_joined', { session });
    } catch (error) {
      console.error('Error joining session:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  });

  socket.on('send_message', async ({ sessionId, userId, message, type, imageData }) => {
    try {
      // Rate limiting - 10 messages per minute per user
      const rateLimitKey = `${sessionId}:${userId}`;
      const now = Date.now();
      const userLimits = messageRateLimits.get(rateLimitKey) || [];
      const recentMessages = userLimits.filter(time => now - time < 60000);
      
      if (recentMessages.length >= 10) {
        socket.emit('error', { message: 'Too many messages. Please slow down.' });
        return;
      }
      
      recentMessages.push(now);
      messageRateLimits.set(rateLimitKey, recentMessages);
      
      const messageType = type || 'text';
      
      // Validate message based on type
      if (messageType === 'text' && (!message || message.trim().length === 0)) {
        return;
      }
      if (messageType === 'image' && !imageData) {
        return;
      }
      
      // Validate image size (max 300KB base64)
      if (messageType === 'image' && imageData.length > 300000) {
        socket.emit('error', { message: 'Image too large. Maximum 300KB.' });
        return;
      }

      const sessionStr = await redisClient.get(`session:${sessionId}`);
      
      if (!sessionStr) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const session = JSON.parse(sessionStr);
      const member = session.members.find(m => m.userId === userId);

      if (!member) {
        socket.emit('error', { message: 'User not in session' });
        return;
      }

      const chatMessage = {
        messageId: Date.now() + Math.random(),
        userId,
        name: member.name,
        type: messageType,
        message: messageType === 'text' ? message.trim().substring(0, 500) : (message || ''),
        imageData: messageType === 'image' ? imageData : undefined,
        timestamp: Date.now()
      };

      const messagesKey = `messages:${sessionId}`;
      await redisClient.rPush(messagesKey, JSON.stringify(chatMessage));
      
      const ttl = await redisClient.ttl(`session:${sessionId}`);
      await redisClient.expire(messagesKey, ttl);

      io.to(sessionId).emit('new_message', chatMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('update_location', async ({ sessionId, userId, location, sharing }) => {
    try {
      const sessionKey = `session:${sessionId}`;
      const sessionStr = await redisClient.get(sessionKey);

      if (!sessionStr) {
        return;
      }

      const session = JSON.parse(sessionStr);
      const member = session.members.find(m => m.userId === userId);

      if (!member) {
        return;
      }

      member.locationSharing = sharing;
      if (sharing && location) {
        member.lastLocation = {
          lat: location.lat,
          lng: location.lng,
          updatedAt: Date.now()
        };
      }

      const ttl = await redisClient.ttl(sessionKey);
      await redisClient.setEx(sessionKey, ttl, JSON.stringify(session));

      io.to(sessionId).emit('location_updated', {
        userId,
        location: member.lastLocation,
        sharing
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  });

  socket.on('get_messages', async ({ sessionId, limit = 100 }) => {
    try {
      const messagesKey = `messages:${sessionId}`;
      // Get last N messages (most recent)
      const messages = await redisClient.lRange(messagesKey, -limit, -1);
      
      const parsedMessages = messages.map(msg => JSON.parse(msg));
      socket.emit('messages_history', { messages: parsedMessages });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected:', socket.id);
    
    if (socket.sessionId && socket.userId) {
      // Cleanup rate limit data
      const rateLimitKey = `${socket.sessionId}:${socket.userId}`;
      messageRateLimits.delete(rateLimitKey);
      
      io.to(socket.sessionId).emit('user_disconnected', {
        userId: socket.userId,
        timestamp: Date.now()
      });
    }
    
    // Remove all listeners
    socket.removeAllListeners();
  });
};
