'use client';

import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { DollarSign, LogOut, User, Shield, Building, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render navbar on employee pages - they have their own header in the sidebar layout
  const isEmployeePage = pathname.startsWith('/employee');
  if (isEmployeePage) {
    return null;
  }

  // Get page title for different pages
  const getPageTitle = () => {
    if (!isMounted) return null;
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/admin') return 'Admin Panel';
    return null;
  };

  const pageTitle = getPageTitle();

  return (
    <nav className="border-b">
      <div className={`w-full h-16 flex items-center justify-between transition-all duration-200 px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center space-x-8">
          {!pageTitle && (
            <Link href="/" className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6" />
              <span className="font-bold text-lg">Bank of Columbia</span>
            </Link>
          )}
          
          {pageTitle && user && (
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6" />
                <span className="font-bold text-lg">Bank of Columbia</span>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
              </div>
            </div>
          )}

          {pageTitle && !user && (
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6" />
                <span className="font-bold text-lg">Bank of Columbia</span>
              </Link>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
              </div>
            </div>
          )}
        </div>

        {/* Public Navigation */}
        <div className="flex items-center space-x-6">
          {/* Properties link - always visible */}
          <Link 
            href="/properties" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/properties' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </div>
          </Link>

          {/* User Menu */}
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden">
                  {user.profile_picture ? (
                    <>
                      {console.log('Profile picture URL:', user.profile_picture)}
                      <img
                        src={user.profile_picture}
                        alt={`${user.roblox_name} avatar`}
                        className="absolute inset-0 h-full w-full rounded-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', user.profile_picture);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => console.log('Image loaded successfully')}
                      />
                    </>
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

          {/* Login button for guests */}
          {!loading && !user && (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 