import { useState } from 'react';
import { mockFriends } from '../services/mockData';

const Avatar = ({ initials, color = 'var(--primary)' }) => (
  <div className="avatar" style={{ background: `${color}20`, color, width: 44, height: 44, fontSize: 15 }}>
    {initials}
  </div>
);

const levelColor = { Beginner: '#ffc107', Intermediate: '#58a6ff', Advanced: '#00C896' };

export default function FriendsPage() {
  const [friends, setFriends] = useState(mockFriends);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (q) => {
    setSearch(q);
    if (q.length < 2) { setSearchResults([]); return; }
    // TODO: replace with api.get(`/users/search?q=${q}`)
    const mock = [
      { id: 10, name: 'Julie Fontaine', avatar: 'JF', level: 'Intermediate', status: 'none' },
      { id: 11, name: 'Jean-Pierre Moreau', avatar: 'JP', level: 'Beginner', status: 'none' },
    ].filter(u => u.name.toLowerCase().includes(q.toLowerCase()));
    setSearchResults(mock);
  };

  const sendRequest = (id) => {
    setSearchResults(prev => prev.map(u => u.id === id ? { ...u, status: 'pending' } : u));
  };

  const acceptRequest = (id) => {
    setFriends(prev => prev.map(f => f.id === id ? { ...f, status: 'friend' } : f));
  };

  const activeFriends = friends.filter(f => f.status === 'friend');
  const pending = friends.filter(f => f.status === 'pending');

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
            style={{ paddingLeft: 36 }} value={search} onChange={e => handleSearch(e.target.value)} />
        </div>

        {searchResults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {searchResults.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar initials={u.avatar} color="#58a6ff" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: levelColor[u.level] }}>{u.level}</div>
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
          {pending.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={f.avatar} color="#ffc107" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.level}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary-custom" style={{ fontSize: 13, padding: '6px 14px' }} onClick={() => acceptRequest(f.id)}>
                  Accept
                </button>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends list */}
      <div className="card-dark">
        <h3 style={{ fontSize: 16, marginBottom: 20 }}>Your friends</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {activeFriends.map(f => (
            <div key={f.id} style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Avatar initials={f.avatar} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: levelColor[f.level] }}>{f.level}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--dark-4)', borderRadius: 6, padding: '8px 12px' }}>
                <i className="bi bi-activity" style={{ marginRight: 6 }}></i>
                {f.lastActivity}
                <span style={{ float: 'right', color: 'var(--border)' }}>{f.lastDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}