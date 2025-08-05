"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Youtube, Linkedin, MapPin } from "lucide-react"
import { PropertyData, PropertyType } from '@/types/property'
import Image from 'next/image'

const propertyTypes: PropertyType[] = ['Small House', 'Small Row House', 'Medium House', 'Medium Row House', 'Large House', 'Large Row House']
const municipalities: string[] = ['Lander', 'Medford', 'Woodbury', 'Mersea']

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)

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
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6">Premium Properties for Lease</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover exceptional properties available for lease across our municipalities. From residential homes to
            commercial spaces, find your perfect property with Bank of Columbia.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-lg font-bold">FDIC</div>
            <div className="text-sm text-gray-300">
              FDIC-Insured - Backed by the full faith and credit of the U.S. Government. Bank of Columbia.
            </div>
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

                    {/* Property Info */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">Holder: {property.holderRobloxName}</div>
                        <div>Roblox ID: {property.holderRobloxId}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                      >
                        Schedule Tour
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {properties.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 bg-transparent"
              >
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our real estate experts are here to help you navigate the property market and secure financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Property Consultation</h3>
              <p className="text-gray-600 mb-4">
                Get personalized advice on property selection and market insights from our experts.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Schedule Consultation</Button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Mortgage Pre-Approval</h3>
              <p className="text-gray-600 mb-4">
                Get pre-approved for a mortgage to strengthen your offer and streamline the buying process.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Pre-Approved</Button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Property Financing</h3>
              <p className="text-gray-600 mb-4">
                Explore competitive mortgage rates and financing options tailored to your needs.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Rates</Button>
            </div>
          </div>
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
                <Link href="#" className="hover:text-blue-300">
                  Site Terms
                </Link>
                <Link href="#" className="hover:text-blue-300">
                  Privacy Center
                </Link>
                <Link href="#" className="hover:text-blue-300">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-blue-300 flex items-center gap-1">
                  Your Privacy Choices
                  <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                </Link>
              </div>
            </div>

            <div className="space-y-4 text-xs opacity-70">
              <p>Bank of Columbia is a full-service financial institution.</p>
              <p>
                All loans, deposit products, and credit cards are provided or issued by Bank of Columbia. Member FDIC.
              </p>
              <p>© 2025 Bank of Columbia. All rights reserved.</p>
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