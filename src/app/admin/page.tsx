'use client';


import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User, Transaction, UserRole } from '@/types/user';
import { useEffect, useState } from 'react';
import { 
  Users, 
  Shield, 
  DollarSign,
  Edit,
  Calendar,
  TrendingUp,
  Settings
} from 'lucide-react';

export default function AdminPage() {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceType, setBalanceType] = useState<'deposit' | 'withdrawal'>('deposit');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Admin: Fetching data...');
        
        // Fetch data from API endpoints
        const [usersResponse, transactionsResponse] = await Promise.all([
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/admin/transactions', { credentials: 'include' })
        ]);
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log('Admin: Got users data:', usersData.users?.length || 0, 'users');
          setUsers(usersData.users || []);
        } else {
          console.error('Admin: Failed to fetch users:', usersResponse.status);
        }

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          console.log('Admin: Got transactions data:', transactionsData.transactions?.length || 0, 'transactions');
          setTransactions(transactionsData.transactions?.slice(0, 20) || []); // Show recent 20 transactions
        } else {
          console.error('Admin: Failed to fetch transactions:', transactionsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser || !appUser) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedUser.id,
          role: newRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }

      const { user } = await response.json();

      // Update local state with the response from the server
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? user : u
      ));

      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(`Failed to update user role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleBalanceChange = async () => {
    if (!selectedUser || !balanceAmount || !appUser) return;

    try {
      const amount = parseFloat(balanceAmount);
      const newBalance = balanceType === 'deposit' 
        ? selectedUser.balance + amount 
        : selectedUser.balance - amount;

      // Prevent negative balances
      if (newBalance < 0) {
        alert('Cannot withdraw more than the current balance');
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: selectedUser.id,
          balance: newBalance,
          transactionType: balanceType,
          transactionAmount: amount.toString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user balance');
      }

      const { user } = await response.json();

      // Update local state with the response from the server
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? user : u
      ));

      setIsBalanceDialogOpen(false);
      setSelectedUser(null);
      setBalanceAmount('');

      // Refresh transactions to show the new transaction
      const transactionsResponse = await fetch('/api/admin/transactions', { credentials: 'include' });
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.transactions?.slice(0, 20) || []);
      }
    } catch (error) {
      console.error('Error updating user balance:', error);
      alert(`Failed to update user balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!appUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'employee':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

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

  const totalSystemBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const adminCount = users.filter(u => u.role === 'admin').length;
  const employeeCount = users.filter(u => u.role === 'employee').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Admin Panel</h1>
        <p className="text-black">System administration and user management</p>
      </div>

      {/* System Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {adminCount} admins, {employeeCount} employees, {userCount} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSystemBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total user balances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">System activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user roles and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.roblox_name}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.roblox_id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {user.balance.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {/* Role Change Dialog */}
                        <Dialog 
                          open={isEditDialogOpen && selectedUser?.id === user.id} 
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (open) {
                              setSelectedUser(user);
                              setNewRole(user.role);
                            } else {
                              setSelectedUser(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User Role</DialogTitle>
                              <DialogDescription>
                                Change role for {user.roblox_name}
                              </DialogDescription>
                            </DialogHeader>
                            <div>
                              <Label htmlFor="role-select">New Role</Label>
                              <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="employee">Employee</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleRoleChange}>
                                Update Role
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Balance Change Dialog */}
                        <Dialog 
                          open={isBalanceDialogOpen && selectedUser?.id === user.id} 
                          onOpenChange={(open) => {
                            setIsBalanceDialogOpen(open);
                            if (open) {
                              setSelectedUser(user);
                              setBalanceAmount('');
                              setBalanceType('deposit');
                            } else {
                              setSelectedUser(null);
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <DollarSign className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Balance</DialogTitle>
                              <DialogDescription>
                                Modify balance for {user.roblox_name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="transaction-type">Transaction Type</Label>
                                <Select value={balanceType} onValueChange={(value: 'deposit' | 'withdrawal') => setBalanceType(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="deposit">Deposit</SelectItem>
                                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  value={balanceAmount}
                                  onChange={(e) => setBalanceAmount(e.target.value)}
                                  placeholder="1000"
                                />
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Current balance: ${user.balance.toLocaleString()}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsBalanceDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleBalanceChange}>
                                {balanceType === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Activity
            </CardTitle>
            <CardDescription>
              Recent system transactions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getTransactionTypeColor(transaction.type)}>
                      {formatTransactionType(transaction.type)}
                    </Badge>
                    <div>
                      <p className="font-medium">
                        {transaction.user?.roblox_name} - {transaction.description || 'Transaction'}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 