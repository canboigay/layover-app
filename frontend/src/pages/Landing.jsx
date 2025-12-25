import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Retro stripe decorations */}
      <div className="retro-stripes">
        <div className="stripe stripe-1"></div>
        <div className="stripe stripe-2"></div>
        <div className="stripe stripe-3"></div>
      </div>

      <div className="landing-hero">
        <div className="hero-content">
          <div className="logo-badge">EST. 2025</div>
          <h1 className="hero-title">
            <span className="title-top">LAY</span>
            <span className="title-bottom">OVER</span>
          </h1>
          <p className="hero-subtitle">Stay Connected With Your Crew</p>
          <button className="btn-cta" onClick={() => navigate('/home')}>
            Get Started
            <span className="btn-arrow">→</span>
          </button>
        </div>
        
        <div className="hero-graphic">
          <svg className="plane-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 20 L55 20 L58 70 L50 70 Z" fill="currentColor" opacity="0.9"/>
            <path d="M35 45 L75 35 L76 48 L52 52 Z" fill="currentColor"/>
            <path d="M50 20 L55 5 L57 20 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <svg className="feature-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="20" fill="none" stroke="#FF6B2C" strokeWidth="3"/>
            <line x1="25" y1="25" x2="25" y2="15" stroke="#FF6B2C" strokeWidth="3" strokeLinecap="round"/>
            <line x1="25" y1="25" x2="32" y2="25" stroke="#FF6B2C" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <h3>Time-Limited Sessions</h3>
          <p>Sessions automatically expire after your layover ends. No data left behind.</p>
        </div>

        <div className="feature-card">
          <svg className="feature-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 10 C20 10 15 15 15 22 C15 30 25 40 25 40 C25 40 35 30 35 22 C35 15 30 10 25 10 Z" fill="none" stroke="#FF6B2C" strokeWidth="3"/>
            <circle cx="25" cy="22" r="4" fill="#FF6B2C"/>
          </svg>
          <h3>Safe Location Sharing</h3>
          <p>Optional real-time location with privacy controls. Share only what you want.</p>
        </div>

        <div className="feature-card">
          <svg className="feature-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="15" width="30" height="25" rx="5" fill="none" stroke="#FF6B2C" strokeWidth="3"/>
            <path d="M15 20 L20 25 L15 30" fill="none" stroke="#FF6B2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="25" y1="28" x2="32" y2="28" stroke="#FF6B2C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>Quick Coordination</h3>
          <p>Instant chat and QR codes to connect your crew in seconds.</p>
        </div>

        <div className="feature-card">
          <svg className="feature-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="20" width="20" height="18" rx="2" fill="none" stroke="#FF6B2C" strokeWidth="3"/>
            <path d="M20 20 L20 15 C20 12 23 10 25 10 C27 10 30 12 30 15 L30 20" fill="none" stroke="#FF6B2C" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="25" cy="29" r="2" fill="#FF6B2C"/>
          </svg>
          <h3>Privacy First</h3>
          <p>All data deleted when sessions expire. FAA compliant for off-duty use.</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to coordinate your next layover?</h2>
        <button className="btn-cta-large" onClick={() => navigate('/home')}>
          Launch App
        </button>
        <p className="disclaimer">
          For off-duty use only during authorized rest periods
        </p>
      </div>
    </div>
  );
}

export default Landing;
