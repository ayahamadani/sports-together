import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: 'bi-speedometer2', label: 'Dashboard', page: 'dashboard' },
  { icon: 'bi-plus-circle', label: 'Log Activity', page: 'log' },
  { icon: 'bi-people', label: 'Friends', page: 'friends' },
  { icon: 'bi-trophy', label: 'Challenges', page: 'challenges' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">SPORT<span style={{ color: '#fff' }}>+</span></div>
        <div className="logo-sub">Together</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.page}
            className={`nav-item ${activePage === item.page ? 'active' : ''}`}
            onClick={() => onNavigate(item.page)}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => onNavigate('profile')}
        >
          <div className="avatar" style={{ background: 'rgba(0,200,150,0.15)', color: 'var(--primary)', fontSize: 12 }}>
            {user?.avatar || 'U'}
          </div>
          <span style={{ fontSize: 13 }}>{user?.name || 'Profile'}</span>
        </button>
        <button className="nav-item" onClick={logout} style={{ color: '#ff7b72' }}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}