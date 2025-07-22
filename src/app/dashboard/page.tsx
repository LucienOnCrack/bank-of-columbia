'use client';

import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Building, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Property {
  id: string;
  municipality: string;
  type: string;
  holderRobloxName: string;
  neighbourhood: string;
  code: string;
  leasePrice: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
  user_id: string;
}

interface Mortgage {
  id: string;
  propertyId: string;
  userId: string;
  amountTotal: number;
  amountPaid: number;
  nextPaymentDue: string;
  paymentFrequency: 'daily' | 'weekly';
  status: 'active' | 'completed' | 'defaulted';
  property?: {
    id: string;
    code: string;
    municipality: string;
  };
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mortgages, setMortgages] = useState<Mortgage[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch real properties data
      try {
        const propertiesResponse = await fetch('/api/properties');
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setProperties(propertiesData.properties || []);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }

      // Fetch real transactions data  
      try {
        const transactionsResponse = await fetch('/api/admin/transactions');
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          // Filter to only show user's transactions
          const userTransactions = transactionsData.transactions?.filter(
            (t: any) => t.user_id === user?.id
          ) || [];
          setTransactions(userTransactions); // Show all user transactions
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }

      // Fetch real mortgages data
      try {
        const mortgagesResponse = await fetch('/api/mortgages');
        if (mortgagesResponse.ok) {
          const mortgagesData = await mortgagesResponse.json();
          // Filter to only show user's mortgages
          const userMortgages = mortgagesData.mortgages?.filter(
            (m: any) => m.userId === user?.id && m.status === 'active'
          ) || [];
          setMortgages(userMortgages);
        }
      } catch (error) {
        console.error('Error fetching mortgages:', error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  const totalPropertyValue = properties.reduce((sum, property) => sum + (property.leasePrice * 12), 0); // Annual lease value
  
  // Get next payment due
  const activeMortgages = mortgages.filter(m => m.status === 'active');
  const nextPaymentDue = activeMortgages.length > 0 
    ? Math.min(...activeMortgages.map(m => new Date(m.nextPaymentDue).getTime()))
    : null;
  
  const overdueMortgages = activeMortgages.filter(m => 
    new Date(m.nextPaymentDue) < new Date()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.roblox_name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s an overview of your financial portfolio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Property Value</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPropertyValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {properties.length} properties owned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mortgages</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMortgages.length}</div>
            <p className="text-xs text-muted-foreground">
              Loans in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextPaymentDue ? new Date(nextPaymentDue).toLocaleDateString() : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextPaymentDue ? 'Upcoming payment' : 'No payments due'}
            </p>
          </CardContent>
        </Card>


      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Mortgage Payments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Payments</span>
            </CardTitle>
            <CardDescription>
              Your next mortgage payment due dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <p className="text-muted-foreground">Loading payments...</p>
            ) : activeMortgages.length > 0 ? (
              <div className="space-y-4">
                {activeMortgages.slice(0, 5).map((mortgage) => {
                  const dueDate = new Date(mortgage.nextPaymentDue);
                  const isOverdue = dueDate < new Date();
                  const daysUntil = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={mortgage.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{mortgage.property?.code || 'Property'}</p>
                        <p className="text-sm text-muted-foreground">
                          {mortgage.paymentFrequency} payment
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {dueDate.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isOverdue ? `${Math.abs(daysUntil)} days overdue` : 
                           daysUntil === 0 ? 'Due today' : 
                           daysUntil === 1 ? 'Due tomorrow' : 
                           `${daysUntil} days`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No active mortgages</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Properties Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Your Properties</span>
            </CardTitle>
            <CardDescription>
              Real estate assets in your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <p className="text-muted-foreground">Loading properties...</p>
            ) : properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{property.code}</p>
                      <p className="text-sm text-muted-foreground">{property.municipality}, {property.neighbourhood}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${property.leasePrice?.toLocaleString() || '0'}/mo</p>
                      <p className="text-xs text-muted-foreground">{property.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No properties owned yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <p className="text-muted-foreground">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const isIncoming = ['deposit', 'mortgage_payment', 'rent_payment'].includes(transaction.type);
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {isIncoming ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description || 'Transaction'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                          {isIncoming ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 