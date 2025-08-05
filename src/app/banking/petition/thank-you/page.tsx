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
import { ChevronDown, User, DollarSign, LogOut, Shield, Building, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function ThankYouPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [signatureCount, setSignatureCount] = useState(0)
  const { user, loading, signOut } = useAuth()

  // Fetch signature count when component loads
  useEffect(() => {
    const fetchSignatureCount = async () => {
      try {
        const response = await fetch('/api/petition?count=true')
        if (response.ok) {
          const data = await response.json()
          setSignatureCount(data.totalCount || 0)
        }
      } catch (error) {
        console.error('Error fetching signature count:', error)
      }
    }

    fetchSignatureCount()
  }, [])

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
      {/* Header */}
      <header className="bg-slate-800 text-white relative z-10">
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

      {/* Main Content */}
      <main className="bg-white min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Thank You Content */}
          <div className="text-center">
            <div className="mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-4xl font-light text-gray-900 mb-4">Thank you for signing!</h1>
              <p className="text-lg text-gray-600">
                Your petition signature has been successfully recorded.
              </p>
            </div>

            {/* Updated Signature Count */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="text-3xl font-light text-blue-600 mb-2">{signatureCount} Signatures</div>
              <p className="text-gray-600">
                Thanks to your support, we&apos;re one step closer to bringing automated banking to Mayflower.
              </p>
            </div>


          </div>
        </div>
      </main>
    </div>
  )
}