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
import { getRobloxAuthUrl } from "@/lib/auth"

export default function PetitionPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [responses, setResponses] = useState({
    currentCustomer: '',
    mortgagePayments: '',
    rentPayments: '',
    savingsAccount: '',
    creditCard: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSignedPetition, setHasSignedPetition] = useState(false)
  const [isCheckingSignature, setIsCheckingSignature] = useState(false)
  const { user, loading, signOut } = useAuth()

  // Auto-advance to step 2 if user is logged in
  useEffect(() => {
    if (user && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [user, currentStep])

  // Check if user has already signed the petition
  useEffect(() => {
    const checkUserSignature = async () => {
      if (!user) return

      setIsCheckingSignature(true)
      try {
        const response = await fetch('/api/petition?checkSigned=true')
        if (response.ok) {
          const data = await response.json()
          if (data.hasSigned) {
            // User has already signed, redirect to thank you page
            window.location.href = '/banking/petition/thank-you'
          }
        }
      } catch (error) {
        console.error('Error checking signature status:', error)
      } finally {
        setIsCheckingSignature(false)
      }
    }

    checkUserSignature()
  }, [user])



  const handleResponseChange = (question: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [question]: value
    }))
  }

  const submitPetition = async () => {
    if (!user) {
      alert('You must be logged in to sign the petition.')
      return
    }

    // Check if all questions are answered
    const allAnswered = Object.values(responses).every(response => response !== '')
    
    if (!allAnswered) {
      alert('Please answer all questions before signing the petition.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/petition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      })

      const data = await response.json()

      if (response.ok) {
        setHasSignedPetition(true)
        // Redirect to thank you page
        window.location.href = '/banking/petition/thank-you'
      } else {
        const errorMessage = data.details ? `${data.error}: ${data.details}` : data.error
        throw new Error(errorMessage || 'Failed to submit petition')
      }
    } catch (error) {
      console.error('Error submitting petition:', error)
      alert('There was an error submitting your petition. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

  // Show loading while checking authentication or signature status
  if (loading || isCheckingSignature) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

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
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="relative flex items-end">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <span className={`text-sm font-medium mb-4 whitespace-nowrap ${currentStep >= 1 ? 'text-green-800' : 'text-gray-500'}`}>Verify identity</span>
                <div className={`w-6 h-6 rounded-full ${currentStep >= 1 ? 'bg-green-800' : 'border-2 border-gray-300 bg-white'}`}></div>
              </div>
              
              {/* Line 1 */}
              <div className="flex items-center h-6 mx-8 mb-0">
                <div className={`w-32 h-px ${currentStep >= 2 ? 'bg-green-800' : 'bg-gray-300'}`}></div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <span className={`text-sm mb-4 whitespace-nowrap ${currentStep >= 2 ? 'text-green-800 font-medium' : 'text-gray-500'}`}>Sign petition</span>
                <div className={`w-6 h-6 rounded-full ${currentStep >= 2 ? 'bg-green-800' : 'border-2 border-gray-300 bg-white'}`}></div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <>
              {/* Step 1: Verify Identity */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-gray-900 mb-4">Verify your identity</h1>
                <p className="text-gray-600">
                  Connect your Roblox account to verify your identity and continue with the petition process.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Connect with Roblox</h3>
                    <p className="text-gray-600 text-sm">
                      Sign in with your Roblox account to continue. We&apos;ll create your Bank of Columbia account automatically.
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                    onClick={() => {
                      window.location.href = getRobloxAuthUrl('/banking/petition')
                    }}
                  >
                    Continue with Roblox
                  </Button>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Step 2: Sign Petition */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-gray-900 mb-4">Sign the petition</h1>
                <p className="text-gray-600">
                  Welcome {user?.roblox_name}! Help us bring automated banking to Mayflower by signing this petition.
                </p>
              </div>



              <div className="space-y-6">
                {/* Petition Questions */}
                <div className="space-y-8">
                    
                    {/* Question 1 */}
                    <div>
                      <label className="block text-gray-900 mb-3">
                        Are you currently a Bank of Columbia customer?
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="currentCustomer"
                            value="yes"
                            checked={responses.currentCustomer === 'yes'}
                            onChange={(e) => handleResponseChange('currentCustomer', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">Yes, I am already a customer.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="currentCustomer"
                            value="no"
                            checked={responses.currentCustomer === 'no'}
                            onChange={(e) => handleResponseChange('currentCustomer', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">No, not right now.</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div>
                      <label className="block text-gray-900 mb-3">
                        Would you be interested in automated mortgage payment services?
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="mortgagePayments"
                            value="yes"
                            checked={responses.mortgagePayments === 'yes'}
                            onChange={(e) => handleResponseChange('mortgagePayments', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">Yes, I would be interested.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="mortgagePayments"
                            value="no"
                            checked={responses.mortgagePayments === 'no'}
                            onChange={(e) => handleResponseChange('mortgagePayments', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">No, not interested.</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div>
                      <label className="block text-gray-900 mb-3">
                        Would you be interested in automated rent payment services?
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="rentPayments"
                            value="yes"
                            checked={responses.rentPayments === 'yes'}
                            onChange={(e) => handleResponseChange('rentPayments', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">Yes, I would be interested.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="rentPayments"
                            value="no"
                            checked={responses.rentPayments === 'no'}
                            onChange={(e) => handleResponseChange('rentPayments', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">No, not interested.</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 4 */}
                    <div>
                      <label className="block text-gray-900 mb-3">
                        Would you be interested in utilising a savings account?
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="savingsAccount"
                            value="yes"
                            checked={responses.savingsAccount === 'yes'}
                            onChange={(e) => handleResponseChange('savingsAccount', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">Yes, I would be interested.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="savingsAccount"
                            value="no"
                            checked={responses.savingsAccount === 'no'}
                            onChange={(e) => handleResponseChange('savingsAccount', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">No, not interested.</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 5 */}
                    <div>
                      <label className="block text-gray-900 mb-3">
                        Would you consider getting a credit card?
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="creditCard"
                            value="yes"
                            checked={responses.creditCard === 'yes'}
                            onChange={(e) => handleResponseChange('creditCard', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">Yes, I would consider it.</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="creditCard"
                            value="no"
                            checked={responses.creditCard === 'no'}
                            onChange={(e) => handleResponseChange('creditCard', e.target.value)}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                          />
                          <span className="ml-3 text-gray-900">No, not interested.</span>
                        </label>
                      </div>
                    </div>

                  </div>

                {/* Sign Button */}
                <div className="pt-6">
                  <div className="flex justify-center">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-lg font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={submitPetition}
                      disabled={isSubmitting || hasSignedPetition}
                    >
                      {isSubmitting ? 'Submitting...' : hasSignedPetition ? 'Petition Signed' : 'Sign Petition'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}