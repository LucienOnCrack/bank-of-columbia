"use client"

import { EFilingSidebar } from "@/components/efiling-sidebar"
import { useAuth } from "@/components/AuthProvider"

export default function FinancialInstitution() {
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
          <h1 className="text-4xl font-light text-gray-900 mb-6">Financial Institution</h1>
          <p className="text-gray-600 mb-8">
            Complete the financial institution setup and document upload process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">1.1 Setup</h3>
              <p className="text-gray-600 mb-4">Configure your financial institution details</p>
              <div className="w-3 h-3 rounded-full bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-4">1.2 Document Upload</h3>
              <p className="text-gray-600 mb-4">Upload required financial documents</p>
              <div className="w-3 h-3 rounded-full border-2 border-gray-500 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}