import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require specific roles
const ADMIN_ROUTES = ['/admin'];
const MIXED_ACCESS_ROUTES = ['/brands/vehicles'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;
  
  // Allow access to brand SVG files without authentication
  if (path.match(/\/brands\/[^\/]+\.svg$/)) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isAdminRoute = ADMIN_ROUTES.some(route => path.startsWith(route));
  const isMixedAccessRoute = MIXED_ACCESS_ROUTES.some(route => path.startsWith(route));
  
  // If it's not a protected route, allow access
  if (!isAdminRoute && !isMixedAccessRoute) {
    return NextResponse.next();
  }
  
  // Get the token and check user's role
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Debug logging (this will appear in server logs)
  console.log(`Path: ${path}, Token exists: ${!!token}, Role: ${token?.role}`);
  
  // Allow access based on route type and role
  if (token) {
    // Admin routes require 'admin' role
    if (isAdminRoute && token.role === 'admin') {
      return NextResponse.next();
    }
    
    // Mixed access routes allow 'admin' or 'Brands' roles
    if (isMixedAccessRoute && (token.role === 'admin' || token.role === 'Brands')) {
      return NextResponse.next();
    }
  }
  
  // If no token or insufficient permissions, redirect to unauthorized
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

// Add matching config for the middleware
export const config = {
  matcher: ['/admin/:path*', '/brands/:path*']
};