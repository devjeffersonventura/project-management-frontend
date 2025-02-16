import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  token: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  email_verified_at: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (loginResponse: LoginResponse) => {
    const { user, token } = loginResponse;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!token, 
        user, 
        login, 
        logout,
        token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);