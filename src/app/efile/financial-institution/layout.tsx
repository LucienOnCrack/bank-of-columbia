'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function FinancialInstitutionLayout({
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