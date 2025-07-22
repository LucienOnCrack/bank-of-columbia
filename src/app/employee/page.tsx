'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page automatically
    router.replace('/employee/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
} 