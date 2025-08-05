'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function EFilingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}