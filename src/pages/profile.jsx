import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, getUserDocument } from '../lib/firebase';
import './style.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }
    getUserDocument(uid)
      .then((data) => setProfile(data))
      .catch(() => setError('Could not load your profile. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      setError('Failed to log out. Please try again.');
      setLoggingOut(false);
    }
  };

  const displayName = profile?.firstName || auth.currentUser?.displayName || '';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <h1>{displayName || 'Your Profile'}</h1>
        <p className="profile-email">{profile?.email || auth.currentUser?.email}</p>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">Date of Birth</span>
            <span className="profile-value">{profile?.dateOfBirth || '—'}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Account Type</span>
            <span className="profile-value">
              {profile?.isMinor ? 'Minor (guardian-linked)' : 'Adult'}
            </span>
          </div>
        </div>

        <button
          className="profile-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}