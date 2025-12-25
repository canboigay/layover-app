import axios from 'axios';

const PROFILE_KEY = 'layover_user_profile';
const PIN_KEY = 'layover_user_pin';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getProfile = () => {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

export const saveProfile = (profileData) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
};

export const getStoredPin = () => {
  return localStorage.getItem(PIN_KEY);
};

export const storePin = (pin) => {
  localStorage.setItem(PIN_KEY, pin);
};

export const clearPin = () => {
  localStorage.removeItem(PIN_KEY);
};

export const updateProfile = async (updates) => {
  const profile = getProfile() || {};
  const updated = { ...profile, ...updates };
  saveProfile(updated);
  
  // Sync to backend if PIN is set
  const pin = getStoredPin();
  if (pin && updated.name) {
    try {
      await syncProfileToServer(pin, updated);
    } catch (error) {
      console.error('Failed to sync profile to server:', error);
    }
  }
  
  return updated;
};

export const syncProfileToServer = async (pin, profileData) => {
  const response = await axios.post(`${API_BASE}/profiles/save`, {
    pin,
    ...profileData
  });
  return response.data;
};

export const fetchProfileFromServer = async (pin, name) => {
  const response = await axios.post(`${API_BASE}/profiles/get`, {
    pin,
    name
  });
  return response.data;
};

export const checkProfileExists = async (name) => {
  const response = await axios.post(`${API_BASE}/profiles/exists`, { name });
  return response.data.exists;
};

export const uploadProfilePhoto = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 200x200
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
