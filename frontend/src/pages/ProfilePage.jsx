import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../hooks/useActivities';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { sportColors } from '../services/mockData';

export default function ProfilePage() {
  const { user } = useAuth();
  const { activities, stats } = useActivities();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.getProfile().then(p => setProfile(p)).catch(() => {
      // Fallback to auth user data
      setProfile({
        name: user?.name || '',
        age: 0, weight: 0, height: 0,
        fitnessLevel: user?.level || 'Beginner',
        bio: '', personalGoal: '',
      });
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setEditing(false);
    } catch (e) {
      alert('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <Spinner text="Loading profile..." />;

  const hours = Math.floor(stats.totalMinutes / 60);
  const mins = stats.totalMinutes % 60;
  const bmi = profile.weight && profile.height
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
    : '–';

  const sportBreakdown = activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Profile</h1></div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Left panel */}
        <div>
          <div className="card-dark" style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(0,200,150,0.15)', color: 'var(--primary)',
              fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              {user?.avatar}
            </div>
            <h2 style={{ fontSize: 22 }}>{profile.name}</h2>
            <div style={{ display: 'inline-block', background: 'rgba(0,200,150,0.12)', color: 'var(--primary)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, marginTop: 6 }}>
              {profile.fitnessLevel}
            </div>
            {profile.bio && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{profile.bio}</p>
            )}
            {profile.personalGoal && (
              <div style={{ background: 'var(--dark-3)', borderRadius: 8, padding: '12px 16px', marginTop: 16, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Personal goal</div>
                <div style={{ fontSize: 14, color: 'var(--primary)' }}>🎯 {profile.personalGoal}</div>
              </div>
            )}
            <button className="btn-outline-custom" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }} onClick={() => setEditing(true)}>
              <i className="bi bi-pencil"></i> Edit profile
            </button>
          </div>

          <div className="card-dark">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Body stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { label: 'Age', value: profile.age ? `${profile.age} yrs` : '–' },
                { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '–' },
                { label: 'Height', value: profile.height ? `${profile.height} cm` : '–' },
                { label: 'BMI', value: bmi },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--dark-3)', padding: 12, borderRadius: 8, margin: 2 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <div className="stat-card">
              <div className="stat-value">{stats.totalKm.toFixed(1)}</div>
              <div className="stat-label">Total km</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-value">{stats.totalCalories.toLocaleString()}</div>
              <div className="stat-label">Calories</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-value">{hours}h {mins}m</div>
              <div className="stat-label">Total time</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-value">{stats.count}</div>
              <div className="stat-label">Sessions</div>
            </div>
          </div>

          <div className="card-dark">
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Activity breakdown</h3>
            {Object.keys(sportBreakdown).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No activities logged yet.</p>
            ) : Object.entries(sportBreakdown).map(([sport, count]) => {
              const pct = Math.round((count / stats.count) * 100);
              const color = sportColors[sport] || '#8b949e';
              return (
                <div key={sport} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color, fontWeight: 600 }}>{sport}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} sessions · {pct}%</span>
                  </div>
                  <div className="progress-bar-custom">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditing(false)}>
          <div className="modal-box fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22 }}>Edit profile</h2>
              <button className="btn-ghost" style={{ padding: '6px 10px' }} onClick={() => setEditing(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label-custom">Name</label>
                <input className="form-control-dark" value={profile.name || ''}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="form-label-custom">Age</label>
                <input className="form-control-dark" type="number" value={profile.age || ''}
                  onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} />
              </div>
              <div>
                <label className="form-label-custom">Weight (kg)</label>
                <input className="form-control-dark" type="number" value={profile.weight || ''}
                  onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} />
              </div>
              <div>
                <label className="form-label-custom">Height (cm)</label>
                <input className="form-control-dark" type="number" value={profile.height || ''}
                  onChange={e => setProfile(p => ({ ...p, height: e.target.value }))} />
              </div>
              <div>
                <label className="form-label-custom">Fitness level</label>
                <select className="form-control-dark" value={profile.fitnessLevel || 'Beginner'}
                  onChange={e => setProfile(p => ({ ...p, fitnessLevel: e.target.value }))}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="form-label-custom">Bio</label>
              <textarea className="form-control-dark" rows={3} value={profile.bio || ''}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label-custom">Personal goal</label>
              <input className="form-control-dark" value={profile.personalGoal || ''}
                onChange={e => setProfile(p => ({ ...p, personalGoal: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary-custom" style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
