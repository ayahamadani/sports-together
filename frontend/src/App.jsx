import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LogActivityPage from './pages/LogActivityPage';
import FriendsPage from './pages/FriendsPage';
import ChallengesPage from './pages/ChallengesPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import spinner from './components/Spinner';
import './index.css';

function AppInner() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
      <div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, color: 'var(--primary)' }}>Loading...</div>
    </div>
  );

  if (!user) {
    return authMode === 'login'
      ? <LoginPage onNavigate={setPage} onSwitch={() => setAuthMode('register')} />
      : <RegisterPage onNavigate={setPage} onSwitch={() => setAuthMode('login')} />;
  }

  const pages = {
    dashboard: <DashboardPage onNavigate={setPage} />,
    log: <LogActivityPage />,
    friends: <FriendsPage />,
    challenges: <ChallengesPage />,
    profile: <ProfilePage />,
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="main-content">
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}