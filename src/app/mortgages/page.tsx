"use client"
import { ChevronLeft, ChevronRight, RefreshCw, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/components/AuthProvider"
import { Transaction } from "@/types/user"
import { MortgageData } from "@/types/mortgage"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function MortgagesPage() {
  const { user, loading: authLoading } = useAuth()
  const [mortgages, setMortgages] = useState<MortgageData[]>([])
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMortgages = async () => {
      if (!user) return
      
      try {
        console.log('User role:', user.role)
        console.log('Fetching mortgages...')
        
        const response = await fetch('/api/mortgages', {
          credentials: 'include',
        })
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('API Error:', errorData)
          throw new Error(errorData.error || `HTTP ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Mortgages data:', data)
        setMortgages(data.mortgages || [])
      } catch (err) {
        console.error('Error fetching mortgages:', err)
        setError(err instanceof Error ? err.message : 'Failed to load mortgages')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchMortgages()
    }
  }, [user, authLoading])

  // Fetch user transactions
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const response = await fetch('/api/transactions', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched transactions (mortgages page):', data.transactions);
        setTransactions(data.transactions || []);
      } else {
        console.error('Failed to fetch transactions, status:', response.status);
        const errorData = await response.text();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Please log in to view mortgages.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
  // Transform transactions to payment display format
  const formatTransactionAsPayment = (transaction: Transaction) => {
    const getTransactionType = (type: string) => {
      switch (type) {
        case 'mortgage_payment': return 'Mortgage';
        case 'deposit': return 'Deposit';
        case 'withdrawal': return 'Withdrawal';
        case 'property_purchase': return 'Purchase';
        case 'property_sale': return 'Sale';
        case 'rent_payment': return 'Rent';
        default: return 'Transfer';
      }
    };

    const getDirection = (type: string) => {
      if (['deposit', 'property_sale'].includes(type)) return 'Incoming';
      return 'Outgoing';
    };

    const getStatus = () => {
      return { text: 'Completed', subtitle: 'Processed' };
    };

    return {
      paymentNo: transaction.id.slice(0, 8),
      creditor: { 
        name: transaction.created_by_user?.roblox_name || 'Bank of Columbia', 
        id: transaction.created_by?.slice(0, 8) || 'BOC'
      },
      debtor: { 
        name: user?.roblox_name || 'User', 
        id: user?.id.slice(0, 8) || 'USER'
      },
      type: getTransactionType(transaction.type),
      direction: getDirection(transaction.type),
      valueDate: new Date(transaction.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      amount: transaction.amount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }),
      status: getStatus(),
    };
  };

  const paymentsData = transactions.map(formatTransactionAsPayment);

  // Use actual transaction data only - no demo data for clean user experience
  const displayData = paymentsData;

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format duration
  const formatDuration = (days: number) => {
    if (days < 30) {
      return `${days} days`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return remainingDays > 0 ? `${months}mo ${remainingDays}d` : `${months} months`;
    } else {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      const months = Math.floor(remainingDays / 30);
      return `${years}y ${months}mo`;
    }
  };

  // Helper function to format payment frequency
  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  // Helper function to format interest rate as percentage
  const formatInterestRate = (rate: number) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  // Helper function to calculate payment amount with interest
  const calculatePaymentAmount = (
    principal: number,
    annualInterestRate: number,
    durationDays: number,
    paymentFrequency: 'daily' | 'bi-daily' | 'weekly'
  ): number => {
    if (annualInterestRate === 0) {
      // Simple case: no interest, just divide evenly
      const paymentsPerYear = paymentFrequency === 'daily' ? 365 : 
                             paymentFrequency === 'bi-daily' ? 182.5 : 52;
      const totalPayments = (durationDays / 365) * paymentsPerYear;
      return principal / totalPayments;
    }

    // Convert annual rate to payment period rate
    const paymentsPerYear = paymentFrequency === 'daily' ? 365 : 
                           paymentFrequency === 'bi-daily' ? 182.5 : 52;
    const periodRate = annualInterestRate / paymentsPerYear;
    const totalPayments = (durationDays / 365) * paymentsPerYear;

    // Calculate payment using loan payment formula: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
    if (periodRate === 0) {
      return principal / totalPayments;
    }
    
    const numerator = principal * periodRate * Math.pow(1 + periodRate, totalPayments);
    const denominator = Math.pow(1 + periodRate, totalPayments) - 1;
    
    return numerator / denominator;
  };

  // Transform mortgage data for display
  const fieldsData = mortgages.map(mortgage => ({
    property: {
      number: mortgage.property?.code || mortgage.propertyId,
      address: `${mortgage.property?.neighbourhood || ''} ${mortgage.property?.municipality || ''}`.trim() || 'Unknown Location'
    },
    amount: formatCurrency(mortgage.amountTotal),
    nextPayment: formatDate(mortgage.nextPaymentDue),
    status: mortgage.status.charAt(0).toUpperCase() + mortgage.status.slice(1),
    paid: formatCurrency(mortgage.amountPaid),
    remaining: formatCurrency(mortgage.amountTotal - mortgage.amountPaid),
    duration: formatDuration(mortgage.durationDays),
    frequency: formatFrequency(mortgage.paymentFrequency),
    interestRate: formatInterestRate(mortgage.interestRate || 0.05),
  }));

  // Calculate real outstanding balance and payment information
  const calculateMortgageStats = () => {
    console.log('Calculating mortgage stats, mortgages:', mortgages);
    
    if (mortgages.length === 0) {
      return {
        totalRemainingBalance: 0,
        overdueBalance: 0,
        hasOutstandingBalance: false,
        nextPaymentProperty: null,
        nextPaymentDate: null,
        nextPaymentAmount: 0,
        overduePayments: 0,
      };
    }

    // Calculate total remaining balance (total - paid across all mortgages) with safe number conversion
    const totalRemaining = mortgages.reduce((sum, mortgage) => {
      const total = Number(mortgage.amountTotal) || 0;
      const paid = Number(mortgage.amountPaid) || 0;
      const remaining = total - paid;
      console.log(`Mortgage calculation: total=${total}, paid=${paid}, remaining=${remaining}`);
      return sum + remaining;
    }, 0);

    // Find the next payment due (earliest due date among active mortgages)
    const activeMortgages = mortgages.filter(m => m.status === 'active' && Number(m.amountTotal) > Number(m.amountPaid));
    let nextPaymentMortgage = null;
    let nextPaymentDate = null;
    let nextPaymentAmount = 0;

    if (activeMortgages.length > 0) {
      // Sort by next payment due date to find the earliest
      nextPaymentMortgage = activeMortgages.sort((a, b) => 
        new Date(a.nextPaymentDue).getTime() - new Date(b.nextPaymentDue).getTime()
      )[0];

      if (nextPaymentMortgage) {
        nextPaymentDate = nextPaymentMortgage.nextPaymentDue;
        // Calculate the actual payment amount for this mortgage
        const remainingPrincipal = Number(nextPaymentMortgage.amountTotal) - Number(nextPaymentMortgage.amountPaid);
        nextPaymentAmount = calculatePaymentAmount(
          remainingPrincipal,
          Number(nextPaymentMortgage.interestRate) || 0.05,
          Number(nextPaymentMortgage.durationDays),
          nextPaymentMortgage.paymentFrequency as 'daily' | 'bi-daily' | 'weekly'
        );
      }
    }

    // Calculate actual overdue amount based on due dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
    
    const overdueAmount = mortgages.reduce((sum, mortgage) => {
      const dueDate = new Date(mortgage.nextPaymentDue);
      dueDate.setHours(0, 0, 0, 0); // Reset time to midnight
      
      // Only count as overdue if the due date has passed AND mortgage is still active
      if (mortgage.status === 'active' && dueDate < today) {
        const total = Number(mortgage.amountTotal) || 0;
        const paid = Number(mortgage.amountPaid) || 0;
        const remaining = total - paid;
        
        console.log(`Overdue mortgage ${mortgage.id}: due=${mortgage.nextPaymentDue}, remaining=${remaining}`);
        
        // Calculate the actual payment amount that's overdue
        const overduePaymentAmount = calculatePaymentAmount(
          remaining,
          Number(mortgage.interestRate) || 0.05,
          Number(mortgage.durationDays),
          mortgage.paymentFrequency as 'daily' | 'bi-daily' | 'weekly'
        );
        return sum + overduePaymentAmount;
      }
      
      console.log(`Mortgage ${mortgage.id}: due=${mortgage.nextPaymentDue}, not overdue (due date in future or not active)`);
      return sum;
    }, 0);

    console.log('Final mortgage calculations:', { totalRemaining, overdueAmount, nextPaymentAmount });

    return {
      totalRemainingBalance: totalRemaining,
      overdueBalance: overdueAmount,
      hasOutstandingBalance: overdueAmount > 0,
      nextPaymentProperty: nextPaymentMortgage?.property?.code || nextPaymentMortgage?.propertyId || null,
      nextPaymentDate: nextPaymentDate,
      nextPaymentAmount: nextPaymentAmount,
      overduePayments: overdueAmount > 0 ? 1 : 0,
    };
  };

  const mortgageStats = calculateMortgageStats();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <ChevronLeft className="w-4 h-4" />
            <span>Payments / Make a Payment</span>
          </div>
          <h1 className="text-2xl font-light text-gray-900">Mortgages</h1>
        </div>

        {/* Fields Table */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="w-full">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Property</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Paid</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Remaining</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Frequency</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Interest Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Next Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/9">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fieldsData.length > 0 ? fieldsData.map((field, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm w-1/9">
                      <Link
                        href={`/property/${field.property.number}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {field.property.number}
                      </Link>
                      <div className="text-gray-900">{field.property.address}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/9">{field.amount}</td>
                    <td className="px-4 py-3 text-sm text-green-600 w-1/9">{field.paid}</td>
                    <td className="px-4 py-3 text-sm text-red-600 w-1/9">{field.remaining}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/9">{field.duration}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/9">{field.frequency}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 w-1/9 font-medium">{field.interestRate}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/9">{field.nextPayment}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/9">{field.status}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No mortgages found. You currently have no active mortgages.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Account Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* From Account Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Account Number</div>
                  <div className="text-gray-900">{user.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Roblox Username</div>
                  <div className="text-gray-900">@{user.roblox_name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Currency</div>
                  <div className="text-gray-900">USD</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Roblox ID</div>
                  <div className="text-gray-900">{user.roblox_id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Outstanding Balance */}
          <div className="space-y-6">
            {/* Outstanding Balance Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Top Section - Currency, Overdue, and Remaining Balance */}
              <div className="p-6 pb-4">
                {mortgageStats.overdueBalance > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Currency</div>
                      <div className="text-2xl font-medium text-slate-700">USD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-red-500 mb-2">Overdue Balance</div>
                      <div className="text-3xl font-light text-red-600">
                        {formatCurrency(mortgageStats.overdueBalance)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">Remaining Balance</div>
                      <div className="text-3xl font-light text-slate-700">
                        {formatCurrency(mortgageStats.totalRemainingBalance)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Currency</div>
                      <div className="text-2xl font-medium text-slate-700">USD</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">Remaining Balance</div>
                      <div className="text-3xl font-light text-slate-700">
                        {formatCurrency(mortgageStats.totalRemainingBalance)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200"></div>

              {/* Middle Section - Payment Details */}
              <div className="p-6 py-4 space-y-6">
                {/* Next Payment Due */}
                {mortgageStats.nextPaymentDate && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Next Payment Due</div>
                      <div className="text-lg font-medium text-slate-700">
                        {new Date(mortgageStats.nextPaymentDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      {mortgageStats.nextPaymentProperty && (
                        <div className="text-xs text-gray-500">Property {mortgageStats.nextPaymentProperty}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Amount</div>
                      <div className="text-lg text-slate-700">{formatCurrency(mortgageStats.nextPaymentAmount)}</div>
                    </div>
                  </div>
                )}

                {/* Overdue Payments (if any) */}
                {mortgageStats.overduePayments > 0 && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-red-500 mb-1">Overdue Payments</div>
                      <div className="text-lg font-medium text-red-600">
                        {mortgageStats.overduePayments} payment{mortgageStats.overduePayments > 1 ? "s" : ""} overdue
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-red-500 mb-1">Total Overdue</div>
                      <div className="text-lg text-red-600">{formatCurrency(mortgageStats.overdueBalance)}</div>
                    </div>
                  </div>
                )}

                {/* No Mortgages State */}
                {mortgages.length === 0 && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Payment Status</div>
                      <div className="text-lg font-medium text-gray-600">No Active Mortgages</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Balance</div>
                      <div className="text-lg text-gray-600">$0.00</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Background - Now at bottom without absolute positioning */}
              <div className="h-16 overflow-hidden rounded-b-lg">
                <img src="/images/card-decoration.png" alt="" className="w-full h-full object-cover opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
          {/* Table Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {displayData.length > 0 ? `1 - ${displayData.length} of ${displayData.length}` : '0'} Transactions
              </span>
              <button 
                onClick={fetchTransactions}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                <span>Refresh</span>
                <RefreshCw className={`w-4 h-4 ${transactionsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

          </div>

          {/* Table - Horizontally Scrollable */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <div className="flex items-center space-x-1">
                      <span>Payment No.</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    <div className="flex items-center space-x-1">
                      <span>Creditor</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    <div className="flex items-center space-x-1">
                      <span>Debtor</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    <div className="flex items-center space-x-1">
                      <span>Type</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    <div className="flex items-center space-x-1">
                      <span>Direction</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{payment.paymentNo}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.creditor.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.debtor.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.type}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.direction}</td>

                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.valueDate}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          payment.status.text.toLowerCase() === 'completed' ? 'bg-green-800' : 'bg-orange-400'
                        }`}></div>
                        <div>
                          <div className="text-sm text-gray-900">{payment.status.text}</div>
                          <div className="text-xs text-gray-500">{payment.status.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loading state for transactions */}
          {transactionsLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-sm text-gray-600">Loading transactions...</div>
              </div>
            </div>
          )}

          {/* No transactions message */}
          {!transactionsLoading && displayData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg text-gray-600 mb-2">No transactions found</div>
                <div className="text-sm text-gray-500">Your payment history will appear here</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
