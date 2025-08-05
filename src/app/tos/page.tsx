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
import { ChevronDown, User, DollarSign, LogOut, Shield, Building } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function TermsOfServicePage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
            <div className="flex items-center space-x-6">
              <Link href="/" className="hover:text-blue-300">Home</Link>
              <Link href="/dashboard" className="hover:text-blue-300">Dashboard</Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden bg-white/10 hover:bg-white/20">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={`${user.roblox_name} avatar`}
                          className="absolute inset-0 h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.roblox_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-800 bg-transparent">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-300">Last updated: January 5, 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  By accessing and using Bank of Columbia (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  This Service is designed exclusively for Roblox users and requires a valid Roblox account for authentication and access.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Bank of Columbia is a secure banking platform that provides:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Virtual banking services for Roblox users</li>
                  <li>Property management and tracking systems</li>
                  <li>Transaction history and financial records</li>
                  <li>Role-based access control (User, Employee, Admin)</li>
                  <li>Secure authentication through Roblox OAuth</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Authentication</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  To use our Service, you must:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Have a valid Roblox account</li>
                  <li>Be 13 years of age or older (in compliance with Roblox&apos;s terms)</li>
                  <li>Provide accurate and complete information when creating your account</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Engage in fraudulent activities or money laundering</li>
                  <li>Attempt to gain unauthorized access to other user accounts</li>
                  <li>Use automated scripts or bots to interact with the Service</li>
                  <li>Disrupt or interfere with the Service&apos;s operation</li>
                  <li>Violate Roblox&apos;s Terms of Service or Community Guidelines</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Financial Services and Transactions</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Bank of Columbia provides virtual banking services within the Roblox ecosystem:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All transactions are virtual and occur within the Service</li>
                  <li>We maintain detailed records of all financial activities</li>
                  <li>Property assignments and transfers are tracked and logged</li>
                  <li>Users are responsible for monitoring their account activities</li>
                  <li>Suspicious activities may result in account restrictions</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
                  By using the Service, you consent to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Security</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We implement industry-standard security measures including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Secure OAuth authentication through Roblox</li>
                  <li>Encrypted data transmission and storage</li>
                  <li>Row-level security policies on all database operations</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Role-based access controls</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Service is provided &quot;as is&quot; without any warranties. We shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages resulting from your use of the Service.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes. 
                  Continued use of the Service after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: support@bankofcolumbia.com</li>
                  <li>Support Portal: <Link href="/banking/petition" className="text-blue-600 hover:underline">Submit a Support Request</Link></li>
                  <li>Address: Bank of Columbia, Digital Banking Division</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-lg">Bank of Columbia</span>
              </div>
              <p className="text-gray-300 text-sm">
                Secure banking platform for Roblox users. Building trust through technology and transparency.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <div className="space-y-2 text-sm">
                <Link href="/dashboard" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Banking Dashboard
                </Link>
                <Link href="/properties" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Property Management
                </Link>
                <Link href="/employee" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Employee Portal
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2 text-sm">
                <Link href="/banking/petition" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Contact Support
                </Link>
                <Link href="https://status.bankofcolumbia.com" className="block text-gray-300 hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer">
                  System Status
                </Link>
                <Link href="/documents" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Documentation
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <div className="space-y-2 text-sm">
                <Link href="/tos" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="block text-gray-300 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-300">
              © {new Date().getFullYear()} Bank of Columbia. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 