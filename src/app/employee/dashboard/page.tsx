'use client';

import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users,
  MapPin,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EmployeeDashboard() {
  const { appUser } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    leasedProperties: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        // Fetch real data from API endpoints
        const [propertiesResponse, usersResponse] = await Promise.all([
          fetch('/api/admin/properties', { credentials: 'include' }),
          fetch('/api/admin/users', { credentials: 'include' })
        ]);
        
        let totalProperties = 0;
        let availableProperties = 0;
        let leasedProperties = 0;
        let totalUsers = 0;

        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          const properties = propertiesData.properties || [];
          totalProperties = properties.length;
          // Using new property structure with status field
          availableProperties = properties.filter((p: { status: string }) => p.status === 'Available').length;
          leasedProperties = properties.filter((p: { status: string }) => p.status === 'Leased').length;
        }

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          totalUsers = usersData.users?.length || 0;
        }

        setStats({
          totalProperties,
          availableProperties,
          leasedProperties,
          totalUsers
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Keep stats at 0 if there's an error
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  if (!appUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Properties in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableProperties}</div>
            <p className="text-xs text-muted-foreground">Ready for lease</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leased</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.leasedProperties}</div>
            <p className="text-xs text-muted-foreground">Currently occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>


    </div>
  );
} 