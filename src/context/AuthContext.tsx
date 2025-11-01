import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'admin' | 'professor' | 'aluno' | null;

interface AuthContextType {
  role: Role;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  const login = (userRole: Role) => {
    setRole(userRole);
    localStorage.setItem('userRole', userRole || '');
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('userRole');
  };

  const isAuthenticated = !!role;

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};