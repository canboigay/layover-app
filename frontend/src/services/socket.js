import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSession(sessionId, userId) {
    this.socket?.emit('join_session', { sessionId, userId });
  }

  sendMessage(sessionId, userId, message) {
    this.socket?.emit('send_message', { sessionId, userId, message });
  }

  updateLocation(sessionId, userId, location, sharing) {
    this.socket?.emit('update_location', { sessionId, userId, location, sharing });
  }

  getMessages(sessionId) {
    this.socket?.emit('get_messages', { sessionId });
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }
}

export default new SocketService();
