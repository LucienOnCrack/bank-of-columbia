'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  appUser: User | null; // For admin/employee pages
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Checking authentication...');
        
        // Call API endpoint that can read httpOnly cookie
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Include cookies in request
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('AuthProvider: Got user data from API:', data.user);
          console.log('AuthProvider: User role:', data.user.role);
          setUser(data.user);
        } else {
          console.log('AuthProvider: Not authenticated, response status:', response.status);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, appUser: user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 