import React, { createContext, useState } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  password: string;
}

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    username: '',
    password: '',
  });

  const login = (username: string, password: string) => {
    setAuthState({ isLoggedIn: true, username, password });
  };

  const logout = () => {
    setAuthState({ isLoggedIn: false, username: '', password: '' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
