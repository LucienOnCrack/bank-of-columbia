"use client"

import { Home, Grid3X3, ArrowLeftRight, BarChart3, User, HelpCircle, Bell, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardSidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <div className="w-20 flex flex-col items-center py-6 space-y-8 bg-slate-900">
      <div className="mb-8">
        <img src="/boc-logo-white.png" alt="Bank of Columbia" className="h-6 w-auto" />
      </div>

      <nav className="flex flex-col space-y-6 w-full">
        <Link href="/dashboard" className="w-full" prefetch={true}>
          <button
            className={`w-full p-3 transition-colors flex items-center justify-center ${
              isActive("/dashboard") ? "bg-white text-slate-900" : "text-gray-400 hover:text-white"
            }`}
          >
            <Home className="w-6 h-6" />
          </button>
        </Link>
        <Link href="/mortgages" className="w-full" prefetch={true}>
          <button
            className={`w-full p-3 transition-colors flex items-center justify-center ${
              isActive("/mortgages") ? "bg-white text-slate-900" : "text-gray-400 hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-6 h-6" />
          </button>
        </Link>
        <Link href="/documents" className="w-full" prefetch={true}>
          <button
            className={`w-full p-3 transition-colors flex items-center justify-center ${
              isActive("/documents") ? "bg-white text-slate-900" : "text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="w-6 h-6" />
          </button>
        </Link>
        <button className="w-full p-3 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
          <Grid3X3 className="w-6 h-6" />
        </button>
        <button className="w-full p-3 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
          <BarChart3 className="w-6 h-6" />
        </button>
        <button className="w-full p-3 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
          <User className="w-6 h-6" />
        </button>
        <button className="w-full p-3 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </button>
      </nav>

      <div className="flex-1 flex items-end w-full">
        <button className="w-full p-3 text-gray-400 hover:text-white transition-colors relative flex items-center justify-center">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </div>
  )
}
