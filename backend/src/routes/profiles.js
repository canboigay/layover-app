import express from 'express';
import bcrypt from 'bcryptjs';
import { redisClient } from '../config/redis.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});

router.use(limiter);

// Create or update profile
router.post('/save', async (req, res) => {
  try {
    const { pin, name, airline, bio, photo, dietaryRestrictions, interests } = req.body;

    if (!pin || !name) {
      return res.status(400).json({ error: 'PIN and name required' });
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    // Hash PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Create profile ID from name (normalized)
    const profileId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const profileKey = `profile:${profileId}`;

    // Check if profile exists
    const existingProfile = await redisClient.get(profileKey);
    
    if (existingProfile) {
      // Verify PIN before updating
      const profile = JSON.parse(existingProfile);
      const pinMatch = await bcrypt.compare(pin, profile.hashedPin);
      
      if (!pinMatch) {
        return res.status(403).json({ error: 'Invalid PIN for this profile' });
      }
    }

    const profileData = {
      profileId,
      name,
      airline: airline || '',
      bio: bio || '',
      photo: photo || null,
      dietaryRestrictions: dietaryRestrictions || '',
      interests: interests || '',
      hashedPin,
      updatedAt: Date.now()
    };

    // Store with 90 day TTL
    await redisClient.setEx(profileKey, 90 * 24 * 60 * 60, JSON.stringify(profileData));

    // Return profile without PIN
    const { hashedPin: _, ...profileResponse } = profileData;
    res.json(profileResponse);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get profile
router.post('/get', async (req, res) => {
  try {
    const { pin, name } = req.body;

    if (!pin || !name) {
      return res.status(400).json({ error: 'PIN and name required' });
    }

    const profileId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const profileKey = `profile:${profileId}`;

    const profileStr = await redisClient.get(profileKey);

    if (!profileStr) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = JSON.parse(profileStr);

    // Verify PIN
    const pinMatch = await bcrypt.compare(pin, profile.hashedPin);

    if (!pinMatch) {
      return res.status(403).json({ error: 'Invalid PIN' });
    }

    // Return profile without PIN
    const { hashedPin: _, ...profileResponse } = profile;
    res.json(profileResponse);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Check if profile exists
router.post('/exists', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }

    const profileId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const profileKey = `profile:${profileId}`;

    const exists = await redisClient.exists(profileKey);

    res.json({ exists: exists === 1 });
  } catch (error) {
    console.error('Error checking profile:', error);
    res.status(500).json({ error: 'Failed to check profile' });
  }
});

export default router;
