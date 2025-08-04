"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { usePathname } from "next/navigation"

export default function NotificationsPage() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 flex">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-light text-white mb-4">Notifications</h1>
          <p className="text-xl text-gray-300">You have 3 new notifications</p>
        </div>
      </div>
    </div>
  )
}