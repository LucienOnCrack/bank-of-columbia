"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { getRobloxAuthUrl } from "@/lib/auth"

export default function LoginPage() {
  const handleRobloxLogin = () => {
    const oauthUrl = getRobloxAuthUrl();
    window.location.href = oauthUrl;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/boc-logo-white.png" alt="Bank of Columbia" className="h-8 w-auto" />
              <span className="text-xl font-medium text-gray-900">Bank of Columbia</span>
            </Link>
          </div>
        </div>
      </header>

      {/* FDIC Disclaimer */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start space-x-4">
            <div className="text-2xl font-bold text-gray-800">FDIC</div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">
                FDIC-Insured - Backed by the full faith and credit of the U.S. Government. Bank of Columbia, Salt Lake
                City Branch.
              </p>
              <p className="mt-1">
                FDIC insurance applies to deposits accounts only and does not apply to credit cards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-light text-gray-900 mb-12">Secure login</h2>
          </div>

          {/* Roblox Login Section */}
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-8">
                Bank of Columbia uses Roblox OAuth for secure authentication. 
                Click below to log in with your Roblox account.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleRobloxLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-normal py-4 px-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg"
              >
                Login with Roblox
              </Button>

              <div className="text-center">
                <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Back to Homepage
                </Link>
              </div>
            </div>



            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Your information is protected with 128-bit SSL encryption.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}