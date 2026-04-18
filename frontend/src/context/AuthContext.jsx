import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('st_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Replace with real API call: const res = await api.post('/auth/login', { email, password });
    const mockUser = { id: 1, name: 'Alex Martin', email, avatar: 'AM', level: 'Intermediate' };
    localStorage.setItem('st_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const register = async (data) => {
    // Replace with: const res = await api.post('/auth/register', data);
    const mockUser = { id: 1, name: data.name, email: data.email, avatar: data.name.slice(0,2).toUpperCase(), level: 'Beginner' };
    localStorage.setItem('st_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('st_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);