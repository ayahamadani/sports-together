import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate, onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.email, form.password);
      onNavigate('dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>
            SPORT<span style={{ color: '#fff' }}>+</span>TOGETHER
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>
            Track. Compete. Improve.
          </p>
        </div>

        <h2 style={{ fontSize: 22, marginBottom: 24 }}>Welcome back</h2>

        {error && (
          <div style={{ background: 'rgba(255,87,51,0.1)', border: '1px solid rgba(255,87,51,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: '#ff7b72' }}>
            {error}
          </div>
        )}

        <form onSubmit={handle}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label-custom">Email</label>
            <input className="form-control-dark" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="form-label-custom">Password</label>
            <input className="form-control-dark" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          No account?{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={onSwitch}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}