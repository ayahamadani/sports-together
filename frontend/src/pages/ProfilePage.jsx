import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockActivities, sportColors } from '../services/mockData';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    age: 28, weight: 72, height: 178, level: user?.level || 'Intermediate',
    bio: 'Passionate runner and occasional cyclist. Chasing that runner\'s high every morning.',
    goal: 'Run 500km this year',
  });

  const totalKm = mockActivities.reduce((s, a) => s + a.distance, 0).toFixed(1);
  const totalCal = mockActivities.reduce((s, a) => s + a.calories, 0);
  const sportBreakdown = mockActivities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        {/* Left panel */}
        <div>
          <div className="card-dark" style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,200,150,0.15)', color: 'var(--primary)', fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {user?.avatar}
            </div>
            <h2 style={{ fontSize: 22 }}>{profile.name}</h2>
            <div style={{ display: 'inline-block', background: 'rgba(0,200,150,0.12)', color: 'var(--primary)', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, marginTop: 6 }}>
              {profile.level}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{profile.bio}</p>

            <div style={{ background: 'var(--dark-3)', borderRadius: 8, padding: '12px 16px', marginTop: 16, textAlign: 'left' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Personal goal</div>
              <div style={{ fontSize: 14, color: 'var(--primary)' }}>🎯 {profile.goal}</div>
            </div>

            <button className="btn-outline-custom" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }} onClick={() => setEditing(true)}>
              <i className="bi bi-pencil"></i> Edit profile
            </button>
          </div>

          <div className="card-dark">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { label: 'Age', value: `${profile.age} yrs` },
                { label: 'Weight', value: `${profile.weight} kg` },
                { label: 'Height', value: `${profile.height} cm` },
                { label: 'BMI', value: (profile.weight / ((profile.height/100)**2)).toFixed(1) },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--dark-3)', padding: '12px', borderRadius: 8, margin: 2 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            <div className="stat-card">
              <div className="stat-value">{totalKm}</div>
              <div className="stat-label">Total km</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-value">{totalCal.toLocaleString()}</div>
              <div className="stat-label">Calories</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-value">{mockActivities.length}</div>
              <div className="stat-label">Sessions</div>
            </div>
          </div>

          <div className="card-dark">
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Activity breakdown</h3>
            {Object.entries(sportBreakdown).map(([sport, count]) => {
              const pct = Math.round((count / mockActivities.length) * 100);
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
              <div>
                <label className="form-label-custom">Age</label>
                <input className="form-control-dark" type="number" value={profile.age}
                  onChange={e => setProfile(p => ({...p, age: e.target.value}))} />
              </div>
              <div>
                <label className="form-label-custom">Weight (kg)</label>
                <input className="form-control-dark" type="number" value={profile.weight}
                  onChange={e => setProfile(p => ({...p, weight: e.target.value}))} />
              </div>
              <div>
                <label className="form-label-custom">Height (cm)</label>
                <input className="form-control-dark" type="number" value={profile.height}
                  onChange={e => setProfile(p => ({...p, height: e.target.value}))} />
              </div>
              <div>
                <label className="form-label-custom">Level</label>
                <select className="form-control-dark" value={profile.level}
                  onChange={e => setProfile(p => ({...p, level: e.target.value}))}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="form-label-custom">Bio</label>
              <textarea className="form-control-dark" rows={3} value={profile.bio}
                onChange={e => setProfile(p => ({...p, bio: e.target.value}))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label-custom">Personal goal</label>
              <input className="form-control-dark" value={profile.goal}
                onChange={e => setProfile(p => ({...p, goal: e.target.value}))} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary-custom" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(false)}>
                Save changes
              </button>
              <button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}