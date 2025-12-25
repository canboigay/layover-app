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
          <div className="feature">
            <h3>Time-Limited</h3>
            <p>Sessions auto-expire after your layover</p>
          </div>
          <div className="feature">
            <h3>Location Sharing</h3>
            <p>Optional real-time location with privacy controls</p>
          </div>
          <div className="feature">
            <h3>Minimal Chat</h3>
            <p>Quick coordination with your crew</p>
          </div>
          <div className="feature">
            <h3>Privacy First</h3>
            <p>All data deleted when session expires</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
