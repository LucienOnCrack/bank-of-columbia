"use client"

import { useState, useEffect, useCallback } from "react"
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
import { ChevronDown, User, DollarSign, LogOut, Shield, Building, Facebook, Instagram, Youtube, Linkedin, MapPin } from "lucide-react"
import { PropertyData, PropertyType } from '@/types/property'
import Image from 'next/image'
import { useAuth } from "@/components/AuthProvider"

const propertyTypes: PropertyType[] = ['Small House', 'Small Row House', 'Medium House', 'Medium Row House', 'Large House', 'Large Row House']
const municipalities: string[] = ['Lander', 'Medford', 'Woodbury', 'Mersea']

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { user, loading: authLoading, signOut } = useAuth()

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/properties/public')
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
      } else {
        console.error('Failed to load properties')
      }
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const getPropertyImage = (property: PropertyData) => {
    if (property.images && property.images.length > 0) {
      return property.images[0].url
    }
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UCD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

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
                    className="flex items-center space-x-1 cursor-pointer hover:text-blue-300 text-blue-300"
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
                {!authLoading && user && (
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
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6">Premium Properties for Lease</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover exceptional properties available for lease across our municipalities. From residential homes to
              commercial spaces, find your perfect property with Bank of Columbia.
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-gray-600">Explore our selection of premium properties available for lease</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Check back later for new property listings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-lg overflow-hidden"
                >
                  {/* Property Image */}
                  <div className="relative">
                    {getPropertyImage(property) ? (
                      <Image
                        src={getPropertyImage(property)!}
                        alt={`Property ${property.code}`}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-4xl">🏠</div>
                      </div>
                    )}

                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {property.status}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{property.neighbourhood}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{property.municipality}</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Code: {property.code}</div>
                      <div className="text-2xl font-light text-blue-600 mb-4">{formatPrice(property.leasePrice)}</div>
                    </div>

                    {/* Property Type */}
                    <div className="mb-4 py-3 border-t border-gray-200">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {property.type}
                      </span>
                    </div>



                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open('https://discord.gg/dSZPaCznDP', '_blank')}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                        onClick={() => window.open('https://discord.gg/dSZPaCznDP', '_blank')}
                      >
                        Schedule Tour
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}


        </div>
      </section>



      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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

            <div>
              <h3 className="font-medium mb-4">Products</h3>
              <ul className="space-y-3 text-sm opacity-80">
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Savings Accounts & CDs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-300">
                    Credit Cards
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="hover:text-blue-300">
                    Properties
                  </Link>
                </li>
              </ul>
            </div>

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

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div className="mb-6 lg:mb-0">
                <img src="/boc-logo-white.png" alt="Bank of Columbia" className="h-8 w-auto" />
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <Link href="/tos" className="hover:text-blue-300">
                  Site Terms
                </Link>
                <Link href="/privacy" className="hover:text-blue-300">
                  Privacy Center
                </Link>
                <Link href="/privacy" className="hover:text-blue-300">
                  Privacy Policy
                </Link>
                <Link href="/privacy" className="hover:text-blue-300 flex items-center gap-1">
                  Your Privacy Choices
                  <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                </Link>
              </div>
            </div>

            <div className="space-y-4 text-xs opacity-70">
              <p>Bank of Columbia is a full-service financial institution.</p>
              <p>
                All loans, deposit products, and credit cards are provided or issued by Bank of Columbia.
              </p>
              <p>© 2025 Bank of Columbia. All rights reserved.</p>
            </div>


          </div>
        </div>
      </footer>
    </div>
  )
} 