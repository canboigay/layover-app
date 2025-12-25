import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { joinSession } from '../services/api';
import './JoinSession.css';

function JoinSession() {
  const navigate = useNavigate();
  const { sessionId: urlSessionId } = useParams();
  const [formData, setFormData] = useState({
    sessionId: urlSessionId || '',
    name: '',
    airline: '',
    pin: ''
  });
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  useEffect(() => {
    if (urlSessionId) {
      setFormData(prev => ({ ...prev, sessionId: urlSessionId }));
    }
  }, [urlSessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedDisclaimer) {
      alert('You must accept the disclaimer to continue');
      return;
    }

    setLoading(true);

    try {
      const data = await joinSession(formData.sessionId, {
        name: formData.name,
        airline: formData.airline,
        pin: formData.pin || null
      });

      localStorage.setItem('layover_session', JSON.stringify({
        sessionId: formData.sessionId,
        userId: data.userId
      }));

      navigate(`/session/${formData.sessionId}`);
    } catch (error) {
      console.error('Error joining session:', error);
      const message = error.response?.data?.error || 'Failed to join session. Please check the session ID and try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (showDisclaimer) {
    return (
      <div className="join-session">
        <div className="disclaimer-container">
          <h2>⚠️ Important Notice</h2>
          
          <div className="disclaimer-content">
            <h3>FAA Compliance & Off-Duty Use Only</h3>
            
            <div className="disclaimer-text">
              <p><strong>This app is for OFF-DUTY use only during authorized rest periods.</strong></p>
              
              <ul>
                <li>Use of this app does NOT constitute duty time or work responsibility</li>
                <li>This app does NOT replace airline operational communications</li>
                <li>All participation is completely voluntary</li>
                <li>You must be on an authorized rest period to use this app</li>
                <li>Location sharing is optional and for personal safety coordination only</li>
              </ul>

              <p className="disclaimer-legal">
                By continuing, you confirm that you are currently on an authorized rest period 
                and that your use of this app is voluntary and for personal coordination purposes only.
              </p>
            </div>

            <div className="disclaimer-actions">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptedDisclaimer}
                  onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                />
                <span>I understand and accept these terms</span>
              </label>

              <button
                className="btn btn-primary"
                onClick={() => setShowDisclaimer(false)}
                disabled={!acceptedDisclaimer}
              >
                Continue
              </button>

              <button
                className="btn btn-link"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-session">
      <div className="form-container">
        <h2>Join Layover Session</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Session ID</label>
            <input
              type="text"
              value={formData.sessionId}
              onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
              required
              placeholder="Enter session ID"
            />
          </div>

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
            <label>PIN (If Required)</label>
            <input
              type="text"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
              placeholder="4-digit PIN"
              maxLength="4"
              pattern="[0-9]{4}"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Joining...' : 'Join Session'}
          </button>

          <button 
            type="button" 
            className="btn btn-link"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinSession;
