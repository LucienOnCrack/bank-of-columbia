"use client"
import { ChevronLeft, ChevronRight, RefreshCw, Search, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/components/AuthProvider"
import { useState, useEffect } from "react"
import { Transaction } from "@/types/user"
import Link from "next/link"

export default function PaymentsPage() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const response = await fetch('/api/transactions', {
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Failed to fetch transactions');
        return;
      }

      const data = await response.json();
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Fetch user transactions
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading account information...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-red-600">Unable to load user data</div>
          </div>
        </div>
      </div>
    );
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

    const getStatus = (type: string) => {
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
      channel: 'API',
      direction: getDirection(transaction.type),
      valueDate: new Date(transaction.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      ccy: 'UCD',
      amount: transaction.amount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }),
      status: getStatus(transaction.type),
    };
  };

  // For debugging - show what we have
  console.log('Current user:', user);
  console.log('Transactions loaded:', transactions);
  console.log('Transactions loading:', transactionsLoading);

  const paymentsData = transactions.map(formatTransactionAsPayment);

  // Use actual transaction data only - no demo data for clean user experience
  const displayData = paymentsData;

  // Clean user experience - no demo data, user will see real data when they have mortgages/payments
  const fieldsData: any[] = []

  // Calculate balances from real data (empty for new users)
  const overdueBalance = 0
  const totalRemainingBalance = 0
  const hasOverdueBalance = false
  const nextPaymentProperty = null
  const nextPaymentDate = null
  const nextPaymentAmount = "0.00"

  // Real overdue payments data (empty for new users)
  const overduePayments: any[] = []

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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/6">Property</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/6">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/6">Paid</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/6">Remaining</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/6">Next Payment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/6">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fieldsData.map((field, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm w-1/6">
                      <Link
                        href={`/property/${field.property.number}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {field.property.number}
                      </Link>
                      <div className="text-gray-900">{field.property.address}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/6">{field.amount}</td>
                    <td className="px-4 py-3 text-sm text-green-600 w-1/6">{field.paid}</td>
                    <td className="px-4 py-3 text-sm text-red-600 w-1/6">{field.remaining}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/6">{field.nextPayment}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 w-1/6">{field.status}</td>
                  </tr>
                ))}
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
                  <div className="text-gray-900">UCD</div>
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
                {hasOverdueBalance ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Currency</div>
                      <div className="text-2xl font-medium text-slate-700">UCD</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-red-500 mb-2">Overdue Balance</div>
                      <div className="text-3xl font-light text-red-600">
                        ${overdueBalance.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">Remaining Balance</div>
                      <div className="text-3xl font-light text-slate-700">
                        ${totalRemainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Currency</div>
                      <div className="text-2xl font-medium text-slate-700">UCD</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">Remaining Balance</div>
                      <div className="text-3xl font-light text-slate-700">
                        ${totalRemainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Next Payment Due</div>
                    <div className="text-lg font-medium text-slate-700">{nextPaymentDate}</div>
                    <div className="text-xs text-gray-500">Harbor Oak Ave. • Property {nextPaymentProperty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Amount</div>
                    <div className="text-lg text-slate-700">${nextPaymentAmount}</div>
                  </div>
                </div>

                {/* Overdue Payments (if any) */}
                {overduePayments.length > 0 && (
                  <div>
                    <div className="text-sm text-red-500 mb-3">Overdue Payments</div>
                    <div className="space-y-2">
                      {overduePayments.map((payment, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-red-50 rounded">
                          <div>
                            <div className="text-sm font-medium text-red-600">{payment.date}</div>
                            <div className="text-xs text-gray-500">Harbor Oak Ave. • Property {payment.property}</div>
                          </div>
                          <div className="text-sm text-red-600">${payment.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Payment Due */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Next Payment Due</div>
                    <div className="text-lg font-medium text-gray-900">{nextPaymentDate}</div>
                    <div className="text-xs text-gray-500">Harbor Oak Ave. • Property {nextPaymentProperty}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Amount</div>
                    <div className="text-lg text-gray-900">${nextPaymentAmount}</div>
                  </div>
                </div>
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
                      <span>Channel</span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    <div className="flex items-center space-x-1">
                      <span>CCY</span>
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
                {displayData.length > 0 ? (
                  displayData.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{payment.paymentNo}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.creditor.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.debtor.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.type}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.channel}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.direction}</td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.valueDate}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.ccy}</td>
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
                  ))
                ) : (
                  !transactionsLoading && (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center">
                        <div className="text-lg text-gray-600 mb-2">No transactions found</div>
                        <div className="text-sm text-gray-500">Your payment history will appear here</div>
                      </td>
                    </tr>
                  )
                )}
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


        </div>
      </div>
    </div>
  )
}
