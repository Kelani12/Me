import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import logo from '../assets/logo.jpeg';
import '../pages/style.css';

export default function AppHeader() {
  const displayName = auth.currentUser?.displayName || '';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

  return (
    <header className="app-header">
      <Link to="/dashboard" className="app-header-brand">
        <img src={logo} alt="MenaCare" className="app-header-logo" />
        <span>MenaCare</span>
      </Link>

      <Link to="/profile" className="app-header-avatar" aria-label="Go to your profile">
        {initials}
      </Link>
    </header>
  );
}
