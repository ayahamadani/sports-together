import { useState } from 'react';
import { useActivities } from '../hooks/useActivities';
import Spinner from '../components/Spinner';
import { sportIcons, sportColors, caloriesPerMinute } from '../services/mockData';
import { estimateCalories, fetchWeather, getUserLocation } from '../services/activityService';

const SPORT_TYPES = ['Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Other'];

const SportBadge = ({ type }) => (
  <span className={`badge-sport badge-${type.toLowerCase()}`}>
    <i className={`bi ${sportIcons[type] || 'bi-activity'}`} style={{ fontSize: 11 }}></i>
    {type}
  </span>
);

const EMPTY_FORM = {
  type: 'Running', duration: '', distance: '',
  date: new Date().toISOString().slice(0, 10), notes: ''
};

export default function LogActivityPage() {
  const { activities, loading, add, remove } = useActivities();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [weatherStatus, setWeatherStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [filterType, setFilterType] = useState('All');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const estimatedCals = form.duration
    ? estimateCalories(form.type, form.duration)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setWeatherStatus('Fetching weather...');

    let weather = 'N/A';
    try {
      const loc = await getUserLocation();
      weather = await fetchWeather(loc.lat, loc.lon, form.date);
      setWeatherStatus('');
    } catch {
      setWeatherStatus('');
      // Location denied or API failed — continue without weather
    }

    const newActivity = {
      id: Date.now(),
      ...form,
      duration: Number(form.duration),
      distance: Number(form.distance) || 0,
      calories: estimatedCals,
      weather,
    };

    // TODO: swap add() for API call when backend ready
    await add(newActivity);

    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const filtered = filterType === 'All'
    ? activities
    : activities.filter(a => a.type === filterType);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Activity Log</h1>
          <p>{activities.length} sessions recorded</p>
        </div>
        <button className="btn-primary-custom" onClick={() => setShowForm(true)}>
          <i className="bi bi-plus-lg"></i> Log activity
        </button>
      </div>

      {success && (
        <div style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: 'var(--primary)', fontSize: 14 }}>
          <i className="bi bi-check-circle"></i> Activity logged successfully!
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', ...SPORT_TYPES].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={filterType === t ? 'btn-primary-custom' : 'btn-ghost'}
            style={{ fontSize: 12, padding: '6px 14px' }}>
            {t !== 'All' && <i className={`bi ${sportIcons[t]}`} style={{ marginRight: 5, fontSize: 12 }}></i>}
            {t}
          </button>
        ))}
      </div>

      <div className="card-dark">
        {loading ? (
          <Spinner text="Loading activities..." />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <i className="bi bi-clipboard-x" style={{ fontSize: 32, display: 'block', marginBottom: 12 }}></i>
            No {filterType !== 'All' ? filterType.toLowerCase() : ''} activities yet.
          </div>
        ) : (
          filtered.map(act => (
            <div key={act.id} className="activity-item" style={{ position: 'relative' }}>
              <div className="activity-icon" style={{ background: `${sportColors[act.type] || '#8b949e'}20` }}>
                <i className={`bi ${sportIcons[act.type] || 'bi-activity'}`} style={{ color: sportColors[act.type] || '#8b949e' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <SportBadge type={act.type} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{act.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, fontSize: 13, flexWrap: 'wrap' }}>
                      {act.distance > 0 && (
                        <span><span style={{ color: 'var(--text-muted)' }}>Distance</span> <strong style={{ marginLeft: 4 }}>{act.distance} km</strong></span>
                      )}
                      <span><span style={{ color: 'var(--text-muted)' }}>Duration</span> <strong style={{ marginLeft: 4 }}>{act.duration} min</strong></span>
                      <span><span style={{ color: 'var(--text-muted)' }}>Calories</span> <strong style={{ marginLeft: 4, color: 'var(--accent)' }}>{act.calories} kcal</strong></span>
                    </div>
                    {act.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{act.notes}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {act.weather && act.weather !== 'N/A' && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--dark-3)', padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        <i className="bi bi-cloud-sun"></i> {act.weather}
                      </span>
                    )}
                    <button onClick={() => remove(act.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, fontSize: 14 }}
                      title="Delete">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Activity Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22 }}>Log activity</h2>
              <button className="btn-ghost" style={{ padding: '6px 10px' }} onClick={() => setShowForm(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Sport type picker */}
              <div style={{ marginBottom: 16 }}>
                <label className="form-label-custom">Sport type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {SPORT_TYPES.map(t => (
                    <button type="button" key={t} onClick={() => set('type', t)}
                      style={{
                        padding: '10px', borderRadius: 8,
                        border: `1px solid ${form.type === t ? sportColors[t] : 'var(--border)'}`,
                        background: form.type === t ? `${sportColors[t]}15` : 'var(--dark-3)',
                        color: form.type === t ? sportColors[t] : 'var(--text-muted)',
                        cursor: 'pointer', fontSize: 13, fontWeight: 500,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                      }}>
                      <i className={`bi ${sportIcons[t]}`}></i> {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="form-label-custom">Duration (min) *</label>
                  <input className="form-control-dark" type="number" placeholder="45" min="1"
                    value={form.duration} onChange={e => set('duration', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label-custom">Distance (km)</label>
                  <input className="form-control-dark" type="number" placeholder="8.5" step="0.1" min="0"
                    value={form.distance} onChange={e => set('distance', e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="form-label-custom">Date</label>
                <input className="form-control-dark" type="date" value={form.date}
                  onChange={e => set('date', e.target.value)} required />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label-custom">Notes</label>
                <textarea className="form-control-dark" placeholder="How did it go?" rows={3}
                  value={form.notes} onChange={e => set('notes', e.target.value)}
                  style={{ resize: 'vertical' }} />
              </div>

              {/* Calorie preview */}
              {estimatedCals > 0 && (
                <div style={{ background: 'rgba(255,87,51,0.08)', border: '1px solid rgba(255,87,51,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className="bi bi-fire" style={{ color: 'var(--accent)', fontSize: 24 }}></i>
                  <div>
                    <div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>~{estimatedCals} kcal</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Estimated calories · weather will be auto-fetched</div>
                  </div>
                </div>
              )}

              {weatherStatus && (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  <i className="bi bi-cloud-sun"></i> {weatherStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary-custom" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
                  {saving ? 'Saving...' : <><i className="bi bi-check-lg"></i> Save activity</>}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}