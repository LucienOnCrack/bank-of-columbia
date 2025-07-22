'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Table components removed as they're not used in this component
import { propertyOperations, transactionOperations } from '@/lib/supabase';
import { Property, Transaction } from '@/types/user';
import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Building, 
  TrendingUp, 
  Clock,
  Home,
  MapPin,
  Calendar
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { appUser } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!appUser) return;
      
      try {
        const [userProperties, userTransactions] = await Promise.all([
          propertyOperations.getUserProperties(appUser.id),
          transactionOperations.getUserTransactions(appUser.id)
        ]);
        
        setProperties(userProperties || []);
        setTransactions(userTransactions?.slice(0, 10) || []); // Show only recent 10 transactions
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appUser]);

  if (!appUser) {
    return null;
  }

  const totalPropertyValue = properties.reduce((sum, property) => sum + property.value, 0);
  const netWorth = appUser.balance + totalPropertyValue;

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-500';
      case 'withdrawal':
        return 'bg-red-500';
      case 'property_purchase':
        return 'bg-blue-500';
      case 'property_sale':
        return 'bg-purple-500';
      case 'property_assignment':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTransactionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {appUser.roblox_name}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your Bank of Columbia account
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${appUser.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Value</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPropertyValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{properties.length} properties owned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">Transactions this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Properties Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              My Properties
            </CardTitle>
            <CardDescription>
              Properties you currently own
            </CardDescription>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No properties owned yet</p>
                <p className="text-sm text-muted-foreground">
                  Contact an employee to get your first property assigned
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{property.address}</p>
                        {property.description && (
                          <p className="text-sm text-muted-foreground">{property.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${property.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned by {property.assigned_by_user?.roblox_name}
                      </p>
                    </div>
                  </div>
                ))}
                {properties.length > 5 && (
                  <Button variant="outline" className="w-full">
                    View All Properties ({properties.length})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Your latest account activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">
                  Your transaction history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getTransactionTypeColor(transaction.type)}>
                        {formatTransactionType(transaction.type)}
                      </Badge>
                      <div>
                        <p className="font-medium">
                          {transaction.property?.address || transaction.description || 'Account Transaction'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'property_sale' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'property_sale' ? '+' : '-'}
                        ${Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {transaction.created_by_user?.roblox_name}
                      </p>
                    </div>
                  </div>
                ))}
                {transactions.length >= 10 && (
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 