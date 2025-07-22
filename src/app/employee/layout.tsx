'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, DollarSign, Building, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appUser: user, signOut } = useAuth();
  const pathname = usePathname();

  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname === '/employee/dashboard') return 'Dashboard';
    if (pathname === '/employee/property-manager') return 'Property Manager';
    if (pathname === '/employee/mortgages') return 'Mortgages';
    if (pathname === '/employee/transactions') return 'Transactions';
    if (pathname === '/employee/legacy') return 'Legacy Panel';
    return 'Employee Portal';
  };

  const pageTitle = getPageTitle();

  return (
    <ProtectedRoute requiredRole="employee">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header positioned correctly within sidebar layout */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
              {user && (
                <p className="text-xs text-muted-foreground">Welcome back, {user.roblox_name}</p>
              )}
            </div>
            
            {/* Profile Picture Dropdown - matching global navbar positioning */}
            {user && (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden">
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
                        <User className="h-4 w-4" />
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
                  
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>User Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  
                  <Link href="/employee/dashboard">
                    <DropdownMenuItem>
                      <Building className="mr-2 h-4 w-4" />
                      <span>Employee Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
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
              </div>
            )}
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
} 