'use client';

import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { canAccess } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'employee' | 'admin';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not logged in, redirect to home
        router.push(fallbackPath);
        return;
      }

      if (!canAccess(user.role, requiredRole)) {
        // User doesn't have required role, redirect to dashboard
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, requiredRole, fallbackPath, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (!canAccess(user.role, requiredRole)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'user' | 'employee' | 'admin'
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
} 