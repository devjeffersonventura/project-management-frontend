import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

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
}

interface LoginResponse {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Buscar dados do usuário se necessário
    }
  }, []);

  const login = (loginResponse: LoginResponse) => {
    const { user, token } = loginResponse;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
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