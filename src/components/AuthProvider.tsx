'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types/user';
import { verifySessionToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get('session-token');
        
        if (token) {
          const sessionData = verifySessionToken(token);
          
          if (sessionData) {
            // Use session data directly instead of fetching from DB
            // since RLS blocks anon access and we have all needed data in JWT
            const user: User = {
              id: sessionData.userId,
              roblox_id: sessionData.robloxId,
              roblox_name: sessionData.username,
              profile_picture: sessionData.profilePicture,
              role: sessionData.role as 'user' | 'employee' | 'admin',
              balance: 0, // Will be fetched when needed in protected routes
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            setUser(user);
          } else {
            // Invalid token, remove it
            Cookies.remove('session-token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        Cookies.remove('session-token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = () => {
    Cookies.remove('session-token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
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