'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CharityNonProfitLayout({
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