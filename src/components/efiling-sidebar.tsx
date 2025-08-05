"use client"

import { FileText, Building2, Heart, Landmark, Circle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function EFilingSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isActive = (path: string) => pathname === path
  
  // State to track which section is expanded
  const [expandedSection, setExpandedSection] = useState<string | null>('financial-institution')
  
  // Update expanded section based on current path
  useEffect(() => {
    if (pathname.startsWith('/efile/financial-institution')) {
      setExpandedSection('financial-institution')
    } else if (pathname === '/efile/charity-non-profit') {
      setExpandedSection('charity-non-profit')
    } else if (pathname === '/efile/government-entities') {
      setExpandedSection('government-entities')
    } else {
      setExpandedSection(null)
    }
  }, [pathname])
  
  // Check if any review and sign sub-section is active
  const isSupplementalActive = pathname.startsWith('/efile/financial-institution') || 
                              pathname === '/efile/charity-non-profit' || 
                              pathname === '/efile/government-entities'

  return (
    <div className="w-64 flex flex-col py-6 px-4 overflow-y-auto" style={{backgroundColor: '#F2F5F7'}}>
      <div className="mb-8">
        <div className="font-bold text-lg" style={{color: '#0E172B'}}>Bank of Columbia</div>
        <div className="text-sm text-gray-500">E-Filing Portal</div>
      </div>

      <nav className="flex flex-col w-full">
        {/* Document Information */}
        <div className="mb-0">
          <Link href="/efile/document-information" className="w-full" prefetch={true}>
            <div className={`flex items-center space-x-3 p-3 -mx-4 px-4 cursor-pointer transition-colors ${
              isActive("/efile/document-information") ? "bg-white" : "hover:bg-gray-100"
            }`}>
              <FileText className="w-5 h-5" style={{color: '#0E172B'}} />
              <span className="font-medium" style={{color: '#0E172B'}}>Document Information</span>
              <div className="ml-auto">
                <Circle className="w-2 h-2 text-green-800 fill-current" />
              </div>
            </div>
          </Link>
        </div>

        {/* Review and Sign */}
        <div className={`${isSupplementalActive ? 'bg-white -mx-4 px-4 py-4' : ''}`}>
          <div className="flex items-center space-x-3 p-3 -mx-4 px-4 mb-4">
            <Building2 className="w-5 h-5" style={{color: '#0E172B'}} />
            <span className="font-medium" style={{color: '#0E172B'}}>Review and Sign</span>
            <div className="ml-auto">
              <Circle className="w-2 h-2 text-red-800 fill-current" />
            </div>
          </div>

          {/* Nested items */}
          <div className="ml-8 space-y-3">
            {/* 1. Financial Institution */}
            <div>
              <div 
                className={`flex items-center space-x-3 p-2 text-sm -mx-12 px-12 cursor-pointer transition-colors ${
                  expandedSection === 'financial-institution' ? "bg-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setExpandedSection(expandedSection === 'financial-institution' ? null : 'financial-institution')}
              >
                <span className={`font-medium ${
                  expandedSection === 'financial-institution' ? 'text-black' : 'text-gray-500'
                }`}>1. Financial Institution</span>
                <div className="ml-auto">
                  <Circle className="w-2 h-2 text-red-800 fill-current" />
                </div>
              </div>
              
              {/* 1.1 and 1.2 sub-items - only show when expanded */}
              {expandedSection === 'financial-institution' && (
                <div className="ml-6 mt-2">
                  <Link href="/efile/financial-institution/setup" className="w-full" prefetch={true}>
                    <div className={`flex items-center space-x-3 py-1 -mx-16 px-16 cursor-pointer transition-colors ${
                      isActive("/efile/financial-institution/setup") ? 'bg-white' : 'hover:bg-gray-100'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        isActive("/efile/financial-institution/setup") ? '' : 'opacity-50'
                      }`} style={{backgroundColor: '#0E172B'}}></div>
                      <span className={`text-sm font-medium ${
                        isActive("/efile/financial-institution/setup") ? 'text-black' : 'text-gray-500'
                      }`}>1.1 Setup</span>
                    </div>
                  </Link>
                  {/* Connecting line */}
                  <div className="flex -mx-16 px-16">
                    <div className="w-0.5 h-4 ml-1.25" style={{backgroundColor: '#0E172B'}}></div>
                  </div>
                  <Link href="/efile/financial-institution/document-upload" className="w-full" prefetch={true}>
                    <div className={`flex items-center space-x-3 py-1 -mx-16 px-16 cursor-pointer transition-colors ${
                      isActive("/efile/financial-institution/document-upload") ? 'bg-white' : 'hover:bg-gray-100'
                    }`}>
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isActive("/efile/financial-institution/document-upload") 
                          ? 'border-black bg-black' 
                          : 'border-gray-500'
                      }`}></div>
                      <span className={`text-sm ${
                        isActive("/efile/financial-institution/document-upload") 
                          ? 'font-medium text-black' 
                          : 'text-gray-500'
                      }`}>1.2 Document Upload</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Charity / Non-Profit */}
            <div 
              className={`flex items-center space-x-3 p-2 text-sm -mx-12 px-12 cursor-pointer transition-colors ${
                expandedSection === 'charity-non-profit' ? "bg-white" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setExpandedSection('charity-non-profit')
                router.push('/efile/charity-non-profit')
              }}
            >
              <span className={`${
                expandedSection === 'charity-non-profit' ? 'text-black font-medium' : 'text-gray-500'
              }`}>2. Charity / Non-Profit</span>
              <div className="ml-auto">
                <Circle className="w-2 h-2 text-green-800 fill-current" />
              </div>
            </div>

            {/* 3. Government and Related Government Entities */}
            <div 
              className={`flex items-center space-x-3 p-2 text-sm -mx-12 px-12 cursor-pointer transition-colors ${
                expandedSection === 'government-entities' ? "bg-white" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setExpandedSection('government-entities')
                router.push('/efile/government-entities')
              }}
            >
              <span className={`${
                expandedSection === 'government-entities' ? 'text-black font-medium' : 'text-gray-500'
              }`}>3. Government and Related Government Entities</span>
              <div className="ml-auto">
                <Circle className="w-2 h-2 text-green-800 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}