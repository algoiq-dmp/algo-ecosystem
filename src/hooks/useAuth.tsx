'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (user: string, pwd: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  username: null,
  login: () => false,
  logout: () => {},
});

const VALID_USER = 'algoiq';
const VALID_PWD = '301105';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('algoiq_auth');
    if (stored === 'true') {
      const user = localStorage.getItem('algoiq_user');
      setIsAuthenticated(true);
      setUsername(user || 'algoiq');
    }
    setHydrated(true);
  }, []);

  const login = (user: string, pwd: string): boolean => {
    if (user.toLowerCase() === VALID_USER && pwd === VALID_PWD) {
      setIsAuthenticated(true);
      setUsername(user);
      localStorage.setItem('algoiq_auth', 'true');
      localStorage.setItem('algoiq_user', user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('algoiq_auth');
    localStorage.removeItem('algoiq_user');
  };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
