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

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300">Last updated: January 5, 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Bank of Columbia (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains 
                  how we collect, use, disclose, and safeguard your information when you use our banking platform.
                </p>
                <p>
                  This policy applies to information we collect through our Service and through your interactions with us.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900">Information from Roblox</h4>
                  <p>When you authenticate through Roblox OAuth, we collect:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your Roblox User ID</li>
                    <li>Your Roblox username and display name</li>
                    <li>Your Roblox profile picture (if available)</li>
                    <li>Account creation date</li>
                    <li>Profile URL</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mt-4">Service Usage Information</h4>
                  <p>We collect information about how you use our Service:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Transaction history and financial activities</li>
                    <li>Property ownership and assignment records</li>
                    <li>Login and authentication logs</li>
                    <li>API requests and usage patterns</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our banking services</li>
                  <li>Authenticate and verify your identity</li>
                  <li>Process transactions and maintain financial records</li>
                  <li>Manage property assignments and ownership</li>
                  <li>Prevent fraud and maintain security</li>
                  <li>Improve our Service and user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Communicate with you about your account</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-600">
                <p>We do not sell, trade, or rent your personal information. We may share your information only in these situations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>With your consent:</strong> When you explicitly agree to sharing</li>
                  <li><strong>Service providers:</strong> Third parties who assist in Service operation (with strict confidentiality)</li>
                  <li><strong>Legal compliance:</strong> When required by law or to protect rights and safety</li>
                  <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
                  <li><strong>Public information:</strong> Information you choose to make public (like usernames)</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <div className="space-y-4 text-gray-600">
                <p>We implement comprehensive security measures to protect your information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Access controls:</strong> Role-based permissions and row-level security</li>
                  <li><strong>Authentication:</strong> Secure OAuth through Roblox</li>
                  <li><strong>Monitoring:</strong> Continuous security monitoring and logging</li>
                  <li><strong>Regular audits:</strong> Periodic security assessments</li>
                  <li><strong>Infrastructure:</strong> Hosted on secure, compliant platforms</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <div className="space-y-4 text-gray-600">
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide our services to you</li>
                  <li>Maintain accurate financial records</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
                <p>
                  When information is no longer needed, we securely delete or anonymize it according to our data retention policies.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-600">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request information about the data we have about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing (where applicable)</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
              <div className="space-y-4 text-gray-600">
                <p>Our Service integrates with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Roblox:</strong> For authentication and user information</li>
                  <li><strong>Supabase:</strong> For secure data storage and management</li>
                  <li><strong>Vercel:</strong> For application hosting and deployment</li>
                </ul>
                <p>
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our Service requires users to be 13 years or older, in compliance with Roblox&apos;s terms. 
                  We do not knowingly collect personal information from children under 13. If we become aware 
                  that we have collected such information, we will take steps to delete it promptly.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure that such transfers comply with applicable data protection laws and that appropriate 
                  safeguards are in place to protect your information.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new policy on this page and updating the &quot;Last updated&quot; date. Significant changes will be 
                  communicated through additional means.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: support@bankofcolumbia.com</li>
                  <li>Privacy Officer: privacy@bankofcolumbia.com</li>
                  <li>Support Portal: <Link href="/banking/petition" className="text-blue-600 hover:underline">Submit a Privacy Request</Link></li>
                  <li>Address: Bank of Columbia, Privacy Department, Digital Banking Division</li>
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