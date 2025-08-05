'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DocumentInformationLayout({
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