import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowInstallBanner(false);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  return (
    <div className="home">
      <div className="home-container">
        <button className="btn-back-splash" onClick={() => navigate('/')}>
          ←
        </button>
        
        <div className="home-header">
          <button className="btn-profile" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <h1>Layover</h1>
          <p>Stay connected with your crew during layovers</p>
        </div>

        <div className="home-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/create')}
          >
            Create Session
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/join')}
          >
            Join Session
          </button>
        </div>

        {!isInstalled && showInstallBanner && (
          <div className="pwa-install-banner">
            <div className="pwa-install-content">
              <div className="pwa-icon">📱</div>
              <div className="pwa-text">
                <h3>Install Layover App</h3>
                <p>Add to home screen for quick access</p>
              </div>
            </div>
            {deferredPrompt ? (
              <button className="btn-install" onClick={handleInstallClick}>
                Install
              </button>
            ) : (
              <div className="pwa-instructions">
                <p className="pwa-hint">
                  iOS: Tap <span className="share-icon">⎋</span> then "Add to Home Screen"
                </p>
              </div>
            )}
            <button 
              className="btn-dismiss"
              onClick={() => setShowInstallBanner(false)}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        <div className="home-features">
          <button className="feature feature-btn" onClick={() => navigate('/profile')}>
            <h3>My Profile</h3>
            <p>Set up your info and airline</p>
          </button>
          <button className="feature feature-btn" onClick={() => navigate('/join')}>
            <h3>Quick Join</h3>
            <p>Enter session ID to join</p>
          </button>
          <button className="feature feature-btn" onClick={() => navigate('/compliance')}>
            <h3>Help</h3>
            <p>FAA compliance & guidelines</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
