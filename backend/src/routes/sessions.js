import express from 'express';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { redisClient } from '../config/redis.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

router.use(limiter);

// Create new layover session
router.post('/create', async (req, res) => {
  try {
    const { duration, location, creatorName, airline, pin } = req.body;

    if (!duration || !creatorName) {
      return res.status(400).json({ error: 'Duration and creator name required' });
    }

    const sessionId = nanoid(10);
    const userId = nanoid(12);
    const now = Date.now();
    const expiresAt = now + (duration * 60 * 1000);

    const sessionData = {
      sessionId,
      createdAt: now,
      expiresAt,
      duration,
      creatorId: userId,
      location: location || {},
      pin: pin || null,
      members: [{
        userId,
        name: creatorName,
        airline: airline || '',
        joinedAt: now,
        locationSharing: false
      }]
    };

    const ttl = Math.floor(duration * 60);
    await redisClient.setEx(
      `session:${sessionId}`,
      ttl,
      JSON.stringify(sessionData)
    );

    const qrData = {
      type: 'layover_session',
      sessionId,
      expiresAt,
      pin: pin || null,
      joinUrl: `${process.env.APP_URL || 'http://localhost:3000'}/join/${sessionId}`
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({
      sessionId,
      userId,
      qrCode,
      expiresAt,
      joinUrl: qrData.joinUrl
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Join existing session
router.post('/join', async (req, res) => {
  try {
    const { sessionId, name, airline, pin } = req.body;

    if (!sessionId || !name) {
      return res.status(400).json({ error: 'Session ID and name required' });
    }

    const sessionKey = `session:${sessionId}`;
    const sessionStr = await redisClient.get(sessionKey);

    if (!sessionStr) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    const session = JSON.parse(sessionStr);

    if (session.pin && session.pin !== pin) {
      return res.status(403).json({ error: 'Invalid PIN' });
    }

    const userId = nanoid(12);
    const newMember = {
      userId,
      name,
      airline: airline || '',
      joinedAt: Date.now(),
      locationSharing: false
    };

    session.members.push(newMember);

    const ttl = await redisClient.ttl(sessionKey);
    await redisClient.setEx(sessionKey, ttl, JSON.stringify(session));

    res.json({
      userId,
      session: {
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
        members: session.members,
        location: session.location
      }
    });
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ error: 'Failed to join session' });
  }
});

// Get session details
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionStr = await redisClient.get(`session:${sessionId}`);

    if (!sessionStr) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = JSON.parse(sessionStr);
    const ttl = await redisClient.ttl(`session:${sessionId}`);

    res.json({
      ...session,
      remainingTime: ttl
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update location
router.post('/:sessionId/location', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, location, sharing } = req.body;

    if (!userId || !location) {
      return res.status(400).json({ error: 'User ID and location required' });
    }

    const sessionKey = `session:${sessionId}`;
    const sessionStr = await redisClient.get(sessionKey);

    if (!sessionStr) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = JSON.parse(sessionStr);
    const member = session.members.find(m => m.userId === userId);

    if (!member) {
      return res.status(403).json({ error: 'User not in session' });
    }

    member.locationSharing = sharing !== undefined ? sharing : true;
    member.lastLocation = {
      ...location,
      updatedAt: Date.now()
    };

    const ttl = await redisClient.ttl(sessionKey);
    await redisClient.setEx(sessionKey, ttl, JSON.stringify(session));

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

export default router;
