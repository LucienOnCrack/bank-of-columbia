'use client';

import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRobloxAuthUrl } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DollarSign, Shield, Users, Building } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleRobloxLogin = () => {
    const oauthUrl = getRobloxAuthUrl();
    window.location.href = oauthUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <DollarSign className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Bank of Columbia
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The most secure and trusted banking platform for Roblox users. 
          Manage your finances, track your properties, and build your wealth.
        </p>
        
        {!user && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in with your Roblox account to access your banking dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleRobloxLogin}
                className="w-full"
                size="lg"
              >
                Login with Roblox
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Secure Banking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your funds are protected with bank-level security and encryption. 
              All transactions are logged and monitored.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Building className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Property Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track and manage your real estate portfolio. View property values, 
              ownership history, and assignments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Role-Based Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Different access levels for users, employees, and administrators. 
              Secure and organized banking experience.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-secondary/10 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Trusted by Roblox Community</h2>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-primary">$2.5M+</div>
            <div className="text-muted-foreground">Total Assets Managed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">1,200+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">850+</div>
            <div className="text-muted-foreground">Properties Managed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
