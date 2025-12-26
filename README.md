# Layover - Flight Attendant Crew Coordination App

A secure, ephemeral communication and coordination app designed for flight attendants during authorized rest periods (layovers).

## ⚠️ Important: FAA Compliance

**This app is for OFF-DUTY use only during authorized rest periods.**

- Complies with 14 CFR § 121.467 (Flight Attendant Rest Requirements)
- Does NOT constitute duty time or work responsibility
- Does NOT replace airline operational communications
- All usage is voluntary and for personal safety coordination

See [FAA_COMPLIANCE.md](./FAA_COMPLIANCE.md) for complete compliance documentation.

## Features

### Core Functionality
- ⏱️ **Time-Limited Sessions**: Auto-expire after layover duration (2-24 hours)
- 💬 **Minimal Chat**: Text-only crew coordination
- 📍 **Optional Location Sharing**: Voluntary, privacy-first location sharing for safety
- 🔒 **PIN Protection**: Optional crew-only access control
- 🗺️ **Live Map**: Real-time crew location visualization
- 👥 **Crew List**: See who's online and sharing location

### Security & Privacy
- **Ephemeral Data**: All data auto-deletes when session expires
- **No Permanent Tracking**: Location data only exists during session
- **Crew-Only**: Sessions can be PIN-protected for crew members only
- **Voluntary**: All participation and location sharing is opt-in
- **No Third-Party Access**: Data never shared with airlines or management

## Tech Stack

### Backend
- Node.js + Express
- Socket.io (WebSocket real-time communication)
- Redis (ephemeral session storage with TTL)
- QR Code generation
- Rate limiting & input validation

### Frontend
- React 18
- React Router
- Leaflet + React-Leaflet (mapping)
- Socket.io Client
- Vite (build tool)

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- Redis (local or remote instance)

### 1. Install Redis

**macOS** (Homebrew):
```bash
brew install redis
brew services start redis
```

**Linux**:
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows**: Use WSL or download from [redis.io](https://redis.io/download)

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Verify Redis Connection

```bash
redis-cli ping
# Should respond: PONG
```

## Usage Flow

### Creating a Session
1. Open app → "Create Session"
2. Enter your name and airline (optional)
3. Select layover duration (2-24 hours)
4. Optional: Set 4-digit PIN for crew-only access
5. Share generated QR code or link with crew

### Joining a Session
1. Scan QR code or enter Session ID
2. Accept FAA compliance disclaimer
3. Enter your name and PIN (if required)
4. Join session

### During Session
- **Chat Tab**: Send text messages to crew
- **Map Tab**: View crew locations (if sharing enabled)
- **Crew Tab**: See all crew members and location status
- **Location Toggle**: Enable/disable location sharing anytime

### Location Sharing
- Completely optional and voluntary
- Toggle on/off at any time
- Updates every 5 minutes
- Shows "last updated" timestamp
- Automatically stopped when leaving session

## API Endpoints

### Sessions
```
POST   /api/sessions/create       - Create new session
POST   /api/sessions/join         - Join existing session
GET    /api/sessions/:id          - Get session details
POST   /api/sessions/:id/location - Update user location
```

### WebSocket Events
```
Client → Server:
- join_session
- send_message
- update_location
- get_messages

Server → Client:
- session_joined
- new_message
- user_joined
- user_disconnected
- location_updated
- messages_history
```

## Security Features

### Input Validation
- Message length limits (500 chars)
- Session ID validation
- PIN format validation (4 digits)
- Rate limiting (100 requests per 15 min)

### Data Protection
- Redis TTL ensures auto-deletion
- No persistent user tracking
- Location data only during active session
- Optional PIN protection

### Privacy Controls
- Individual location sharing toggle
- Crew-only session visibility
- No management/airline access
- Session-based data only

## Deployment Considerations

### Environment Variables
```env
PORT=3001
REDIS_URL=redis://your-redis-host:6379
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
APP_URL=https://your-domain.com
```

### Production Checklist
- [ ] Use Redis with persistence disabled (ephemeral only)
- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Monitor Redis memory usage
- [ ] Add health check endpoints
- [ ] Set up error logging
- [ ] Display FAA disclaimer prominently

## Legal & Compliance

### Disclaimers
- App is for off-duty use during authorized rest periods only
- Does not constitute work time or duty period
- Not a replacement for airline operational systems
- Users responsible for complying with all FAA regulations
- Location sharing is for personal safety coordination only

### Liability
- App provider not affiliated with any airline or aviation authority
- No liability for misuse or violation of regulations
- Users must confirm they are on authorized rest period
- Emergency services (911) should be used for actual emergencies

## Future Enhancements

- [ ] QR code scanner (camera integration)
- [ ] Push notifications (session ending soon)
- [ ] Emergency SOS button
- [ ] Offline message queuing
- [ ] Background location updates (with permissions)
- [ ] Group safety check-in feature
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) installation

## Contributing

When contributing, ensure:
1. All changes maintain FAA compliance
2. Privacy-first approach preserved
3. Security measures not compromised
4. Ephemeral nature of data maintained

## License

[Add your license here]

## Support

For compliance questions: compliance@layover-app.com  
For technical support: support@layover-app.com

---

**Last Updated**: December 2025  
**Version**: 1.0.0
# Build trigger
