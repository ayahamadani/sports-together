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
    const res = await api.login(email, password);
    // Backend returns { token, user }
    localStorage.setItem('st_token', res.token);
    const u = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      avatar: res.user.name.slice(0, 2).toUpperCase(),
      level: res.user.fitnessLevel || 'Beginner',
    };
    localStorage.setItem('st_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await api.register(data);
    localStorage.setItem('st_token', res.token);
    const u = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      avatar: res.user.name.slice(0, 2).toUpperCase(),
      level: res.user.fitnessLevel || 'Beginner',
    };
    localStorage.setItem('st_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('st_token');
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
