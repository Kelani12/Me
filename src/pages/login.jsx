import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../assets/logo.jpeg';
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    return value.length >= 6 ? '' : 'Password must be at least 6 characters';
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    if (emailErr || passwordErr) {
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      const errorMsg = err.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : err.code === 'auth/too-many-requests'
        ? 'Too many login attempts. Please try again later'
        : err.message || 'Failed to log in. Please try again';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-form-wrap">
        <div className="auth-form">
          <a href="/" className="back-home">
            ← Back to home
          </a>
          <div className="avatar-badge">
            <img src={logo} alt="MenaCare" className="badge-logo" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your health dashboard</p>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span>✓</span>
              {success}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-input-wrapper">
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onBlur={handleEmailBlur}
                  placeholder="you@example.com"
                  className={emailError ? 'input-error' : ''}
                  disabled={loading}
                />
              </div>
              {emailError && <div className="input-helper error">{emailError}</div>}
            </div>

            <div className="form-input-wrapper">
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    onBlur={handlePasswordBlur}
                    placeholder="••••••••"
                    className={passwordError ? 'input-error' : ''}
                    disabled={loading}
                    style={{ paddingRight: '40px', width: '100%', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: loading ? 'default' : 'pointer',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {passwordError && <div className="input-helper error">{passwordError}</div>}
            </div>

            <div className="field-row">
              <span></span>
              <a href="/forgot-password">Forgot your password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading || !!emailError || !!passwordError}
            >
              {loading ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    marginRight: '8px'
                  }}></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>


          <div className="form-separator">
            <span>or continue with</span>
          </div>

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
            <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}