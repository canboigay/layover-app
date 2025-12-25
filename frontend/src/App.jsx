import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import Session from './pages/Session';
import Profile from './pages/Profile';
import Compliance from './pages/Compliance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/join/:sessionId?" element={<JoinSession />} />
        <Route path="/session/:sessionId" element={<Session />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
