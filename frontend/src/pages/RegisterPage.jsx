import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ onNavigate, onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', weight: '', height: '', level: 'Beginner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      onNavigate('dashboard');
    } catch {
      setError('Registration failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>
            SPORT<span style={{ color: '#fff' }}>+</span>TOGETHER
          </div>
        </div>

        <h2 style={{ fontSize: 22, marginBottom: 24 }}>Create your account</h2>

        {error && (
          <div style={{ background: 'rgba(255,87,51,0.1)', border: '1px solid rgba(255,87,51,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14, color: '#ff7b72' }}>
            {error}
          </div>
        )}

        <form onSubmit={handle}>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label-custom">Full name</label>
            <input className="form-control-dark" placeholder="Alex Martin" value={form.name}
              onChange={e => set('name', e.target.value)} required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label-custom">Email</label>
            <input className="form-control-dark" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label-custom">Password</label>
            <input className="form-control-dark" type="password" placeholder="••••••••"
              value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label className="form-label-custom">Age</label>
              <input className="form-control-dark" type="number" placeholder="25"
                value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div>
              <label className="form-label-custom">Weight (kg)</label>
              <input className="form-control-dark" type="number" placeholder="70"
                value={form.weight} onChange={e => set('weight', e.target.value)} />
            </div>
            <div>
              <label className="form-label-custom">Height (cm)</label>
              <input className="form-control-dark" type="number" placeholder="175"
                value={form.height} onChange={e => set('height', e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="form-label-custom">Fitness level</label>
            <select className="form-control-dark" value={form.level} onChange={e => set('level', e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Get started'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={onSwitch}>Sign in</span>
        </p>
      </div>
    </div>
  );
}