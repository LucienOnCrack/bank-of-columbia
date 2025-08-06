"use client"

import { ChevronLeft, Check } from "lucide-react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface PropertyData {
  id: string
  code: string
  municipality: string
  neighbourhood: string
  holder_roblox_name: string
  holder_roblox_id: string
  type: string
  status: string
  property_value: number
}

interface MortgageData {
  id: string
  amount_total: number
  amount_paid: number
  start_date: string
  payment_frequency: string
  duration_days: number
  next_payment_due: string
  status: string
  initial_deposit: number
  interest_rate: number
  interest_type: string
  user: {
    roblox_name: string
    roblox_id: string
  }
  created_by_user: {
    roblox_name: string
  }
  totalPayments: number
}

interface ApiResponse {
  property: PropertyData
  mortgage: MortgageData | null
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyCode = params.id as string
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`/api/properties/code/${propertyCode}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch property data')
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPropertyData()
  }, [propertyCode])

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-gray-900 mb-4">
              {error || 'Property Not Found'}
            </h1>
            <Link href="/mortgages" className="text-blue-600 hover:text-blue-800">
              ← Back to Mortgages
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { property, mortgage } = data

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/mortgages" className="flex items-center space-x-2 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" />
              <span>Mortgages / Property (No. {property.code})</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-2xl font-light text-gray-900">Property (No. {property.code})</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                mortgage?.status === 'active' ? 'bg-green-800' : 
                mortgage?.status === 'completed' ? 'bg-blue-600' :
                mortgage?.status === 'defaulted' ? 'bg-red-600' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm text-gray-600">
                {mortgage ? `Mortgage ${mortgage.status}` : 'No Mortgage'}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Summary */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Summary</h2>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">Mortgage Amount</div>
              <div className="text-4xl font-light mb-2 text-slate-900">
                {mortgage ? 
                  new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(mortgage.amount_total) : 
                  'No Mortgage'
                }
              </div>
              <div className="text-sm text-blue-600">UCD</div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="space-y-0">
              <div className="flex justify-between py-4">
                <span className="text-sm font-medium text-slate-800">Address</span>
                <span className="text-sm text-gray-600">{property.municipality}, {property.neighbourhood}</span>
              </div>
              <div className="border-t border-gray-300"></div>

              {mortgage ? (
                <>
                  <div className="flex justify-between py-4">
                    <span className="text-sm font-medium text-slate-800">Mortgage Date</span>
                    <span className="text-sm text-gray-600">{new Date(mortgage.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="border-t border-gray-300"></div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm font-medium text-slate-800">Deposit</span>
                    <span className="text-sm text-gray-600">
                      ${new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(mortgage.initial_deposit)}
                    </span>
                  </div>
                  <div className="border-t border-gray-300"></div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm font-medium text-slate-800">Interest Rate</span>
                    <span className="text-sm text-gray-600">
                      {(mortgage.interest_rate * 100).toFixed(2)}% {mortgage.interest_type.charAt(0).toUpperCase() + mortgage.interest_type.slice(1)}
                    </span>
                  </div>
                  <div className="border-t border-gray-300"></div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm font-medium text-slate-800">Term</span>
                    <span className="text-sm text-gray-600">{mortgage.duration_days} days</span>
                  </div>
                  <div className="border-t border-gray-300"></div>

                  <div className="flex justify-between py-4">
                    <span className="text-sm font-medium text-slate-800">Payment Frequency</span>
                    <span className="text-sm text-gray-600">{mortgage.payment_frequency.charAt(0).toUpperCase() + mortgage.payment_frequency.slice(1)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No mortgage data available for this property</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Status Section */}
        {mortgage && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Status</h2>
              <span className="text-sm text-gray-500">Updated {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
            </div>

            {/* Progress Timeline */}
            <div className="bg-gray-100 rounded-lg p-8 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Mortgage Initiated */}
                <div className="text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-800">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 h-0.5 ml-4 bg-green-800"></div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Mortgage Initiated</h3>
                  <div className="text-xs text-gray-500 mb-2">Initiated by {mortgage.created_by_user.roblox_name}</div>
                  <div className="text-xs text-gray-500">{new Date(mortgage.start_date).toLocaleDateString()}</div>
                </div>

                {/* Mortgage Approved */}
                <div className="text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-800">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 h-0.5 bg-green-800 ml-4"></div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Mortgage Approved</h3>
                  <div className="text-xs text-gray-500 mb-2">Approved by Bank of Columbia</div>
                  <div className="text-xs text-gray-500">{new Date(mortgage.start_date).toLocaleDateString()}</div>
                </div>

                {/* Funds Disbursed */}
                <div className="text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-800">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 h-0.5 bg-green-800 ml-4"></div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Funds Disbursed</h3>
                  <div className="text-xs text-gray-500 mb-2">Funds Released</div>
                  <div className="text-xs text-gray-500">{new Date(mortgage.start_date).toLocaleDateString()}</div>
                </div>

                {/* Mortgage Active */}
                <div className="text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-800">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Mortgage Active</h3>
                  <div className="text-xs text-gray-500 mb-2">Mortgage is now active and payments have begun</div>
                  <div className="text-xs text-gray-500">{new Date(mortgage.start_date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className={`p-4 rounded-lg mb-6 ${
              mortgage.status === 'active' ? 'bg-green-50' :
              mortgage.status === 'completed' ? 'bg-blue-50' :
              mortgage.status === 'defaulted' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${
                mortgage.status === 'active' ? 'text-green-800' :
                mortgage.status === 'completed' ? 'text-blue-800' :
                mortgage.status === 'defaulted' ? 'text-red-800' : 'text-gray-800'
              }`}>
                <strong>{mortgage.status.charAt(0).toUpperCase() + mortgage.status.slice(1)}:</strong> 
                {mortgage.status === 'active' && ' Your mortgage is active. Regular payments are being processed.'}
                {mortgage.status === 'completed' && ' Your mortgage has been fully paid off.'}
                {mortgage.status === 'defaulted' && ' This mortgage is in default. Please contact support.'}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-sm text-gray-500 mb-2">Total Paid</div>
                <div className="text-2xl font-light text-green-800">
                  ${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(mortgage.totalPayments)}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-sm text-gray-500 mb-2">Remaining Balance</div>
                <div className="text-2xl font-light text-orange-600">
                  ${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(mortgage.amount_total - mortgage.totalPayments)}
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-sm text-gray-500 mb-2">Next Payment Due</div>
                <div className="text-2xl font-light text-blue-600">
                  {new Date(mortgage.next_payment_due).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
