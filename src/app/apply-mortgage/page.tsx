"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Check, User, DollarSign, LogOut, Shield, Building } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function ApplyMortgagePage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside the navigation area
      if (!(event.target as Element).closest("nav")) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-teal-600 text-white">
        {/* Header */}
        <header className="bg-transparent text-white relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src="/boc-logo-white.png" alt="Bank of Columbia" className="h-8 w-auto" />
                <span className="text-xl font-medium text-white">Bank of Columbia</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <div className="relative">
                  <div
                    className="flex items-center space-x-1 cursor-pointer hover:text-blue-300"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveDropdown(activeDropdown === "mortgages" ? null : "mortgages")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setActiveDropdown(activeDropdown === "mortgages" ? null : "mortgages")
                      }
                      if (e.key === "Escape") {
                        setActiveDropdown(null)
                      }
                    }}
                  >
                    <span>Mortgages</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  {activeDropdown === "mortgages" && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-[9999] py-2">
                      <div className="px-4 py-2">
                        <Link
                          href="/apply-mortgage"
                          className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                        >
                          Apply for a Mortgage
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div
                    className="flex items-center space-x-1 cursor-pointer hover:text-blue-300"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveDropdown(activeDropdown === "properties" ? null : "properties")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setActiveDropdown(activeDropdown === "properties" ? null : "properties")
                      }
                      if (e.key === "Escape") {
                        setActiveDropdown(null)
                      }
                    }}
                  >
                    <span>Properties</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  {activeDropdown === "properties" && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-[9999] py-2">
                      <div className="px-4 py-2">
                        <Link
                          href="/properties"
                          className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                        >
                          Buying Properties
                        </Link>
                        <Link
                          href="/properties"
                          className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                        >
                          Selling Properties
                        </Link>
                        <Link
                          href="/properties"
                          className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                        >
                          Property Appraisals
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <span>Investment Capital</span>
                  </Link>
                </div>

                <div className="relative">
                  <Link
                    href="/banking"
                    className="hover:text-blue-300 transition-colors"
                  >
                    <span>Banking</span>
                  </Link>
                </div>
              </nav>

              {/* Right side buttons */}
              <div className="flex items-center space-x-4">
                <Link href="#" className="text-sm hover:text-blue-300">
                  Compare financial products
                </Link>
                {user ? (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-slate-800 bg-transparent"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-slate-800 bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                )}
                
                {/* Profile Picture Dropdown */}
                {!loading && user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden bg-white/10 hover:bg-white/20">
                        {user.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt={`${user.roblox_name} avatar`}
                            className="absolute inset-0 h-full w-full rounded-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', user.profile_picture);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.roblox_name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            ${user.balance.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Dashboard Links - Only show if user has access */}
                      <Link href="/dashboard">
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>User Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      
                      {(user.role === 'employee' || user.role === 'admin') && (
                        <Link href="/employee/dashboard">
                          <DropdownMenuItem>
                            <Building className="mr-2 h-4 w-4" />
                            <span>Employee Dashboard</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      
                      {user.role === 'admin' && (
                        <Link href="/admin">
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-light leading-tight mb-8">
                  Property Mortgage: 
                  Get the home of your dreams with flexible terms
                </h1>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-xl">Competitive interest rates starting at 3.25% APR</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-xl">Flexible payment terms from 15 to 30 years</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-xl">Quick pre-approval process in 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-xl">No prepayment penalties. Pay off early with savings.</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <div className="text-lg font-bold">FDIC</div>
                  <div className="text-sm">
                    FDIC-Insured - Backed by the full faith and credit of the U.S. Government. Bank of Columbia.
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-8 text-gray-900 shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-medium mb-6">30-Year Fixed Rate Mortgage</h3>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-light text-blue-600 mb-2">3.25% APR</div>
                    <div className="text-sm text-gray-600">Annual Percentage Rate</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Minimum down payment</div>
                    <div className="text-3xl font-light text-gray-900">
                      <span className="text-lg">$</span>25,000
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-6">
                    Annual Percentage Rate (APR) as of January 07, 2025. 
                    <Link href="#" className="text-blue-600 hover:underline"> Maximum loan limits apply</Link>. 
                    APR may change before a mortgage is opened and funded. Withdrawals permitted starting seven days after the funding date. 
                    $25,000 minimum to earn stated APR for 30-Year Fixed Rate Mortgage.
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                    Apply for mortgage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-8">
            Keep your homeownership dreams alive and your options open
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Finance your property with confidence. No gimmicks. No hidden fees. No questions asked. 
            Get pre-approved today and start your journey to homeownership with Bank of Columbia.
          </p>
        </div>
      </section>
    </div>
  )
}