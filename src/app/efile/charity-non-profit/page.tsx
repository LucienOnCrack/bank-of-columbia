"use client"

import { EFilingSidebar } from "@/components/efiling-sidebar"
import { useAuth } from "@/components/AuthProvider"

export default function CharityNonProfit() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-900">Please log in to access the e-filing hub.</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden">
      <EFilingSidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-4xl font-light text-gray-900 mb-6">2. Charity / Non-Profit</h1>
          <p className="text-gray-600 mb-8">
            Charity and non-profit organization compliance and documentation.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
            <h3 className="font-medium text-gray-900 mb-4">✅ Section Complete</h3>
            <p className="text-gray-600">
              All charity and non-profit requirements have been successfully completed and verified.
            </p>
          </div>
          
          <div className="mt-8">
            <div className="w-3 h-3 rounded-full bg-green-800 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Completed Step</p>
          </div>
        </div>
      </div>
    </div>
  )
}