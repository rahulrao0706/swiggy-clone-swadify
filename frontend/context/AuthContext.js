'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swadify_auth'));
      if (saved?.user) setUser(saved.user);
    } catch {}
    setReady(true);
  }, []);

  const finish = (data) => {
    localStorage.setItem('swadify_auth', JSON.stringify(data));
    setUser(data.user);
  };

  const login = useCallback(async (form) => finish(await api.login(form)), []);
  const signup = useCallback(async (form) => finish(await api.signup(form)), []);
  const logout = useCallback(() => {
    localStorage.removeItem('swadify_auth');
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, ready, login, signup, logout }}>{children}</AuthContext.Provider>;
}
