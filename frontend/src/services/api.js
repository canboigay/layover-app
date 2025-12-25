import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const createSession = async (data) => {
  const response = await axios.post(`${API_BASE}/sessions/create`, data);
  return response.data;
};

export const joinSession = async (sessionId, userData) => {
  const response = await axios.post(`${API_BASE}/sessions/join`, {
    sessionId,
    ...userData
  });
  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await axios.get(`${API_BASE}/sessions/${sessionId}`);
  return response.data;
};

export const updateLocation = async (sessionId, userId, location, sharing) => {
  const response = await axios.post(`${API_BASE}/sessions/${sessionId}/location`, {
    userId,
    location,
    sharing
  });
  return response.data;
};
