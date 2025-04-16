import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require specific roles
const ADMIN_ROUTES = ['/admin'];
const MIXED_ACCESS_ROUTES = ['/brands/vehicles'];
// Additional protected routes that admin should have access to
const PROTECTED_ROUTES = ['/bookmarks', '/calculator'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = request.nextUrl.pathname;
  
  // Better handling for SVG paths with cleaner regex patterns
  if (path.includes('/brands/') && path.endsWith('.svg')) {
    // Case 1: Double path pattern like /brands/brands/logo.svg.svg
    if (path.match(/\/brands\/brands\/[^\/]+\.svg\.svg$/)) {
      const brandName = path.split('/').pop()?.replace('.svg.svg', '');
      if (brandName) {
        return NextResponse.redirect(
          new URL(`/brands/${brandName}.svg`, request.url)
        );
      }
    }
    
    // Case 2: Double brands directory but single extension /brands/brands/logo.svg
    if (path.match(/\/brands\/brands\/[^\/]+\.svg$/)) {
      const filename = path.split('/').pop();
      if (filename) {
        return NextResponse.redirect(
          new URL(`/brands/${filename}`, request.url)
        );
      }
    }
    
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isAdminRoute = ADMIN_ROUTES.some(route => path.startsWith(route));
  const isMixedAccessRoute = MIXED_ACCESS_ROUTES.some(route => path.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));
  
  // If it's not a protected route, allow access
  if (!isAdminRoute && !isMixedAccessRoute && !isProtectedRoute) {
    return NextResponse.next();
  }
  
  // Get the token and check user's role
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Enhanced debug logging (this will appear in server logs)
  console.log(`Path: ${path}, Token exists: ${!!token}, Role: ${token?.role}`);
  console.log(`JWT token data:`, JSON.stringify(token, null, 2));
  
  // First, check if the user is an admin - admins can access all protected routes
  if (token && token.role === 'admin') {
    console.log("Admin access granted to:", path);
    return NextResponse.next();
  }
  
  // For non-admin users, check specific role requirements
  if (token) {
    // Mixed access routes allow 'Brands' role
    if (isMixedAccessRoute && token.role === 'Brands') {
      console.log("Mixed route access granted to:", path);
      return NextResponse.next();
    }
    
    // Additional protected routes - check specific permissions as needed
    if (isProtectedRoute) {
      // Add any specific role checks for protected routes if needed
      // For now, just check if authenticated
      return NextResponse.next();
    }
    
    console.log("Access denied - insufficient permissions. User role:", token.role);
  } else {
    console.log("Access denied - no token found");
  }
  
  // If no token or insufficient permissions, redirect to unauthorized
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

// Add matching config for the middleware
export const config = {
  matcher: ['/admin/:path*', '/brands/:path*', '/bookmarks/:path*', '/calculator/:path*']
};