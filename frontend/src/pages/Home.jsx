import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-container">
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

        <div className="home-features">
          <button className="feature feature-btn" onClick={() => navigate('/profile')}>
            <h3>My Profile</h3>
            <p>Set up your info and airline</p>
          </button>
          <button className="feature feature-btn" onClick={() => navigate('/')}>
            <h3>About</h3>
            <p>Learn more about Layover</p>
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
