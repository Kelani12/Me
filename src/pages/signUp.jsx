import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, createUserDocument, createGuardian } from '../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import logo from '../assets/logo.jpeg';
import './style.css';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

const toggleBtnStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  padding: 0,
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center'
};

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
    guardianRelationship: ''
  });
  const navigate = useNavigate();

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const isMinor = dateOfBirth && !isNaN(new Date(dateOfBirth).getTime())
    ? calculateAge(dateOfBirth) < 18
    : false;

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  };

  const getPasswordStrengthLabel = (strength) => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[strength] || '';
  };

  const getPasswordStrengthClass = (strength) => {
    const classes = ['', 'weak', 'fair', 'good', 'strong'];
    return classes[strength] || '';
  };

  const validateFullName = (value) => {
    if (!value) return 'Full name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email';
  };

  const validateDateOfBirth = (value) => {
    if (!value) return 'Date of birth is required';
    const dob = new Date(value);
    if (isNaN(dob.getTime())) return 'Please enter a valid date';
    if (dob > new Date()) return 'Date of birth cannot be in the future';
    if (calculateAge(value) > 120) return 'Please enter a valid date of birth';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
    if (!/\d/.test(value)) return 'Password must include a number';
    return '';
  };

  const validateConfirmPassword = (pwd, confirmPwd) => {
    if (!confirmPwd) return 'Please confirm your password';
    if (pwd !== confirmPwd) return 'Passwords do not match';
    return '';
  };

  const validateGuardianName = (value) => (!value ? "Guardian's name is required" : '');

  const validateGuardianEmail = (value) => {
    if (!value) return "Guardian's email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email';
  };

  const validateGuardianPhone = (value) => (!value ? "Guardian's phone number is required" : '');

  const validateGuardianRelationship = (value) => (!value ? 'Relationship to guardian is required' : '');

  const handleFieldBlur = (field) => {
    let error = '';
    switch (field) {
      case 'fullName':
        error = validateFullName(fullName);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'dateOfBirth':
        error = validateDateOfBirth(dateOfBirth);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(password, confirmPassword);
        break;
      case 'guardianName':
        error = validateGuardianName(guardianName);
        break;
      case 'guardianEmail':
        error = validateGuardianEmail(guardianEmail);
        break;
      case 'guardianPhone':
        error = validateGuardianPhone(guardianPhone);
        break;
      case 'guardianRelationship':
        error = validateGuardianRelationship(guardianRelationship);
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const fullNameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const dateOfBirthErr = validateDateOfBirth(dateOfBirth);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(password, confirmPassword);

    const guardianNameErr = isMinor ? validateGuardianName(guardianName) : '';
    const guardianEmailErr = isMinor ? validateGuardianEmail(guardianEmail) : '';
    const guardianPhoneErr = isMinor ? validateGuardianPhone(guardianPhone) : '';
    const guardianRelationshipErr = isMinor ? validateGuardianRelationship(guardianRelationship) : '';

    if (
      fullNameErr || emailErr || dateOfBirthErr || passwordErr || confirmPasswordErr ||
      guardianNameErr || guardianEmailErr || guardianPhoneErr || guardianRelationshipErr
    ) {
      setFieldErrors({
        fullName: fullNameErr,
        email: emailErr,
        dateOfBirth: dateOfBirthErr,
        password: passwordErr,
        confirmPassword: confirmPasswordErr,
        guardianName: guardianNameErr,
        guardianEmail: guardianEmailErr,
        guardianPhone: guardianPhoneErr,
        guardianRelationship: guardianRelationshipErr
      });
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Authentication profile
      await updateProfile(user, {
        displayName: fullName
      });

      // If the user is a minor, create their guardian doc first so we can link it
      let guardianId = null;
      if (isMinor) {
        guardianId = await createGuardian({
          name: guardianName,
          email: guardianEmail,
          phone: guardianPhone,
          relationship: guardianRelationship,
        });
      }

      // Create the user's Firestore document
      await createUserDocument(user.uid, {
        firstName: fullName,
        email,
        dateOfBirth,
        isMinor,
        guardianId,
      });

      setSuccess('Account created successfully! Redirecting...');

      setTimeout(() => navigate('/onboarding'), 1500);
    } catch (err) {
      const errorMsg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : err.code === 'auth/weak-password'
        ? 'Password is too weak. Please use a stronger password'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : err.message || 'Failed to create account. Please try again';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <div className="auth-shell">
      <div className="auth-form-wrap">
        <div className="auth-form">
          <div className="avatar-badge">
            <img src={logo} alt="MenaCare" className="badge-logo" />
          </div>
          <h1>Get Started</h1>
          <p>Create your MenaCare account in seconds</p>

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

          <form onSubmit={handleSignUp}>
            <div className="form-input-wrapper">
              <div className="field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  onBlur={() => handleFieldBlur('fullName')}
                  placeholder="Jane Doe"
                  className={fieldErrors.fullName ? 'input-error' : ''}
                  disabled={loading}
                />
              </div>
              {fieldErrors.fullName && <div className="input-helper error">{fieldErrors.fullName}</div>}
            </div>

            <div className="form-input-wrapper">
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder="you@example.com"
                  className={fieldErrors.email ? 'input-error' : ''}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && <div className="input-helper error">{fieldErrors.email}</div>}
            </div>

            <div className="form-input-wrapper">
              <div className="field">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => {
                    setDateOfBirth(e.target.value);
                    if (fieldErrors.dateOfBirth) setFieldErrors(prev => ({ ...prev, dateOfBirth: '' }));
                  }}
                  onBlur={() => handleFieldBlur('dateOfBirth')}
                  max={new Date().toISOString().split('T')[0]}
                  className={fieldErrors.dateOfBirth ? 'input-error' : ''}
                  disabled={loading}
                />
              </div>
              {fieldErrors.dateOfBirth && <div className="input-helper error">{fieldErrors.dateOfBirth}</div>}
            </div>

            {isMinor && (
              <>
                <p className="section-note">
                  Since you're under 18, we need a guardian's details for consent.
                </p>

                <div className="form-input-wrapper">
                  <div className="field">
                    <label htmlFor="guardianName">Guardian's Full Name</label>
                    <input
                      id="guardianName"
                      type="text"
                      value={guardianName}
                      onChange={(e) => {
                        setGuardianName(e.target.value);
                        if (fieldErrors.guardianName) setFieldErrors(prev => ({ ...prev, guardianName: '' }));
                      }}
                      onBlur={() => handleFieldBlur('guardianName')}
                      placeholder="Guardian's name"
                      className={fieldErrors.guardianName ? 'input-error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {fieldErrors.guardianName && <div className="input-helper error">{fieldErrors.guardianName}</div>}
                </div>

                <div className="form-input-wrapper">
                  <div className="field">
                    <label htmlFor="guardianEmail">Guardian's Email</label>
                    <input
                      id="guardianEmail"
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => {
                        setGuardianEmail(e.target.value);
                        if (fieldErrors.guardianEmail) setFieldErrors(prev => ({ ...prev, guardianEmail: '' }));
                      }}
                      onBlur={() => handleFieldBlur('guardianEmail')}
                      placeholder="guardian@example.com"
                      className={fieldErrors.guardianEmail ? 'input-error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {fieldErrors.guardianEmail && <div className="input-helper error">{fieldErrors.guardianEmail}</div>}
                </div>

                <div className="form-input-wrapper">
                  <div className="field">
                    <label htmlFor="guardianPhone">Guardian's Phone Number</label>
                    <input
                      id="guardianPhone"
                      type="tel"
                      value={guardianPhone}
                      onChange={(e) => {
                        setGuardianPhone(e.target.value);
                        if (fieldErrors.guardianPhone) setFieldErrors(prev => ({ ...prev, guardianPhone: '' }));
                      }}
                      onBlur={() => handleFieldBlur('guardianPhone')}
                      placeholder="+27 12 345 6789"
                      className={fieldErrors.guardianPhone ? 'input-error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {fieldErrors.guardianPhone && <div className="input-helper error">{fieldErrors.guardianPhone}</div>}
                </div>

                <div className="form-input-wrapper">
                  <div className="field">
                    <label htmlFor="guardianRelationship">Relationship to You</label>
                    <input
                      id="guardianRelationship"
                      type="text"
                      value={guardianRelationship}
                      onChange={(e) => {
                        setGuardianRelationship(e.target.value);
                        if (fieldErrors.guardianRelationship) setFieldErrors(prev => ({ ...prev, guardianRelationship: '' }));
                      }}
                      onBlur={() => handleFieldBlur('guardianRelationship')}
                      placeholder="e.g. Mother, Father, Legal guardian"
                      className={fieldErrors.guardianRelationship ? 'input-error' : ''}
                      disabled={loading}
                    />
                  </div>
                  {fieldErrors.guardianRelationship && <div className="input-helper error">{fieldErrors.guardianRelationship}</div>}
                </div>
              </>
            )}

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
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onBlur={() => handleFieldBlur('password')}
                    placeholder="••••••••"
                    className={fieldErrors.password ? 'input-error' : ''}
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
                    style={{ ...toggleBtnStyle, cursor: loading ? 'default' : 'pointer' }}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              {fieldErrors.password && <div className="input-helper error">{fieldErrors.password}</div>}
              {password && (
                <>
                  <div className="password-strength">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`password-strength-bar ${i <= passwordStrength ? getPasswordStrengthClass(passwordStrength) : ''}`}
                      />
                    ))}
                  </div>
                  {passwordStrength > 0 && (
                    <div className={`password-strength-text ${getPasswordStrengthClass(passwordStrength)}`}>
                      Password strength: {getPasswordStrengthLabel(passwordStrength)}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="form-input-wrapper">
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    onBlur={() => handleFieldBlur('confirmPassword')}
                    placeholder="••••••••"
                    className={fieldErrors.confirmPassword ? 'input-error' : password && confirmPassword === password ? 'input-success' : ''}
                    disabled={loading}
                    style={{ paddingRight: '40px', width: '100%', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                    style={{ ...toggleBtnStyle, cursor: loading ? 'default' : 'pointer' }}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              {fieldErrors.confirmPassword && <div className="input-helper error">{fieldErrors.confirmPassword}</div>}
              {password && confirmPassword && confirmPassword === password && !fieldErrors.confirmPassword && (
                <div className="input-helper success">✓ Passwords match</div>
              )}
            </div>

            <div className="checkbox-wrapper">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms">
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={
                loading ||
                !!fieldErrors.fullName || !!fieldErrors.email || !!fieldErrors.dateOfBirth ||
                !!fieldErrors.password || !!fieldErrors.confirmPassword ||
                (isMinor && (!!fieldErrors.guardianName || !!fieldErrors.guardianEmail || !!fieldErrors.guardianPhone || !!fieldErrors.guardianRelationship)) ||
                !agreedToTerms
              }
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="form-separator">
            <span>or sign up with</span>
          </div>

          <div className="social-row">
            <button className="btn-social" type="button" disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.5 9c0-4.14-3.36-7.5-7.5-7.5S1.5 4.86 1.5 9c0 3.73 2.7 6.84 6.23 7.35v-5.2h-1.88V9h1.88V7.12c0-1.86 1.1-2.89 2.78-2.89.81 0 1.66.14 1.66.14v1.82h-.93c-.92 0-1.21.57-1.21 1.16V9h2.06l-.33 2.15h-1.73v5.2C13.8 15.84 16.5 12.73 16.5 9z" fill="#241633" />
              </svg>
            </button>
            <button className="btn-social" type="button" disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.5 9c0-4.14-3.36-7.5-7.5-7.5S1.5 4.86 1.5 9c0-3.56 2.56-6.52 5.9-7.32v4.64h-1.78V9h1.78v1.4c0 1.75 1.04 2.72 2.63 2.72.76 0 1.56-.14 1.56-.14v-1.72h-.88c-.87 0-1.14-.54-1.14-1.1V9h1.95l-.31-2.13h-1.64V1.68c3.34.8 5.9 3.76 5.9 7.32z" fill="#241633" />
              </svg>
            </button>
            <button className="btn-social" type="button" disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16.8 2.1c-.5.2-1 .4-1.6.5.6-.4 1-1 1.2-1.7-.5.3-1.1.5-1.7.7-.5-.5-1.2-.9-2-.9-1.5 0-2.8 1.2-2.8 2.8 0 .2 0 .5.1.7C7.3 3 4.9 1.9 3.3.3c-.2.3-.3.7-.3 1.1 0 .9.5 1.8 1.3 2.3-.4 0-.9-.1-1.3-.3v.1c0 1.4 1 2.5 2.3 2.8-.2.1-.5.1-.8.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3 2.3-1 .8-2.3 1.3-3.7 1.3-.2 0-.5 0-.7-.1 1.3.9 3 1.4 4.8 1.4 5.7 0 8.8-4.7 8.8-8.8v-.4c.6-.4 1.1-.9 1.5-1.5z" fill="#241633" />
              </svg>
            </button>
          </div>

          <div className="switch-line">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}