import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, uploadProfilePhoto, getInitials } from '../services/profile';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(getProfile() || {});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    airline: profile.airline || '',
    bio: profile.bio || '',
    dietaryRestrictions: profile.dietaryRestrictions || '',
    interests: profile.interests || ''
  });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const photoUrl = await uploadProfilePhoto(file);
      const updated = updateProfile({ photo: photoUrl });
      setProfile(updated);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    }
  };

  const handleSave = () => {
    const updated = updateProfile(formData);
    setProfile(updated);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      airline: profile.airline || '',
      bio: profile.bio || '',
      dietaryRestrictions: profile.dietaryRestrictions || '',
      interests: profile.interests || ''
    });
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1>Profile</h1>
        {!editing && (
          <button className="btn-edit" onClick={() => setEditing(true)}>
            Edit
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo-wrapper" onClick={handlePhotoClick}>
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                {getInitials(profile.name || 'User')}
              </div>
            )}
            <div className="photo-overlay">
              <span>Change Photo</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </div>

        {editing ? (
          <div className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Airline</label>
              <input
                type="text"
                value={formData.airline}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                placeholder="e.g., United, Delta"
              />
            </div>

            <div className="form-group">
              <label>Bio / Status</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Available for dinner, exploring the city..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Dietary Restrictions</label>
              <input
                type="text"
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                placeholder="Vegetarian, Gluten-free, etc."
              />
            </div>

            <div className="form-group">
              <label>Interests</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="Running, Museums, Food tours"
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSave}>
                Save Profile
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-display">
            <div className="profile-field">
              <label>Name</label>
              <p>{profile.name || 'Not set'}</p>
            </div>

            <div className="profile-field">
              <label>Airline</label>
              <p>{profile.airline || 'Not set'}</p>
            </div>

            {profile.bio && (
              <div className="profile-field">
                <label>Bio / Status</label>
                <p>{profile.bio}</p>
              </div>
            )}

            {profile.dietaryRestrictions && (
              <div className="profile-field">
                <label>Dietary Restrictions</label>
                <p>{profile.dietaryRestrictions}</p>
              </div>
            )}

            {profile.interests && (
              <div className="profile-field">
                <label>Interests</label>
                <p>{profile.interests}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
