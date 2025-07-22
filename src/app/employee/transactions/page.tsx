'use client';

import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { 
  Plus,
  DollarSign,
  Building,
  User,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface TransactionData {
  id: string;
  user_id: string;
  property_id?: string;
  mortgage_id?: string;
  type: string;
  amount: number;
  description?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  created_by: string;
  
  // Related data
  user?: {
    id: string;
    roblox_name: string;
    roblox_id: string;
  };
  property?: {
    id: string;
    code: string;
    municipality: string;
    neighbourhood: string;
  };
  mortgage?: {
    id: string;
    user?: {
      id: string;
      roblox_name: string;
      roblox_id: string;
    };
  };
  created_by_user?: {
    id: string;
    roblox_name: string;
  };
}

export default function TransactionsPage() {
  const { appUser } = useAuth();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Transaction creation state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Transaction editing state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
  const [isEditDatePickerOpen, setIsEditDatePickerOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fromUser: '',
    amount: 0,
    description: '',
    date: '',
    type: 'deposit'
  });

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);



  const resetForm = () => {
    setFormData({
      fromUser: '',
      amount: 0,
      description: '',
      date: '',
      type: 'deposit'
    });
  };

  const openCreateDialog = () => {
    resetForm();
    // Set today's date in local timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${year}-${month}-${day}` }));
    setIsCreateDialogOpen(true);
  };

  const handleCreateTransaction = async () => {
    if (!formData.fromUser || !formData.fromUser.trim() || !formData.amount || !formData.description || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Transaction created successfully');
        await loadTransactions();
        setIsCreateDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Error creating transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTransaction = (transaction: TransactionData) => {
    setEditingTransaction(transaction);
    
    // For mortgage payments, we can't edit the "from user" as it comes from the mortgage
    const fromUserValue = transaction.type === 'mortgage_payment' && transaction.mortgage?.user?.roblox_name 
      ? transaction.mortgage.user.roblox_name 
      : extractFromUser(transaction);
    
    setFormData({
      fromUser: fromUserValue,
      amount: transaction.amount,
      description: transaction.description || '',
      date: transaction.payment_date || transaction.created_at.split('T')[0],
      type: transaction.type
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction || !formData.fromUser || !formData.fromUser.trim() || !formData.amount || !formData.description || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Transaction updated successfully');
        await loadTransactions();
        setIsEditDialogOpen(false);
        setEditingTransaction(null);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Error updating transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Transaction deleted successfully');
        await loadTransactions();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error deleting transaction');
    }
  };

  // Load transactions from API
  const loadTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions');
      if (response.ok) {
        const data = await response.json();
        const sortedTransactions = (data.transactions || []).sort((a: TransactionData, b: TransactionData) => {
          // Sort by date descending (newest first, oldest at bottom)
          const dateA = new Date(a.payment_date || a.created_at).getTime();
          const dateB = new Date(b.payment_date || b.created_at).getTime();
          return dateB - dateA;
        });
        setTransactions(sortedTransactions);
      } else {
        console.error('Failed to load transactions');
        toast.error('Failed to load transactions');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Error loading transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    
    // Handle different date formats
    try {
      // If it's already a full ISO string (like created_at), use it directly
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString();
      }
      // If it's a date string like "YYYY-MM-DD", add time to avoid timezone issues
      return new Date(dateString + 'T00:00:00').toLocaleDateString();
    } catch (error) {
      console.error('Date parsing error:', error, 'for date:', dateString);
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
      case 'payment_received':
      case 'mortgage_payment':
        return 'bg-green-500/20 text-green-700 border-green-200 hover:bg-green-500/30';
      case 'withdrawal':
      case 'payment_sent':
      case 'purchase':
        return 'bg-red-500/20 text-red-700 border-red-200 hover:bg-red-500/30';
      case 'property_purchase':
      case 'property_sale':
        return 'bg-blue-500/20 text-blue-700 border-blue-200 hover:bg-blue-500/30';
      case 'property_assignment':
        return 'bg-purple-500/20 text-purple-700 border-purple-200 hover:bg-purple-500/30';
      case 'rent_payment':
        return 'bg-indigo-500/20 text-indigo-700 border-indigo-200 hover:bg-indigo-500/30';
      case 'fee_payment':
        return 'bg-orange-500/20 text-orange-700 border-orange-200 hover:bg-orange-500/30';
      case 'transfer':
        return 'bg-cyan-500/20 text-cyan-700 border-cyan-200 hover:bg-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-200 hover:bg-gray-500/30';
    }
  };

  const formatTransactionType = (type: string) => {
    // Convert snake_case to Title Case
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const extractFromUser = (transaction: TransactionData) => {
    // For mortgage payments, show the borrower from the mortgage
    if (transaction.type === 'mortgage_payment' && transaction.mortgage?.user?.roblox_name) {
      return transaction.mortgage.user.roblox_name;
    }
    
    // For new transactions, check notes field first
    if (transaction.notes && transaction.notes.trim()) {
      return transaction.notes.trim();
    }
    
    // For older transactions, extract "From: [name]" from description
    const fromMatch = transaction.description?.match(/\(From:\s*([^)]+)\)/);
    return fromMatch ? fromMatch[1].trim() : '-';
  };

  const getTransactionIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type.toLowerCase()) {
      case 'deposit':
      case 'payment_received':
      case 'mortgage_payment':
        return <TrendingUp className={`${iconClass} text-green-700`} />;
      case 'withdrawal':
      case 'payment_sent':
      case 'purchase':
        return <TrendingDown className={`${iconClass} text-red-700`} />;
      case 'property_purchase':
      case 'property_sale':
        return <Building className={`${iconClass} text-blue-700`} />;
      case 'property_assignment':
        return <ArrowRight className={`${iconClass} text-purple-700`} />;
      case 'rent_payment':
        return <DollarSign className={`${iconClass} text-indigo-700`} />;
      case 'fee_payment':
        return <TrendingDown className={`${iconClass} text-orange-700`} />;
      case 'transfer':
        return <ArrowRight className={`${iconClass} text-cyan-700`} />;
      default:
        return <DollarSign className={`${iconClass} text-gray-700`} />;
    }
  };

  const getTransactionSign = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
      case 'payment_received':
      case 'mortgage_payment':
        return '+';
      case 'withdrawal':
      case 'payment_sent':
      case 'purchase':
        return '-';
      default:
        return '';
    }
  };

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
      {/* Header */}
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Create Transaction
        </Button>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions ({transactions.length})</CardTitle>
          <CardDescription>
            Complete transaction history with sender and recipient details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="max-w-xs">Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getTransactionTypeColor(transaction.type)}>
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-1">
                          {formatTransactionType(transaction.type)}
                        </span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {extractFromUser(transaction)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${
                      getTransactionSign(transaction.type) === '+' 
                        ? 'text-green-600' 
                        : getTransactionSign(transaction.type) === '-'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {getTransactionSign(transaction.type)}${formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="whitespace-normal break-words leading-relaxed">
                      {transaction.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <div className="font-medium">
                        {transaction.payment_date ? formatDate(transaction.payment_date) : formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {transaction.created_by_user?.roblox_name || 'System'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTransaction(transaction)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Transaction Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Manual Transaction</DialogTitle>
            <DialogDescription>
              Record a financial transaction for the company.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="fee_payment">Fee Payment</SelectItem>
                  <SelectItem value="rent_payment">Rent Payment</SelectItem>
                  <SelectItem value="property_purchase">Property Purchase</SelectItem>
                  <SelectItem value="property_sale">Property Sale</SelectItem>
                  <SelectItem value="property_assignment">Property Assignment</SelectItem>
                  <SelectItem value="mortgage_payment">Mortgage Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>



            <div className="space-y-2">
              <Label htmlFor="from-user">From User *</Label>
              <Input
                id="from-user"
                value={formData.fromUser}
                onChange={(e) => setFormData(prev => ({ ...prev, fromUser: e.target.value }))}
                placeholder="Enter sender name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount === 0 ? '' : formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value === '' ? 0 : Number(e.target.value) }))}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter transaction description"
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? formatDate(formData.date) : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date + 'T00:00:00') : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Format date as YYYY-MM-DD in local timezone
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setFormData(prev => ({ ...prev, date: `${year}-${month}-${day}` }));
                      }
                      setIsDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateTransaction} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Transaction'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-transaction-type">Transaction Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                disabled={editingTransaction?.type === 'mortgage_payment'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="fee_payment">Fee Payment</SelectItem>
                  <SelectItem value="rent_payment">Rent Payment</SelectItem>
                  <SelectItem value="property_purchase">Property Purchase</SelectItem>
                  <SelectItem value="property_sale">Property Sale</SelectItem>
                  <SelectItem value="property_assignment">Property Assignment</SelectItem>
                  <SelectItem value="mortgage_payment">Mortgage Payment</SelectItem>
                </SelectContent>
              </Select>
              {editingTransaction?.type === 'mortgage_payment' && (
                <p className="text-xs text-muted-foreground">
                  Transaction type cannot be changed for mortgage payments
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-from-user">From User *</Label>
              <Input
                id="edit-from-user"
                value={formData.fromUser}
                onChange={(e) => setFormData(prev => ({ ...prev, fromUser: e.target.value }))}
                placeholder="Enter sender name"
                disabled={editingTransaction?.type === 'mortgage_payment'}
              />
              {editingTransaction?.type === 'mortgage_payment' && (
                <p className="text-xs text-muted-foreground">
                  From user cannot be changed for mortgage payments
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount *</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount === 0 ? '' : formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value === '' ? 0 : Number(e.target.value) }))}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter transaction description"
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover open={isEditDatePickerOpen} onOpenChange={setIsEditDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? formatDate(formData.date) : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date + 'T00:00:00') : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Format date as YYYY-MM-DD in local timezone
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setFormData(prev => ({ ...prev, date: `${year}-${month}-${day}` }));
                      }
                      setIsEditDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTransaction} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Transaction'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 