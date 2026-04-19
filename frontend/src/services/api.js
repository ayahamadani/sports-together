// Base Axios instance pointing at the Spring Boot backend
// Install axios: npm install axios

const BASE_URL = 'http://localhost:8080/api';

async function request(method, path, body = null) {
  const token = localStorage.getItem('st_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const api = {
  // Auth
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (data) => request('POST', '/auth/register', data),

  // Activities
  getActivities: () => request('GET', '/activities'),
  createActivity: (data) => request('POST', '/activities', data),
  deleteActivity: (id) => request('DELETE', `/activities/${id}`),

  // Profile
  getProfile: () => request('GET', '/users/me'),
  updateProfile: (data) => request('PUT', '/users/me', data),

  // Friends
  searchUsers: (query) => request('GET', `/users/search?q=${encodeURIComponent(query)}`),
  getFriends: () => request('GET', '/friends'),
  sendFriendRequest: (userId) => request('POST', `/friends/request/${userId}`),
  acceptFriendRequest: (userId) => request('PUT', `/friends/accept/${userId}`),
  declineFriendRequest: (userId) => request('DELETE', `/friends/decline/${userId}`),
  getFriendFeed: () => request('GET', '/friends/feed'),

  // Challenges
  getChallenges: () => request('GET', '/challenges'),
  createChallenge: (data) => request('POST', '/challenges', data),
  joinChallenge: (id) => request('POST', `/challenges/${id}/join`),
  getLeaderboard: (id) => request('GET', `/challenges/${id}/leaderboard`),

  // Comments / reactions
  getComments: (activityId) => request('GET', `/activities/${activityId}/comments`),
  addComment: (activityId, text) => request('POST', `/activities/${activityId}/comments`, { text }),
  addReaction: (activityId, type) => request('POST', `/activities/${activityId}/reactions`, { type }),
};

export default api;
