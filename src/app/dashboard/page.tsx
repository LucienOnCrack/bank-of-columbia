"use client"

import { Plus, Edit, Search, Building, CreditCard, DollarSign } from "lucide-react"
import Link from "next/link"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/components/AuthProvider"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    propertiesCount: 0,
    activeMortgagesCount: 0,
    portfolioValue: 0,
    loading: true
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Fetch properties and mortgages in parallel
        const [propertiesResponse, mortgagesResponse] = await Promise.all([
          fetch('/api/properties', { credentials: 'include' }),
          fetch('/api/mortgages', { credentials: 'include' })
        ])

        let propertiesCount = 0
        let portfolioValue = 0
        let activeMortgagesCount = 0

        // Process properties data
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json()
          const properties = propertiesData.properties || []
          propertiesCount = properties.length
          portfolioValue = properties.reduce((sum: number, property: any) => {
            return sum + (property.propertyValue || property.lease_price || 0)
          }, 0)
        }

        // Process mortgages data  
        if (mortgagesResponse.ok) {
          const mortgagesData = await mortgagesResponse.json()
          const mortgages = mortgagesData.mortgages || []
          activeMortgagesCount = mortgages.filter((mortgage: any) => mortgage.status === 'active').length
        }

        setDashboardData({
          propertiesCount,
          activeMortgagesCount,
          portfolioValue,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setDashboardData(prev => ({ ...prev, loading: false }))
      }
    }

    if (!loading && user) {
      fetchDashboardData()
    }
  }, [user, loading])

  if (loading || dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 flex overflow-hidden">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Greeting */}
          <div className="mb-16">
            <h1 className="text-5xl font-light text-white mb-2">Good Morning,</h1>
            <h2 className="text-5xl font-light text-white">{user.roblox_name}</h2>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="flex flex-col items-start text-left space-y-4">
                <Plus className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-white font-medium mb-1">Link a</h3>
                  <h3 className="text-white font-medium">Commercial Card</h3>
                </div>
              </div>
            </div>

            <Link href="/mortgages">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:bg-slate-700 transition-colors cursor-pointer">
                <div className="flex flex-col items-start text-left space-y-4">
                  <Edit className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-white font-medium mb-1">View</h3>
                    <h3 className="text-white font-medium">Mortgages</h3>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:bg-slate-700 transition-colors cursor-pointer">
              <div className="flex flex-col items-start text-left space-y-4">
                <Search className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-white font-medium mb-1">Search</h3>
                  <h3 className="text-white font-medium">payments</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Properties</h3>
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white">{dashboardData.propertiesCount}</div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Active Mortgages</h3>
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white">{dashboardData.activeMortgagesCount}</div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Portfolio Value</h3>
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'UCD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(dashboardData.portfolioValue)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
