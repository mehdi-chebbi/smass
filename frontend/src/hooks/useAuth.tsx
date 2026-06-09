// src/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Types basés sur votre schéma Prisma
type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  country: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  canDownload: (minRole?: Role) => boolean;
  canView: (minRole?: Role) => boolean;
  token: string | null;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialisation - vérifier le token au chargement
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Vérifier si le token n'est pas expiré
          const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
          if (tokenData.exp * 1000 > Date.now()) {
            setToken(storedToken);
            setUser(parsedUser);
          } else {
            // Token expiré
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Stocker dans localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  // Vérification des rôles
  const hasRole = useCallback((requiredRole: Role | Role[]): boolean => {
    if (!user) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  }, [user]);

  const hasAnyRole = useCallback((roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  // Vérifications spécifiques pour la carte
  const canDownload = useCallback((minRole: Role = 'EDITOR'): boolean => {
    if (!user) return false;
    
    const roleHierarchy: Record<Role, number> = {
      'VIEWER': 1,
      'EDITOR': 2,
      'ADMIN': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[minRole];
  }, [user]);

  const canView = useCallback((minRole: Role = 'VIEWER'): boolean => {
    if (!user) return minRole === 'VIEWER'; // Les viewers non connectés peuvent voir les couches publiques
    
    const roleHierarchy: Record<Role, number> = {
      'VIEWER': 1,
      'EDITOR': 2,
      'ADMIN': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[minRole];
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasAnyRole,
    canDownload,
    canView,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook pour les routes protégées
export function useRequireAuth(allowedRoles?: Role[]) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, allowedRoles, user, router]);

  return { user, isLoading };
}