"use client"

import { Upload, FileText, Search, FolderOpen, File, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { EFilingSidebar } from "@/components/efiling-sidebar"
import { useAuth } from "@/components/AuthProvider"

export default function EFilingHub() {
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
        <div className="text-center">
          {/* Greeting */}
          <div className="mb-16">
            <h1 className="text-5xl font-light text-gray-900 mb-2">E-Filing Hub</h1>
            <h2 className="text-3xl font-light text-gray-600">Welcome, {user.roblox_name}</h2>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col items-start text-left space-y-4">
                <Upload className="w-6 h-6 text-gray-700" />
                <div>
                  <h3 className="text-gray-900 font-medium mb-1">Upload</h3>
                  <h3 className="text-gray-900 font-medium">Documents</h3>
                </div>
              </div>
            </div>

            <Link href="/documents">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex flex-col items-start text-left space-y-4">
                  <FileText className="w-6 h-6 text-gray-700" />
                  <div>
                    <h3 className="text-gray-900 font-medium mb-1">View</h3>
                    <h3 className="text-gray-900 font-medium">Documents</h3>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col items-start text-left space-y-4">
                <Search className="w-6 h-6 text-gray-700" />
                <div>
                  <h3 className="text-gray-900 font-medium mb-1">Search</h3>
                  <h3 className="text-gray-900 font-medium">Files</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-medium">Total Documents</h3>
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-3xl font-light text-gray-900">12</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-medium">Pending Review</h3>
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-3xl font-light text-gray-900">3</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-medium">Approved Files</h3>
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              <div className="text-3xl font-light text-gray-900">9</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}