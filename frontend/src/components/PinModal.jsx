import { useState } from 'react';
import './PinModal.css';

function PinModal({ onComplete, mode = 'setup' }) {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (mode === 'login' && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    onComplete({ pin, name: name.trim() });
  };

  return (
    <div className="pin-modal-overlay">
      <div className="pin-modal">
        <h2>{mode === 'setup' ? 'Create Your PIN' : 'Sync Your Profile'}</h2>
        <p className="pin-modal-desc">
          {mode === 'setup' 
            ? 'Create a 4-digit PIN to sync your profile across devices' 
            : 'Enter your name and PIN to load your profile'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'login' && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Your name"
                autoFocus
              />
            </div>
          )}

          <div className="form-group">
            <label>PIN</label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              className="pin-input"
              autoFocus={mode === 'setup'}
              maxLength={4}
            />
            <div className="pin-dots">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`pin-dot ${pin.length > i ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="pin-modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pin.length !== 4 || (mode === 'login' && !name.trim())}
            >
              {mode === 'setup' ? 'Set PIN' : 'Load Profile'}
            </button>
            {mode === 'login' && (
              <button
                type="button"
                className="btn btn-link"
                onClick={() => onComplete(null)}
              >
                Skip
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PinModal;
