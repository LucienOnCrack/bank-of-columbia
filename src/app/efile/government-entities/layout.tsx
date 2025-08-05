'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function GovernmentEntitiesLayout({
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