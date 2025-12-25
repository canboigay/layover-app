import webpush from 'web-push';
import { redisClient } from '../config/redis.js';

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BNeGL-U72dwwLF9AfXnxSCVyndufgDStdPyFDyT8Vzj0qIA65JqhZIuhRmEq7owAjSme7wEi-2XFb3YbPO3z_98',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'UjG5QzfR1LTbATj4OiyTLuapBn9kba1_88hBOpu60zE'
};

webpush.setVapidDetails(
  'mailto:contact@layoverapp.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function subscribeUser(userId, sessionId, subscription) {
  const key = `push:${sessionId}:${userId}`;
  await redisClient.setEx(key, 24 * 60 * 60, JSON.stringify(subscription)); // 24 hour TTL
  console.log(`User ${userId} subscribed to push notifications`);
}

export async function unsubscribeUser(userId, sessionId) {
  const key = `push:${sessionId}:${userId}`;
  await redisClient.del(key);
  console.log(`User ${userId} unsubscribed from push notifications`);
}

export async function sendNotification(sessionId, userId, payload) {
  try {
    const key = `push:${sessionId}:${userId}`;
    const subscriptionStr = await redisClient.get(key);
    
    if (!subscriptionStr) {
      console.log(`No push subscription found for user ${userId}`);
      return false;
    }
    
    const subscription = JSON.parse(subscriptionStr);
    
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log(`Notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    
    // If subscription is invalid, remove it
    if (error.statusCode === 410) {
      await unsubscribeUser(userId, sessionId);
    }
    
    return false;
  }
}

export async function notifySessionMembers(sessionId, excludeUserId, payload) {
  try {
    const sessionStr = await redisClient.get(`session:${sessionId}`);
    if (!sessionStr) return;
    
    const session = JSON.parse(sessionStr);
    const promises = session.members
      .filter(m => m.userId !== excludeUserId)
      .map(m => sendNotification(sessionId, m.userId, payload));
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Error notifying session members:', error);
  }
}

export function getVapidPublicKey() {
  return vapidKeys.publicKey;
}
