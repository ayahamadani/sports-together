import { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner, { ErrorMessage } from '../components/Spinner';
import { sportColors } from '../services/mockData';

const rankColors = ['#ffc107', '#8b949e', '#FF5733'];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'Running', metric: 'distance', goal: '', unit: 'km', endDate: ''
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectChallenge = async (c) => {
    setSelected(c);
    setLbLoading(true);
    try {
      const lb = await api.getLeaderboard(c.id);
      setLeaderboard(lb);
    } catch {
      setLeaderboard([]);
    } finally {
      setLbLoading(false);
    }
  };

  const join = async (id) => {
    try {
      await api.joinChallenge(id);
      setChallenges(prev =>
        prev.map(c => c.id === id ? { ...c, joined: true, participants: c.participants + 1 } : c)
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const createChallenge = async (e) => {
    e.preventDefault();
    try {
      const newC = await api.createChallenge({ ...form, goal: Number(form.goal) });
      setChallenges(prev => [...prev, newC]);
      setShowCreate(false);
      setForm({ title: '', type: 'Running', metric: 'distance', goal: '', unit: 'km', endDate: '' });
    } catch (e) {
      alert(e.message);
    }
  };

  const daysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) return <Spinner text="Loading challenges..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Challenges</h1>
          <p>Compete with friends, push your limits</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setShowCreate(true)}>
          <i className="bi bi-plus-lg"></i> Create challenge
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Challenge list */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, alignContent: 'start' }}>
          {challenges.map(c => {
            const pct = c.goal > 0 ? Math.min(100, Math.round((c.current / c.goal) * 100)) : 0;
            const color = sportColors[c.type] || 'var(--primary)';
            return (
              <div key={c.id} className="challenge-card" onClick={() => selectChallenge(c)}
                style={{ borderColor: selected?.id === c.id ? 'var(--primary)' : 'var(--border)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>
                      {c.type}
                    </div>
                    <h3 style={{ fontSize: 16, lineHeight: 1.3 }}>{c.title}</h3>
                  </div>
                  {c.joined ? (
                    <span style={{ background: 'rgba(0,200,150,0.12)', color: 'var(--primary)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>JOINED</span>
                  ) : (
                    <button className="btn-outline-custom" style={{ fontSize: 12, padding: '5px 12px' }}
                      onClick={e => { e.stopPropagation(); join(c.id); }}>
                      Join
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <span><i className="bi bi-people"></i> {c.participants} participants</span>
                  <span><i className="bi bi-clock"></i> {daysLeft(c.endDate)}d left</span>
                  <span><i className="bi bi-bullseye"></i> {c.goal} {c.unit}</span>
                </div>

                {c.joined && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Your progress</span>
                      <span style={{ color, fontWeight: 700 }}>{c.current} / {c.goal} {c.unit}</span>
                    </div>
                    <div className="progress-bar-custom">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }}></div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{pct}% complete</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leaderboard panel */}
        {selected && (
          <div className="card-dark fade-in" style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18 }}>Leaderboard</h3>
              <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => setSelected(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>{selected.title}</p>

            {lbLoading ? (
              <Spinner text="Loading..." />
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <i className="bi bi-trophy" style={{ fontSize: 32, display: 'block', marginBottom: 12 }}></i>
                No participants yet — be the first!
              </div>
            ) : (
              leaderboard.map((entry, i) => (
                <div key={entry.rank} className={`leaderboard-row top-${entry.rank}`}>
                  <div className="avatar" style={{ background: 'rgba(0,200,150,0.15)', color: 'var(--primary)', fontSize: 12 }}>
                    {entry.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{entry.name}</div>
                  </div>
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 800, color: i === 0 ? '#ffc107' : 'var(--text-main)' }}>
                    {entry.value} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.unit}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create challenge modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal-box fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22 }}>Create a challenge</h2>
              <button className="btn-ghost" style={{ padding: '6px 10px' }} onClick={() => setShowCreate(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={createChallenge}>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label-custom">Challenge title</label>
                <input className="form-control-dark" placeholder="Run 100km in April"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="form-label-custom">Sport type</label>
                  <select className="form-control-dark" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {['Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label-custom">Metric</label>
                  <select className="form-control-dark" value={form.metric} onChange={e => setForm(f => ({ ...f, metric: e.target.value }))}>
                    <option value="distance">Distance (km)</option>
                    <option value="duration">Duration (min)</option>
                    <option value="calories">Calories (kcal)</option>
                    <option value="reps">Reps</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="form-label-custom">Goal</label>
                  <input className="form-control-dark" type="number" placeholder="100"
                    value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label-custom">End date</label>
                  <input className="form-control-dark" type="date"
                    value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary-custom" style={{ flex: 1, justifyContent: 'center' }}>
                  <i className="bi bi-trophy"></i> Create challenge
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
