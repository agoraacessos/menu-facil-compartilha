import { useState, useEffect } from 'react';

interface User {
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Simple credential check
      if (username === 'indaia' && password === 'thornoia') {
        const user = { username };
        localStorage.setItem('admin_user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciais inválidas' };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated, loading };
}