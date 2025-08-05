"use client"

import { ChevronLeft, ChevronRight, RefreshCw, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/components/AuthProvider"

export default function Documents() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your documents.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <ChevronLeft className="w-4 h-4" />
            <span>Documents / Document Management</span>
          </div>
          <h1 className="text-2xl font-light text-gray-900">Documents</h1>
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
                0 Documents
              </span>
              <button 
                className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                <span>Refresh</span>
                <RefreshCw className="w-4 h-4" />
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
                {/* Empty table body - no data */}
              </tbody>
            </table>
          </div>

          {/* No documents message */}
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-2">No documents found</div>
              <div className="text-sm text-gray-500">Your payment documents will appear here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}