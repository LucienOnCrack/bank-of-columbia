'use client';

import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { DollarSign, LogOut, User, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const { user, loading, signOut } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'employee': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'employee': return <Settings className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6" />
          <span className="font-bold text-lg">Bank of Columbia</span>
        </Link>
        
        {!loading && user && (
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              {(user.role === 'employee' || user.role === 'admin') && (
                <Link 
                  href="/employee" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Employee Panel
                </Link>
              )}
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  {user.profile_picture ? (
                    <Image
                      src={user.profile_picture}
                      alt={`${user.roblox_name}'s avatar`}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
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
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getRoleColor(user.role)} text-white text-xs`}
                      >
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </Badge>
                      <p className="text-xs leading-none text-muted-foreground">
                        ${user.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
} 