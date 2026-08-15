import AppHeader from './AppHeader';
import '../pages/style.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <AppHeader />
      <main className="app-layout-content">{children}</main>
    </div>
  );
}
