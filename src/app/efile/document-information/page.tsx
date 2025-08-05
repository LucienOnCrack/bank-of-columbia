"use client"

import { EFilingSidebar } from "@/components/efiling-sidebar"
import { useAuth } from "@/components/AuthProvider"

export default function DocumentInformation() {
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
          <h1 className="text-4xl font-light text-gray-900 mb-6">Document Information</h1>
          <p className="text-gray-600 mb-8">
            This section covers the initial document submission and basic information requirements.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
            <h3 className="font-medium text-gray-900 mb-4">Required Documents:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Business registration documents</li>
              <li>• Tax identification numbers</li>
              <li>• Corporate structure information</li>
              <li>• Contact details and addresses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}