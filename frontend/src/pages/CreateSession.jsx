import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/api';
import './CreateSession.css';

function CreateSession() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    airline: '',
    duration: 240,
    pin: ''
  });
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  const durationOptions = [
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 480, label: '8 hours' },
    { value: 720, label: '12 hours' },
    { value: 1440, label: '24 hours' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const location = await getCurrentLocation();
      
      const data = await createSession({
        creatorName: formData.name,
        airline: formData.airline,
        duration: formData.duration,
        pin: formData.pin || null,
        location
      });

      setSessionData(data);
      localStorage.setItem('layover_session', JSON.stringify({
        sessionId: data.sessionId,
        userId: data.userId
      }));
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => resolve({})
        );
      } else {
        resolve({});
      }
    });
  };

  const handleJoinSession = () => {
    navigate(`/session/${sessionData.sessionId}`);
  };

  const shareUrl = () => {
    if (navigator.share && sessionData) {
      navigator.share({
        title: 'Join my layover session',
        text: 'Join my crew layover session',
        url: sessionData.joinUrl
      });
    } else {
      navigator.clipboard.writeText(sessionData.joinUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (sessionData) {
    return (
      <div className="create-session">
        <div className="session-created">
          <h2>Session Created!</h2>
          
          <div className="qr-container">
            <img src={sessionData.qrCode} alt="QR Code" className="qr-code" />
            <p className="session-id">Session ID: {sessionData.sessionId}</p>
          </div>

          <div className="session-info">
            <p>Share this QR code or link with your crew</p>
            {sessionData.pin && (
              <p className="pin-info">PIN: <strong>{sessionData.pin}</strong></p>
            )}
          </div>

          <div className="session-actions">
            <button className="btn btn-primary" onClick={handleJoinSession}>
              Enter Session
            </button>
            <button className="btn btn-secondary" onClick={shareUrl}>
              Share Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-session">
      <div className="form-container">
        <h2>Create Layover Session</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Airline (Optional)</label>
            <input
              type="text"
              value={formData.airline}
              onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
              placeholder="e.g., United, Delta"
            />
          </div>

          <div className="form-group">
            <label>Layover Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            >
              {durationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>PIN (Optional)</label>
            <input
              type="text"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
              placeholder="4-digit PIN for crew only"
              maxLength="4"
              pattern="[0-9]{4}"
            />
            <small>Set a PIN to restrict access to crew members only</small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Session'}
          </button>

          <button 
            type="button" 
            className="btn btn-link"
            onClick={() => navigate('/home')}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSession;
