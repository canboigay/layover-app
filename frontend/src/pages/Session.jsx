import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { QRCodeSVG } from 'qrcode.react';
import { getSession } from '../services/api';
import socketService from '../services/socket';
import 'leaflet/dist/leaflet.css';
import './Session.css';

// Custom marker icon with profile photos
import L from 'leaflet';

// Create custom divIcon for profile photos
const createProfileIcon = (photoUrl, name) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container">
        <div class="marker-photo" style="background-image: url(${photoUrl || '/icon-192.png'});"></div>
        <div class="marker-pin"></div>
      </div>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60]
  });
};

function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showQR, setShowQR] = useState(false);
  const messagesEndRef = useRef(null);
  const locationIntervalRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('layover_session');
    if (!stored) {
      navigate('/');
      return;
    }

    const { sessionId: storedId, userId: storedUserId } = JSON.parse(stored);
    if (storedId !== sessionId) {
      navigate('/');
      return;
    }

    setUserId(storedUserId);
    loadSession();
    initializeSocket(storedUserId);

    return () => {
      socketService.disconnect();
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [sessionId, navigate]);

  useEffect(() => {
    if (session) {
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async () => {
    try {
      const data = await getSession(sessionId);
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      alert('Session not found or expired');
      navigate('/');
    }
  };

  const initializeSocket = (uid) => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      socketService.joinSession(sessionId, uid);
      socketService.getMessages(sessionId);
    });

    socket.on('session_joined', ({ session: sessionData }) => {
      setSession(sessionData);
    });

    socket.on('messages_history', ({ messages: msgs }) => {
      setMessages(msgs);
    });

    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user_joined', ({ name, airline }) => {
      const joinMsg = {
        messageId: Date.now(),
        type: 'system',
        message: `${name}${airline ? ` (${airline})` : ''} joined`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, joinMsg]);
      loadSession();
    });

    socket.on('location_updated', ({ userId: updatedUserId, location, sharing }) => {
      setSession(prev => {
        if (!prev) return prev;
        const updatedMembers = prev.members.map(member => 
          member.userId === updatedUserId 
            ? { ...member, lastLocation: location, locationSharing: sharing }
            : member
        );
        return { ...prev, members: updatedMembers };
      });
    });

    socket.on('user_disconnected', () => {
      loadSession();
    });
  };

  const updateTimeRemaining = () => {
    if (!session) return;
    
    const now = Date.now();
    const remaining = session.expiresAt - now;
    
    if (remaining <= 0) {
      setTimeRemaining('Session expired');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    socketService.sendMessage(sessionId, userId, newMessage);
    setNewMessage('');
  };

  const toggleLocationSharing = async () => {
    const newState = !locationSharing;
    setLocationSharing(newState);

    if (newState) {
      startLocationTracking();
    } else {
      stopLocationTracking();
      socketService.updateLocation(sessionId, userId, null, false);
    }
  };

  const startLocationTracking = () => {
    if ('geolocation' in navigator) {
      // Get initial location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(loc);
          socketService.updateLocation(sessionId, userId, loc, true);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to access location. Please check your browser permissions.');
          setLocationSharing(false);
        }
      );

      // Update location every 5 minutes
      locationIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setCurrentLocation(loc);
            socketService.updateLocation(sessionId, userId, loc, true);
          },
          (error) => console.error('Error updating location:', error)
        );
      }, 5 * 60 * 1000);
    }
  };

  const stopLocationTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  const getMapCenter = () => {
    const membersWithLocation = session?.members.filter(m => 
      m.locationSharing && m.lastLocation?.lat && m.lastLocation?.lng
    ) || [];

    if (membersWithLocation.length === 0) {
      return session?.location?.lat ? [session.location.lat, session.location.lng] : [40.7128, -74.0060];
    }

    const avgLat = membersWithLocation.reduce((sum, m) => sum + m.lastLocation.lat, 0) / membersWithLocation.length;
    const avgLng = membersWithLocation.reduce((sum, m) => sum + m.lastLocation.lng, 0) / membersWithLocation.length;
    
    return [avgLat, avgLng];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLocationTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleShareLink = async () => {
    const joinUrl = `${window.location.origin}/join/${sessionId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Layover Session',
          text: 'Join my crew layover session',
          url: joinUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(joinUrl);
        }
      }
    } else {
      copyToClipboard(joinUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Link copied to clipboard!');
    });
  };

  if (!session) {
    return (
      <div className="session-loading">
        <p>Loading session...</p>
      </div>
    );
  }

  const currentUser = session.members.find(m => m.userId === userId);

  return (
    <div className="session-container">
      <div className="session-header">
        <div className="session-info">
          <h2>Layover Session</h2>
          <p className="session-id">ID: {sessionId}</p>
          <p className="time-remaining">{timeRemaining}</p>
        </div>
        
        <div className="session-controls">
          <button 
            className="btn-secondary"
            onClick={() => setShowQR(true)}
          >
            QR Code
          </button>
          <button 
            className="btn-secondary"
            onClick={handleShareLink}
          >
            Share Link
          </button>
          <button 
            className="btn-location"
            onClick={toggleLocationSharing}
            style={{ background: locationSharing ? '#10b981' : '#6b7280' }}
          >
            {locationSharing ? 'Sharing Location' : 'Share Location'}
          </button>
        </div>
      </div>

      <div className="session-tabs">
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Map
        </button>
        <button 
          className={`tab ${activeTab === 'crew' ? 'active' : ''}`}
          onClick={() => setActiveTab('crew')}
        >
          Crew ({session.members.length})
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <span>Chat</span>
        </button>
        <button 
          className={`tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <span>Map</span>
        </button>
        <button 
          className={`tab ${activeTab === 'crew' ? 'active' : ''}`}
          onClick={() => setActiveTab('crew')}
        >
          <span>Crew</span>
        </button>
      </div>

      <div className="session-content">
        {activeTab === 'chat' && (
          <div className="chat-view">
            <div className="messages">
              {messages.map((msg) => (
                <div 
                  key={msg.messageId} 
                  className={`message ${msg.type === 'system' ? 'system' : msg.userId === userId ? 'own' : 'other'}`}
                >
                  {msg.type === 'system' ? (
                    <p className="system-text">{msg.message}</p>
                  ) : (
                    <>
                      <div className="message-header">
                        <span className="message-name">{msg.name}</span>
                        <span className="message-time">{formatTimestamp(msg.timestamp)}</span>
                      </div>
                      <p className="message-text">{msg.message}</p>
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                maxLength="500"
              />
              <button type="submit" disabled={!newMessage.trim()}>
                Send
              </button>
            </form>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="map-view">
            <div className="map-notice">
              <p>Location sharing is voluntary and for safety coordination only</p>
            </div>
            <MapContainer 
              center={getMapCenter()} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {session.members.map(member => {
                if (!member.locationSharing || !member.lastLocation?.lat || !member.lastLocation?.lng) {
                  return null;
                }
                
                const icon = createProfileIcon(member.photoUrl, member.name);
                
                return (
                  <Marker 
                    key={member.userId}
                    position={[member.lastLocation.lat, member.lastLocation.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="marker-popup">
                        {member.photoUrl && (
                          <img 
                            src={member.photoUrl} 
                            alt={member.name} 
                            className="popup-photo"
                          />
                        )}
                        <strong>{member.name}</strong>
                        {member.airline && (
                          <span className="popup-airline">{member.airline}</span>
                        )}
                        <p className="location-time">
                          Updated: {formatLocationTime(member.lastLocation.updatedAt)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {activeTab === 'crew' && (
          <div className="crew-view">
            <div className="crew-list">
              {session.members.map(member => (
                <div key={member.userId} className={`crew-member ${member.userId === userId ? 'current' : ''}`}>
                  <div className="crew-info">
                    <h4>{member.name} {member.userId === userId && '(You)'}</h4>
                    {member.airline && <p className="crew-airline">{member.airline}</p>}
                    <p className="crew-joined">Joined {formatTimestamp(member.joinedAt)}</p>
                  </div>
                  <div className="crew-status">
                    {member.locationSharing ? (
                      <span className="status-badge active">
                        Location Shared
                        {member.lastLocation?.updatedAt && (
                          <span className="status-time">
                            {formatLocationTime(member.lastLocation.updatedAt)}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="status-badge inactive">Not Sharing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="session-footer">
        <button className="btn-secondary" onClick={() => {
          if (confirm('Are you sure you want to leave this session?')) {
            localStorage.removeItem('layover_session');
            navigate('/');
          }
        }}>
          Leave Session
        </button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Scan to Join</h3>
            <div className="qr-code-container">
              <QRCodeSVG 
                value={`${window.location.origin}/join/${sessionId}`}
                size={250}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-modal-id">Session ID: {sessionId}</p>
            <button className="btn-close" onClick={() => setShowQR(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Session;
