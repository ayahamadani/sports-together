import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../hooks/useActivities';
import Spinner, { ErrorMessage } from '../components/Spinner';
import { mockWeeklyData, mockMonthlyData, sportIcons, sportColors } from '../services/mockData';

const SportBadge = ({ type }) => (
  <span className={`badge-sport badge-${type.toLowerCase()}`}>
    <i className={`bi ${sportIcons[type] || 'bi-activity'}`} style={{ fontSize: 11 }}></i>
    {type}
  </span>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const { activities, loading, error, stats, refresh } = useActivities();

  const hours = Math.floor(stats.totalMinutes / 60);
  const mins = stats.totalMinutes % 60;

  if (loading) return <Spinner text="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={refresh} />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's your activity overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <div className="stat-card">
          <div style={{ color: 'var(--primary)', fontSize: 22, marginBottom: 8 }}><i className="bi bi-geo-alt"></i></div>
          <div className="stat-value">{stats.totalKm.toFixed(1)}</div>
          <div className="stat-label">Total km</div>
        </div>
        <div className="stat-card accent">
          <div style={{ color: 'var(--accent)', fontSize: 22, marginBottom: 8 }}><i className="bi bi-fire"></i></div>
          <div className="stat-value">{stats.totalCalories.toLocaleString()}</div>
          <div className="stat-label">Calories burned</div>
        </div>
        <div className="stat-card blue">
          <div style={{ color: '#58a6ff', fontSize: 22, marginBottom: 8 }}><i className="bi bi-clock"></i></div>
          <div className="stat-value">{hours}h {mins}m</div>
          <div className="stat-label">Total time</div>
        </div>
        <div className="stat-card purple">
          <div style={{ color: '#a371f7', fontSize: 22, marginBottom: 8 }}><i className="bi bi-activity"></i></div>
          <div className="stat-value">{stats.count}</div>
          <div className="stat-label">Sessions</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card-dark">
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>This week</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20 }}>Calories per day</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockWeeklyData} barSize={20}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calories" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-dark">
          <h3 style={{ fontSize: 16, marginBottom: 4 }}>Distance trend</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20 }}>Km per month</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="km" stroke="#58a6ff" strokeWidth={2} dot={{ fill: '#58a6ff', r: 4 }} name="Km" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-dark">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18 }}>Recent activities</h3>
          <button className="btn-outline-custom" onClick={() => onNavigate('log')} style={{ fontSize: 13, padding: '7px 14px' }}>
            <i className="bi bi-plus"></i> Log activity
          </button>
        </div>

        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <i className="bi bi-activity" style={{ fontSize: 32, display: 'block', marginBottom: 12 }}></i>
            No activities yet.{' '}
            <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => onNavigate('log')}>
              Log your first one!
            </span>
          </div>
        ) : (
          activities.slice(0, 5).map(act => (
            <div key={act.id} className="activity-item">
              <div className="activity-icon" style={{ background: `${sportColors[act.type] || '#8b949e'}20` }}>
                <i className={`bi ${sportIcons[act.type] || 'bi-activity'}`} style={{ color: sportColors[act.type] || '#8b949e' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <SportBadge type={act.type} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{act.date}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  {act.distance > 0 && <span><i className="bi bi-geo-alt" style={{ color: 'var(--text-muted)' }}></i> {act.distance} km</span>}
                  <span><i className="bi bi-clock" style={{ color: 'var(--text-muted)' }}></i> {act.duration} min</span>
                  <span><i className="bi bi-fire" style={{ color: 'var(--accent)' }}></i> {act.calories} kcal</span>
                  {act.weather && act.weather !== 'N/A' && (
                    <span style={{ color: 'var(--text-muted)' }}><i className="bi bi-cloud-sun"></i> {act.weather}</span>
                  )}
                </div>
                {act.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{act.notes}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}