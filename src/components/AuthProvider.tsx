'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
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
            // Fetch full user data from database
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', sessionData.userId)
              .single();
            
            if (userData && !error) {
              setUser(userData);
            } else {
              // Invalid session, remove token
              Cookies.remove('session-token');
            }
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