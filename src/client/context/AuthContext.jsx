import { createContext, useContext, useEffect, useState } from 'react';
import { Auth } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    Auth.me()
      .then(d => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  const login = async (payload) => {
    const d = await Auth.login(payload);
    setUser(d.user);
    return d;
  };

  const register = async (payload) => {
    const d = await Auth.register(payload);
    setUser(d.user);
    return d;
  };

  const logout = async () => {
    await Auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
