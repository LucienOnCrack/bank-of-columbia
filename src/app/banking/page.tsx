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
import { ChevronDown, Check, User, DollarSign, LogOut, Shield, Building, Facebook, Instagram, Youtube, Linkedin } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function BankingPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [initialDeposit, setInitialDeposit] = useState(25000)
  const [termLength, setTermLength] = useState(4)
  const [calculatedAmount, setCalculatedAmount] = useState(1050)
  const [nationalAverage, setNationalAverage] = useState(470)
  const { user, loading, signOut } = useAuth()

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const formatTermLength = (years: number) => {
    if (years < 1) {
      return `${Math.round(years * 12)} mo`
    }
    return `${years} yr`
  }

  const calculateSavings = () => {
    // Marcus rate: 4.4% APY (example calculation)
    const marcusRate = 0.044
    const nationalRate = 0.018 // Lower national average rate
    
    const marcusAmount = initialDeposit * Math.pow(1 + marcusRate, termLength)
    const nationalAmount = initialDeposit * Math.pow(1 + nationalRate, termLength)
    
    const marcusEarnings = Math.round(marcusAmount - initialDeposit)
    const nationalEarnings = Math.round(nationalAmount - initialDeposit)
    
    setCalculatedAmount(marcusEarnings)
    setNationalAverage(nationalEarnings)
  }

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value) {
      setInitialDeposit(parseInt(value))
    }
  }

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setTermLength(value)
  }

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
      <section className="bg-slate-800 text-white">
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
                  Automated Banking for Mayflower
                </h1>

                <div className="mb-8">
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Bank of Columbia is seeking developer approval to bring comprehensive automated banking 
                    to the Mayflower platform. Enable seamless financial experiences with investment accounts, 
                    credit cards, auto payments, and real-time transaction processing.
                  </p>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-16 py-5 text-lg rounded-lg mb-12 font-normal">
                  Apply for Developer Support
                </Button>

                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">FDIC</div>
                  <div className="text-sm text-gray-300">
                    FDIC-Insured - Backed by the full faith and credit of the U.S. Government. Bank of Columbia.
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-8 text-gray-900 shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-medium mb-6">Developer Integration Package</h3>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-light text-blue-600 mb-2">126 People</div>
                    <div className="text-sm text-gray-600">Have signed the petition to implement this</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Implementation timeline</div>
                    <div className="text-3xl font-light text-gray-900">
                      <span className="text-lg">≤</span>30 days
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-6">
                    Complete banking infrastructure ready for Mayflower integration. 
                    <Link href="#" className="text-blue-600 hover:underline"> Developer documentation available</Link>. 
                    Secure, scalable, and fully compliant with financial regulations. 
                    24/7 developer support and monitoring included.
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-gray-900 mb-16">
            See how much your savings could grow
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            <div className="space-y-6 p-6 border-l border-t border-b border-gray-200 min-h-[600px] flex flex-col">
              <div>
                <label className="block text-base font-medium text-gray-900 mb-3">
                  Initial deposit
                </label>
                <input 
                  type="text" 
                  value={formatCurrency(initialDeposit)} 
                  className="w-full p-4 border-2 border-blue-500 rounded text-lg font-medium"
                  onChange={handleDepositChange}
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-900 mb-3">
                  Term length
                </label>
                <div className="text-4xl font-light text-blue-600 mb-4">{formatTermLength(termLength)}</div>
                <div className="relative mb-4">
                  <input
                    type="range"
                    min="0.5"
                    max="6"
                    step="0.5"
                    value={termLength}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                    onChange={handleTermChange}
                  />
                  <style jsx>{`
                    .slider::-webkit-slider-thumb {
                      appearance: none;
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #2563eb;
                      cursor: pointer;
                    }
                    .slider::-moz-range-thumb {
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #2563eb;
                      cursor: pointer;
                      border: none;
                    }
                  `}</style>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>6 mo</span>
                  <span>6 yr</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 leading-relaxed">
                The calculator is for illustrative purposes only and may not apply to your individual 
                circumstances. Calculated values assume that principal and interest remain on deposit 
                and are rounded to the nearest dollar. All APYs are subject to change.
              </div>

              <div className="text-sm text-gray-500">
                Our rate effective as of August 05, 2025<br/>
                National Average rate effective as of July 29, 2025
              </div>

              <div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded font-medium"
                  onClick={calculateSavings}
                >
                  Calculate
                </Button>
              </div>
            </div>

            <div style={{backgroundColor: '#22263F'}} className="pt-8 px-8 pb-0 text-white min-h-[600px]">              
              <div className="h-full flex justify-center space-x-16 relative">
                <div className="relative flex flex-col items-center h-full justify-end">
                  <div className="text-center mb-4">
                    <div className="text-white text-sm mb-1">Marcus</div>
                    <span style={{color: '#5BCFB3'}} className="text-4xl font-light">{formatCurrency(calculatedAmount)}</span>
                  </div>
                  <div 
                    style={{backgroundColor: '#5BCFB3', width: '128px', height: `${Math.max(400, Math.min(500, (calculatedAmount / Math.max(calculatedAmount, nationalAverage)) * 500))}px`}}
                  ></div>
                </div>
                <div className="relative flex flex-col items-center h-full justify-end">
                  <div className="text-center mb-4">
                    <div className="text-white text-sm mb-1">National Average</div>
                    <span style={{color: '#3A98E2'}} className="text-3xl font-light">{formatCurrency(nationalAverage)}</span>
                  </div>
                  <div 
                    style={{backgroundColor: '#3A98E2', width: '128px', height: `${Math.max(300, Math.min(500, (nationalAverage / Math.max(calculatedAmount, nationalAverage)) * 500))}px`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-gray-500 leading-relaxed">
            The National Average is based on the APY average for certificate of deposit accounts with a minimum balance of at least $2,500 offered by the top 50 US banks (ranked by total deposits) as reported by Informa Financial Intelligence, www.informars.com. Informa has obtained the data from the various financial institutions that it tracks and its accuracy cannot be guaranteed.
          </div>
        </div>
      </section>

      {/* What we will bring to Mayflower Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center text-gray-900 mb-4">
            What we plan to integrate to Clark County
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16">
            Comprehensive banking solutions designed for your community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Automated Mortgage Payments</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Set up automatic mortgage payments directly from your accounts. 
                Never miss a payment and maintain your credit score with reliable automated transfers.
              </p>
              <a href="#" className="text-blue-600 hover:underline">Learn more</a>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Automated Rent Payments</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Schedule automatic rent payments to your landlord or property management company. 
                Build payment history and ensure on-time payments every month.
              </p>
              <a href="#" className="text-blue-600 hover:underline">Learn more</a>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Savings Accounts</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                High-yield savings accounts with competitive interest rates. 
                Build your financial foundation with secure, FDIC-insured savings.
              </p>
              <a href="#" className="text-blue-600 hover:underline">Learn more</a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Credit Rating System
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                After given developer support we will begin the credit rating system
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Real-Time Credit Monitoring</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Track your credit score changes in real-time as you make payments through our automated systems. 
                    See immediate impact of on-time mortgage and rent payments on your creditworthiness.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Payment History Reporting</h4>
                  <p className="text-gray-600 leading-relaxed">
                    All automated payments made through Bank of Columbia will be reported to major credit bureaus, 
                    helping Mayflower users build strong payment histories and improve their credit profiles over time.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Credit Building Tools</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Access personalized recommendations and credit-building strategies based on your financial activity. 
                    Our system will provide actionable insights to help users optimize their credit scores through smart financial decisions.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Integrated Financial Ecosystem</h4>
                  <p className="text-gray-600 leading-relaxed">
                    The credit rating system will seamlessly integrate with all Mayflower financial services, 
                    creating a comprehensive view of each user's financial health and enabling better lending decisions for future services.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img
                src="/images/moneyclouds.png"
                alt="Money and clouds illustration representing financial growth"
                className="w-full max-w-md object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FDIC Insurance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Proposed FDIC Insurance
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                After developer approval, we would pitch FDIC insurance implementation to protect Clark County deposits 
                up to $250,000 per depositor. This proposal would need to be passed to provide federal protection for user funds.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">What We Would Offer</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Full FDIC protection for savings, checking, and automated payment systems - same level as traditional banks. 
                    All deposits would be federally insured, providing complete peace of mind for Clark County residents.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Benefits for Users</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Federal insurance would eliminate risk concerns about digital banking and encourage more residents to use our 
                    automated services. Users would have the same confidence they get from traditional brick-and-mortar banks.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Implementation</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Work with federal regulators to establish proper FDIC coverage, structure accounts for maximum protection, 
                    and provide clear documentation. This would position Clark County as a leader in secure digital banking.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img
                src="/images/fdic.png"
                alt="FDIC - Federal Deposit Insurance Corporation Logo"
                className="w-full max-w-md object-contain"
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