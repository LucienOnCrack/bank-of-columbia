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
import { ChevronDown, Info, Facebook, Instagram, Youtube, Linkedin, User, DollarSign, LogOut, Shield, Building } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function HomePage() {
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
      {/* Header */}
      <header className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src="/boc-logo-white.png" alt="Bank of Columbia" className="h-8 w-auto" />
              <span className="text-xl font-medium text-white">Bank of Columbia</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <div
                  className="flex items-center space-x-1 cursor-pointer hover:text-blue-300"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveDropdown(activeDropdown === "banking" ? null : "banking")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveDropdown(activeDropdown === "banking" ? null : "banking")
                    }
                    if (e.key === "Escape") {
                      setActiveDropdown(null)
                    }
                  }}
                >
                  <span>Banking</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                {activeDropdown === "banking" && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-[9999] py-2">
                    <div className="px-4 py-2">
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Account Services
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Property Banking
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Financial Calculator
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
                    setActiveDropdown(activeDropdown === "cds" ? null : "cds")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveDropdown(activeDropdown === "cds" ? null : "cds")
                    }
                    if (e.key === "Escape") {
                      setActiveDropdown(null)
                    }
                  }}
                >
                  <span>CDs</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                {activeDropdown === "cds" && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-[9999] py-2">
                    <div className="p-4 px-4 py-2">
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        High-Yield CDs
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        No-Penalty CDs
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        CD Rates
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        CD Calculator
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
                    setActiveDropdown(activeDropdown === "credit" ? null : "credit")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveDropdown(activeDropdown === "credit" ? null : "credit")
                    }
                    if (e.key === "Escape") {
                      setActiveDropdown(null)
                    }
                  }}
                >
                  <span>Credit Cards</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                {activeDropdown === "credit" && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-[9999] py-2">
                    <div className="p-4 px-4 py-2">
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        GM Rewards Cards
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        GM Business Cards
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Apply Now
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
                    setActiveDropdown(activeDropdown === "tools" ? null : "tools")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveDropdown(activeDropdown === "tools" ? null : "tools")
                    }
                    if (e.key === "Escape") {
                      setActiveDropdown(null)
                    }
                  }}
                >
                  <span>Tools & Resources</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                {activeDropdown === "tools" && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-[9999] py-2">
                    <div className="p-4 px-4 py-2">
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Articles
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Financial Calculators
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        Learning Center
                      </Link>
                      <Link
                        href="#"
                        className="block py-3 px-2 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        FAQs
                      </Link>
                    </div>
                  </div>
                )}
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

      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-light leading-tight mb-8">
                Bank of Columbia - Your trusted financial partner in the Roblox community
              </h1>

              <div className="mb-8">
                <p className="text-xl text-gray-300 leading-relaxed">
                  We're not just a savings platform. Bank of Columbia is a comprehensive banking institution 
                  serving the Roblox community with full-service financial solutions including property management, 
                  mortgages, secure transactions, and personalized banking experiences.
                </p>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-5 text-lg rounded-lg mb-12 font-normal">
                Explore Our Services
              </Button>

              <div className="flex items-center gap-4">
                <div className="text-lg font-bold">FDIC</div>
                <div className="text-sm text-gray-300">
                  FDIC-Insured - Backed by the full faith and credit of the U.S. Government. Bank of Columbia.
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src="/coin-stack.png"
                alt="Stacked coins representing financial growth and prosperity"
                className="w-96 h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Savings Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-gray-900 mb-16">
            Financial products to help you manage and grow your wealth
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Online Savings Account */}
            <div className="p-8" style={{ backgroundColor: '#E6ECF2' }}>
              <h3 className="text-xl font-medium mb-6">Online Savings Account</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">No minimum balance</div>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-light text-green-600 mb-2">3.65%</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Annual Percentage Yield <Info className="w-4 h-4" />
                </div>
              </div>
              <Link href="#" className="text-gray-900 underline hover:no-underline">
                Explore Online Savings {">"}
              </Link>
            </div>

            {/* High-Yield CD */}
            <div className="p-8" style={{ backgroundColor: '#E6ECF2' }}>
              <h3 className="text-xl font-medium mb-6">High-Yield CD</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">6 months</div>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-light text-teal-600 mb-2">4.40%</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Annual Percentage Yield <Info className="w-4 h-4" />
                </div>
              </div>
              <Link href="#" className="text-gray-900 underline hover:no-underline">
                Explore High-Yield CDs {">"}
              </Link>
            </div>

            {/* No-Penalty CD */}
            <div className="p-8" style={{ backgroundColor: '#E6ECF2' }}>
              <h3 className="text-xl font-medium mb-6">No-Penalty CD</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">7 months</div>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-light text-blue-600 mb-2">4.15%</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  Annual Percentage Yield <Info className="w-4 h-4" />
                </div>
              </div>
              <Link href="#" className="text-gray-900 underline hover:no-underline">
                Explore No-Penalty CDs {">"}
              </Link>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-6">Additional CD terms are available</p>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-12 py-4 rounded-lg font-normal"
            >
              Compare financial products
            </Button>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Security focused</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Bank of Columbia, we make it a priority to protect your personal information and accounts. We use
                advanced security measures and monitoring to help keep your money safe.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/security-shield.png"
                alt="Security shield with person climbing ladder to checkmark, representing Bank of Columbia's commitment to security"
                className="w-96 h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Bank of Columbia Column */}
            <div>
              <h3 className="font-medium mb-4">Bank of Columbia</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    About Bank of Columbia
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Security Center
                  </Link>
                </li>
              </ul>
        </div>

            {/* Products Column */}
            <div>
              <h3 className="font-medium mb-4">Products</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Banking & Financial Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Credit Cards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Financial Calculators
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <div className="space-y-4 mb-8">
                <Button
                  variant="outline"
                  className="w-full text-white border-white hover:bg-white hover:text-slate-800 bg-transparent"
                >
                  FAQs
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-white border-white hover:bg-white hover:text-slate-800 bg-transparent"
                >
                  Contact Us
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-sm opacity-80 mb-4">Connect with Us</p>
                <div className="flex space-x-4">
                  <Facebook className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
                  <Instagram className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
                  <Youtube className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
                  <div className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer">𝕏</div>
                  <Linkedin className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo and Legal */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div className="mb-6 lg:mb-0">
                <img src="/boc-logo-white.png" alt="Bank of Columbia" className="h-8 w-auto" />
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <Link href="/tos" className="hover:text-blue-300">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-blue-300">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-blue-300">
                  Site Terms
                </Link>
                <Link href="#" className="hover:text-blue-300">
                  Privacy Center
                </Link>
              </div>
            </div>

            <div className="space-y-4 text-xs opacity-70">
              <p>Bank of Columbia is a full-service financial institution.</p>
              <p>
                All loans, deposit products, and credit cards are provided or issued by Bank of Columbia. Member FDIC.
              </p>
              <p>© 2025 Bank of Columbia. All rights reserved.</p>
              <p>
                App Store and the Apple Logo are registered trademarks of Apple Inc. Google Play and the Google Play
                logo are trademarks of Google LLC.
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              <div className="text-xs bg-slate-700 px-2 py-1 rounded">Norton Secured</div>
              <div className="text-xs bg-slate-700 px-2 py-1 rounded">Equal Housing Lender</div>
            </div>
          </div>
        </div>
      </footer>
      </div>
  )
}
