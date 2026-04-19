import { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner, { ErrorMessage } from '../components/Spinner';
import { sportIcons, sportColors } from '../services/mockData';

const levelColor = { Beginner: '#ffc107', Intermediate: '#58a6ff', Advanced: '#00C896' };

const Avatar = ({ initials, color = 'var(--primary)' }) => (
  <div className="avatar" style={{ background: `${color}20`, color, width: 44, height: 44, fontSize: 15 }}>
    {initials}
  </div>
);

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' | 'feed'

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [f, feedData] = await Promise.all([api.getFriends(), api.getFriendFeed()]);
        setFriends(f);
        setFeed(feedData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const results = await api.searchUsers(q);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const sendRequest = async (userId) => {
    await api.sendFriendRequest(userId);
    setSearchResults((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'pending' } : u));
  };

  const acceptRequest = async (userId) => {
    await api.acceptFriendRequest(userId);
    setFriends((prev) => prev.map((f) => f.id === userId ? { ...f, status: 'friend' } : f));
  };


  const declineRequest = async (userId) => {
    await api.declineFriendRequest(userId);
    setFriends((prev) => prev.filter((f) => f.id !== userId));
  };

  const activeFriends = friends.filter((f) => f.status === 'friend');
  const pending = friends.filter((f) => f.status === 'pending');

  if (loading) return <Spinner text="Loading friends..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Friends</h1>
        <p>{activeFriends.length} friends · {pending.length} pending</p>
      </div>

      {/* Search */}
      <div className="card-dark" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Find people</h3>
        <div style={{ position: 'relative' }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
          <input className="form-control-dark" placeholder="Search by name or email..."
            style={{ paddingLeft: 36 }} value={search} onChange={(e) => handleSearch(e.target.value)} />
        </div>
        {searching && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Searching...</p>}
        {searchResults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {searchResults.map((u) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar initials={(u.name || '?').slice(0, 2).toUpperCase()} color="#58a6ff" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: levelColor[u.fitnessLevel] || 'var(--text-muted)' }}>{u.fitnessLevel}</div>
                  </div>
                </div>
                <button
                  className={u.status === 'pending' ? 'btn-ghost' : 'btn-outline-custom'}
                  style={{ fontSize: 13, padding: '6px 14px' }}
                  onClick={() => sendRequest(u.id)}
                  disabled={u.status === 'pending'}
                >
                  {u.status === 'pending' ? 'Request sent' : <><i className="bi bi-person-plus"></i> Add friend</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="card-dark" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Pending requests</h3>
          {pending.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={(f.name || '?').slice(0, 2).toUpperCase()} color="#ffc107" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.fitnessLevel}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary-custom" style={{ fontSize: 13, padding: '6px 14px' }} onClick={() => acceptRequest(f.id)}>Accept</button>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }} onClick={() => declineRequest(f.id)}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['friends', 'feed'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn-primary-custom' : 'btn-ghost'}
            style={{ fontSize: 13, padding: '7px 18px', textTransform: 'capitalize' }}>
            {tab === 'friends' ? `Friends (${activeFriends.length})` : 'Activity Feed'}
          </button>
        ))}
      </div>

      {activeTab === 'friends' && (
        <div className="card-dark">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {activeFriends.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '24px 0' }}>No friends yet — search above to add some!</p>
            ) : activeFriends.map((f) => (
              <div key={f.id} style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar initials={(f.name || '?').slice(0, 2).toUpperCase()} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: levelColor[f.fitnessLevel] || 'var(--text-muted)' }}>{f.fitnessLevel}</div>
                  </div>
                </div>
                {f.lastActivity && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--dark-4)', borderRadius: 6, padding: '8px 12px' }}>
                    <i className="bi bi-activity" style={{ marginRight: 6 }}></i>{f.lastActivity}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="card-dark">
          <h3 style={{ fontSize: 16, marginBottom: 20 }}>Friends' recent activities</h3>
          {feed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <i className="bi bi-rss" style={{ fontSize: 32, display: 'block', marginBottom: 12 }}></i>
              No recent activity from your friends yet.
            </div>
          ) : feed.map((act) => (
            <div key={act.id} className="activity-item">
              <Avatar initials={(act.userName || '?').slice(0, 2).toUpperCase()} color="#58a6ff" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{act.userName}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <span style={{ color: sportColors[act.type] || '#8b949e' }}>
                    <i className={`bi ${sportIcons[act.type] || 'bi-activity'}`}></i> {act.type}
                  </span>
                  {act.distance > 0 && <span>{act.distance} km</span>}
                  <span>{act.duration} min</span>
                  <span style={{ color: 'var(--accent)' }}>{act.calories} kcal</span>
                </div>
                {act.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{act.notes}</p>}
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{act.date}</div>
                {/* Reactions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {['👍', '🔥', '💪'].map((emoji) => (
                    <button key={emoji} onClick={() => api.addReaction(act.id, emoji)}
                      style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 20, padding: '3px 10px', cursor: 'pointer', fontSize: 14 }}>
                      {emoji} {act.reactions?.[emoji] || 0}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
