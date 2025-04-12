import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check if path starts with /admin or /brands
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/brands')) {
    
    // Allow access to brand SVG files without authentication
    if (request.nextUrl.pathname.match(/\/brands\/[^\/]+\.svg$/)) {
      return NextResponse.next();
    }
    
    // Get the token and check user's role
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Allow access if user is admin or has Brands role
    if (token && (token.role === 'admin' || token.role === 'Brands')) {
      return NextResponse.next();
    }
    
    // If no token or insufficient permissions, redirect to unauthorized
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Check if the URL matches the old pattern /vehicle/:id
  if (url.pathname.startsWith('/vehicle/')) {
    const vehicleId = url.pathname.split('/')[2];
    if (vehicleId) {
      try {
        const apiUrl = `${url.origin}/api/vehicles/${vehicleId}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.vehicle) {
          const brand = data.vehicle.basicInfo.brand.toLowerCase();
          const model = data.vehicle.basicInfo.name.toLowerCase().replace(/\s+/g, '-');
          return NextResponse.redirect(new URL(`/${brand}/${model}`, request.url));
        }
      } catch (error) {
        console.error('Error in redirect middleware:', error);
      }
    }
  }

  return NextResponse.next();
}

// Match only these paths
export const config = {
  matcher: [
    '/admin/:path*', 
    '/brands/:path*',
    '/vehicle/:path*'
  ]
};