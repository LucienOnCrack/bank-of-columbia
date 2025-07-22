'use client';

import { useAuth } from '@/components/AuthProvider';
import { canAccess } from '@/lib/auth';
import { UserRole } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user || !appUser) {
        router.push(redirectTo);
        return;
      }

      // If authenticated but doesn't have required role, redirect to dashboard
      if (!canAccess(appUser.role, requiredRole)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, appUser, loading, requiredRole, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated or insufficient permissions, don't render children
  if (!user || !appUser || !canAccess(appUser.role, requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
} 