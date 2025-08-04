import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/employee',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

// Define employee+ routes (employee and admin)
const employeeRoutes = [
  '/employee',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/privacy' ||
    pathname === '/tos' ||
    pathname === '/properties' ||
    pathname.startsWith('/auth/')
  ) {
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get user from session
  const sessionData = getCurrentUserFromRequest(request);

  // Redirect to home if not authenticated
  if (!sessionData) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Check admin-only routes
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isAdminRoute && sessionData.role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Check employee+ routes
  const isEmployeeRoute = employeeRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isEmployeeRoute && !['employee', 'admin'].includes(sessionData.role)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};