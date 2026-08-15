import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Visual side */}
      <div className="auth-visual">
        <div>
          <div className="brand" style={{ marginBottom: '60px' }}>
            <div className="brand-mark">
              <svg viewBox="0 0 38 38" fill="none">
                <path
                  d="M19 2C10.2 2 3 9.2 3 18c0 8.8 7.2 16 16 16s16-7.2 16-16-7.2-16-16-16zm0 28c-6.6 0-12-5.4-12-12s5.4-12 12-12 12 5.4 12 12-5.4 12-12 12z"
                  fill="url(#grad)" opacity="0.9"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF99D8" />
                    <stop offset="100%" stopColor="#64007D" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-word">
              <span className="mena">Mena</span>
              <span className="care">Care</span>
            </div>
          </div>
          <div className="quote">
            <em>Because Her Future Shouldn't Pause</em>
            <span>Track, learn, and thrive through every phase</span>
          </div>
        </div>
        <div className="moon-phases">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Form side */}
      <div className="auth-form-wrap">
        <div className="auth-form">
          <a href="/" className="back-home">
            ← Back to home
          </a>

          <h1>Welcome Back</h1>
          <p>Sign in to access your health dashboard</p>

          {error && (
            <div style={{
              background: 'rgba(255, 173, 173, 0.15)',
              color: '#8A1FA6',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="field-row">
              <span></span>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider">or continue with</div>

          <div className="social-row">
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.5 9c0-4.14-3.36-7.5-7.5-7.5S1.5 4.86 1.5 9c0 3.73 2.7 6.84 6.23 7.35v-5.2h-1.88V9h1.88V7.12c0-1.86 1.1-2.89 2.78-2.89.81 0 1.66.14 1.66.14v1.82h-.93c-.92 0-1.21.57-1.21 1.16V9h2.06l-.33 2.15h-1.73v5.2C13.8 15.84 16.5 12.73 16.5 9z" fill="#241633" />
              </svg>
            </button>
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.5 9c0-4.14-3.36-7.5-7.5-7.5S1.5 4.86 1.5 9c0-3.56 2.56-6.52 5.9-7.32v4.64h-1.78V9h1.78v1.4c0 1.75 1.04 2.72 2.63 2.72.76 0 1.56-.14 1.56-.14v-1.72h-.88c-.87 0-1.14-.54-1.14-1.1V9h1.95l-.31-2.13h-1.64V1.68c3.34.8 5.9 3.76 5.9 7.32z" fill="#241633" />
              </svg>
            </button>
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.8 2.1c-.5.2-1 .4-1.6.5.6-.4 1-1 1.2-1.7-.5.3-1.1.5-1.7.7-.5-.5-1.2-.9-2-.9-1.5 0-2.8 1.2-2.8 2.8 0 .2 0 .5.1.7C7.3 3 4.9 1.9 3.3.3c-.2.3-.3.7-.3 1.1 0 .9.5 1.8 1.3 2.3-.4 0-.9-.1-1.3-.3v.1c0 1.4 1 2.5 2.3 2.8-.2.1-.5.1-.8.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3 2.3-1 .8-2.3 1.3-3.7 1.3-.2 0-.5 0-.7-.1 1.3.9 3 1.4 4.8 1.4 5.7 0 8.8-4.7 8.8-8.8v-.4c.6-.4 1.1-.9 1.5-1.5z" fill="#241633" />
              </svg>
            </button>
          </div>

          <div className="switch-line">
            Don't have an account?{' '}
            <a href="/signup">Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
