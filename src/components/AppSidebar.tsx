"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Receipt,
  CreditCard
} from "lucide-react"

import { useAuth } from "@/components/AuthProvider"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"


import Link from "next/link"
import { usePathname } from "next/navigation"

// Navigation items for different user roles
const navigationItems = {
  user: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ],
  employee: [
    {
      title: "Dashboard", 
      url: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Property Manager",
      url: "/employee/property-manager", 
      icon: Building2,
    },
    {
      title: "Mortgages",
      url: "/employee/mortgages",
      icon: Receipt,
    },
    {
      title: "Transactions",
      url: "/employee/transactions",
      icon: CreditCard,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Property Manager",
      url: "/employee/property-manager",
      icon: Building2,
    },
    {
      title: "Mortgages",
      url: "/employee/mortgages",
      icon: Receipt,
    },
    {
      title: "Transactions",
      url: "/employee/transactions",
      icon: CreditCard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const userNavItems = navigationItems[user.role] || navigationItems.user

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                  <DollarSign className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Bank of Columbia</span>
                  <span className="truncate text-xs">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>


      <SidebarRail />
    </Sidebar>
  )
} 