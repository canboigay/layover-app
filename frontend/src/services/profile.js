const PROFILE_KEY = 'layover_user_profile';

export const getProfile = () => {
  const profile = localStorage.getItem(PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

export const saveProfile = (profileData) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
};

export const updateProfile = (updates) => {
  const profile = getProfile() || {};
  const updated = { ...profile, ...updates };
  saveProfile(updated);
  return updated;
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
