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
import { MortgageData, MortgageCalculations, MortgageFormData, PaymentFrequency } from '@/types/mortgage';
import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit,
  Trash2,
  DollarSign,
  Building,
  User,
  Calendar as CalendarIcon,
  AlertTriangle,
  Receipt,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function MortgagesPage() {
  const { appUser } = useAuth();
  const [mortgages, setMortgages] = useState<MortgageData[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedMortgage, setSelectedMortgage] = useState<MortgageData | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data for form dropdowns
  const [properties, setProperties] = useState<Array<{id: string, code: string, municipality: string, neighbourhood: string}>>([]);
  const [users, setUsers] = useState<Array<{id: string, roblox_name: string, roblox_id: string}>>([]);

  // Form data
  const [formData, setFormData] = useState<MortgageFormData>({
    propertyId: '',
    userId: '',
    amountTotal: 0,
    startDate: '',
    paymentFrequency: 'weekly',
    durationDays: 365,
    initialDeposit: 0
  });

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentDate: '',
    paymentMethod: ''
  });

  // Date picker states
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isPaymentDateOpen, setIsPaymentDateOpen] = useState(false);

  // Load mortgages on component mount
  useEffect(() => {
    loadMortgages();
    loadFormData();
  }, []);

  // Load mortgages from API
  const loadMortgages = async () => {
    try {
      const response = await fetch('/api/mortgages');
      if (response.ok) {
        const data = await response.json();
        setMortgages(data.mortgages || []);
      } else {
        console.error('Failed to load mortgages');
        toast.error('Failed to load mortgages');
      }
    } catch (error) {
      console.error('Error loading mortgages:', error);
      toast.error('Error loading mortgages');
    } finally {
      setLoading(false);
    }
  };

  // Load form dropdown data
  const loadFormData = async () => {
    try {
      const [propertiesResponse, usersResponse] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/admin/users')
      ]);

      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData.properties || []);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      userId: '',
      amountTotal: 0,
      startDate: '',
      paymentFrequency: 'weekly',
      durationDays: 365,
      initialDeposit: 0
    });
  };

  const resetPaymentForm = () => {
    setPaymentData({
      amount: 0,
      paymentDate: '',
      paymentMethod: ''
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (mortgage: MortgageData) => {
    setSelectedMortgage(mortgage);
    setFormData({
      propertyId: mortgage.propertyId,
      userId: mortgage.userId,
      amountTotal: mortgage.amountTotal,
      startDate: mortgage.startDate,
      paymentFrequency: mortgage.paymentFrequency,
      durationDays: mortgage.durationDays,
      initialDeposit: mortgage.initialDeposit,

    });
    setIsEditDialogOpen(true);
  };

  const openPaymentDialog = (mortgage: MortgageData) => {
    setSelectedMortgage(mortgage);
    resetPaymentForm();
    // Set default payment amount to the calculated amount per payment
    const calculations = calculateMortgageMetrics(mortgage);
    setPaymentData(prev => ({
      ...prev,
      amount: calculations.nextPaymentAmount,
      paymentDate: new Date().toISOString().split('T')[0]
    }));
    setIsPaymentDialogOpen(true);
  };

  const handleDelete = async (mortgageId: string) => {
    if (!confirm('Are you sure you want to delete this mortgage?')) {
      return;
    }

    try {
      const response = await fetch(`/api/mortgages/${mortgageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Mortgage deleted successfully');
        await loadMortgages();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete mortgage');
      }
    } catch (error) {
      console.error('Error deleting mortgage:', error);
      toast.error('Error deleting mortgage');
    }
  };

  // Calculate mortgage metrics
  const calculateMortgageMetrics = (mortgage: MortgageData): MortgageCalculations => {
    const totalAmount = mortgage.amountTotal;
    const amountPaid = mortgage.amountPaid;
    const remainingBalance = totalAmount - amountPaid;
    
    // Calculate payment amounts
    const amountPerPayment = totalAmount / mortgage.durationDays;
    const totalScheduledPayments = mortgage.durationDays;
    
    // Calculate payments based on frequency
    // For future enhancement: adjust calculations based on payment frequency
    
    const totalPayments = Math.floor(amountPaid / amountPerPayment);
    const remainingPayments = totalScheduledPayments - totalPayments;
    
    // Calculate overdue status
    const today = new Date();
    const nextDue = new Date(mortgage.nextPaymentDue);
    const isOverdue = today > nextDue && mortgage.status === 'active';
    const daysOverdue = isOverdue ? Math.floor((today.getTime() - nextDue.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    const progressPercentage = (amountPaid / totalAmount) * 100;

    return {
      totalScheduledPayments,
      amountPerPayment,
      remainingBalance,
      totalPayments,
      remainingPayments,
      daysOverdue,
      isOverdue,
      nextPaymentAmount: amountPerPayment,
      progressPercentage
    };
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': 
        return 'bg-green-500/20 text-green-700 border-green-200 hover:bg-green-500/30';
      case 'completed': 
        return 'bg-blue-500/20 text-blue-700 border-blue-200 hover:bg-blue-500/30';
      case 'defaulted': 
        return 'bg-red-500/20 text-red-700 border-red-200 hover:bg-red-500/30';
      default: 
        return 'bg-gray-500/20 text-gray-700 border-gray-200 hover:bg-gray-500/30';
    }
  };

  const capitalizeStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle form submission for create/edit
  const handleSubmit = async () => {
    if (!appUser || submitting) return;

    // Validate required fields
    if (!formData.propertyId || !formData.userId || !formData.amountTotal || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const url = isEditDialogOpen && selectedMortgage 
        ? '/api/mortgages' 
        : '/api/mortgages';
      
      const method = isEditDialogOpen && selectedMortgage ? 'PUT' : 'POST';
      
      const body = isEditDialogOpen && selectedMortgage 
        ? { ...formData, id: selectedMortgage.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(isEditDialogOpen ? 'Mortgage updated successfully' : 'Mortgage created successfully');
        
        // Reload mortgages and close dialog
        await loadMortgages();
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedMortgage(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save mortgage');
      }
    } catch (error) {
      console.error('Error saving mortgage:', error);
      toast.error('Error saving mortgage');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle payment recording
  const handlePaymentSubmit = async () => {
    if (!selectedMortgage || !paymentData.amount || !paymentData.paymentDate || submitting) {
      toast.error('Please fill in payment amount and date');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/mortgages/${selectedMortgage.id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        toast.success('Payment recorded successfully');
        
        // Reload mortgages and close dialog
        await loadMortgages();
        setIsPaymentDialogOpen(false);
        resetPaymentForm();
        setSelectedMortgage(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Error recording payment');
    } finally {
      setSubmitting(false);
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
      {/* Header Actions */}
      <div className="flex items-center justify-end">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mortgage
        </Button>
      </div>

      {/* Mortgages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mortgages ({mortgages.length})</CardTitle>
          <CardDescription>
            All mortgages in the system with payment tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mortgages.map((mortgage) => {
                const calculations = calculateMortgageMetrics(mortgage);
                return (
                  <TableRow key={mortgage.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {mortgage.property?.code || 'Unknown Property'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mortgage.property?.municipality} • {mortgage.property?.neighbourhood}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {mortgage.user?.roblox_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {mortgage.user?.roblox_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(mortgage.amountTotal)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Paid: {formatCurrency(mortgage.amountPaid)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Remaining: {formatCurrency(calculations.remainingBalance)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(calculations.progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {calculations.progressPercentage.toFixed(1)}% complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                                                 <div className="font-medium flex items-center gap-1">
                           <CalendarIcon className="h-3 w-3" />
                           {formatDate(mortgage.nextPaymentDue)}
                         </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(calculations.nextPaymentAmount)}
                        </div>
                        {calculations.isOverdue && (
                          <div className="text-sm text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {calculations.daysOverdue} days overdue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusBadgeColor(mortgage.status)}>
                          {capitalizeStatus(mortgage.status)}
                        </Badge>
                        {calculations.isOverdue && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPaymentDialog(mortgage)}
                          disabled={mortgage.status !== 'active'}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Receipt className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(mortgage)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(mortgage.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Mortgage Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[90vh] overflow-y-auto" style={{width: '50vw', maxWidth: '50vw'}}>
          <DialogHeader>
            <DialogTitle>Add New Mortgage</DialogTitle>
            <DialogDescription>
              Create a new mortgage agreement with payment schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property">Property</Label>
                <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.code} - {property.municipality}, {property.neighbourhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user">Borrower</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.roblox_name} (ID: {user.roblox_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountTotal">Total Mortgage Amount</Label>
                <Input
                  id="amountTotal"
                  type="number"
                  className="w-full h-10"
                  value={formData.amountTotal === 0 ? '' : formData.amountTotal}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountTotal: e.target.value === '' ? 0 : Number(e.target.value) }))}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialDeposit">Initial Deposit</Label>
                <Input
                  id="initialDeposit"
                  type="number"
                  className="w-full h-10"
                  value={formData.initialDeposit === 0 ? '' : formData.initialDeposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, initialDeposit: e.target.value === '' ? 0 : Number(e.target.value) }))}
                  placeholder="5000"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                  <PopoverTrigger asChild>
                                         <Button
                       variant="outline"
                       className="w-full justify-start text-left font-normal"
                     >
                       <CalendarIcon className="mr-2 h-4 w-4" />
                       {formData.startDate ? formatDate(formData.startDate) : "Pick a date"}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate ? new Date(formData.startDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setFormData(prev => ({ ...prev, startDate: date.toISOString().split('T')[0] }));
                        }
                        setIsStartDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <Select value={formData.paymentFrequency} onValueChange={(value: PaymentFrequency) => setFormData(prev => ({ ...prev, paymentFrequency: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  className="w-full h-10"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: Number(e.target.value) }))}
                  placeholder="365"
                />
              </div>


            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Mortgage'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mortgage Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[90vh] overflow-y-auto" style={{width: '50vw', maxWidth: '50vw'}}>
          <DialogHeader>
            <DialogTitle>Edit Mortgage</DialogTitle>
            <DialogDescription>
              Update mortgage details and payment schedule.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Same form structure as Add dialog */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-property">Property</Label>
                <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.code} - {property.municipality}, {property.neighbourhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-user">Borrower</Label>
                <Select value={formData.userId} onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.roblox_name} (ID: {user.roblox_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-amountTotal">Total Mortgage Amount</Label>
                <Input
                  id="edit-amountTotal"
                  type="number"
                  className="w-full h-10"
                  value={formData.amountTotal === 0 ? '' : formData.amountTotal}
                  onChange={(e) => setFormData(prev => ({ ...prev, amountTotal: e.target.value === '' ? 0 : Number(e.target.value) }))}
                  placeholder="50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-initialDeposit">Initial Deposit</Label>
                <Input
                  id="edit-initialDeposit"
                  type="number"
                  className="w-full h-10"
                  value={formData.initialDeposit === 0 ? '' : formData.initialDeposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, initialDeposit: e.target.value === '' ? 0 : Number(e.target.value) }))}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-paymentFrequency">Payment Frequency</Label>
                <Select value={formData.paymentFrequency} onValueChange={(value: PaymentFrequency) => setFormData(prev => ({ ...prev, paymentFrequency: value }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (Days)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  className="w-full h-10"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: Number(e.target.value) }))}
                  placeholder="365"
                />
              </div>


            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Mortgage'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedMortgage?.property?.code || 'this mortgage'}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Payment Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                value={paymentData.amount === 0 ? '' : paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value === '' ? 0 : Number(e.target.value) }))}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Date</Label>
              <Popover open={isPaymentDateOpen} onOpenChange={setIsPaymentDateOpen}>
                <PopoverTrigger asChild>
                                     <Button
                     variant="outline"
                     className="w-full justify-start text-left font-normal"
                   >
                     <CalendarIcon className="mr-2 h-4 w-4" />
                     {paymentData.paymentDate ? formatDate(paymentData.paymentDate) : "Pick a date"}
                   </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paymentData.paymentDate ? new Date(paymentData.paymentDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setPaymentData(prev => ({ ...prev, paymentDate: date.toISOString().split('T')[0] }));
                      }
                      setIsPaymentDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method (Optional)</Label>
              <Input
                id="payment-method"
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                placeholder="Cash, Bank Transfer, etc."
              />
            </div>


          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
} 