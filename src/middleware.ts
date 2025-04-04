import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl.clone();

  // Check if path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Only admin can access admin routes
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  // Check if path starts with /brands
  if (request.nextUrl.pathname.startsWith('/brands')) {
    // Skip protection for static brand logo assets
    if (request.nextUrl.pathname.match(/\/brands\/[^\/]+\.svg$/)) {
      return NextResponse.next();
    }
    
    // Only admin or Brands can access brand routes
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'Brands')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Check if the URL matches the old pattern /vehicle/:id
  if (url.pathname.startsWith('/vehicle/')) {
    const vehicleId = url.pathname.split('/')[2];
    if (vehicleId) {
      try {
        // Fetch vehicle details
        const apiUrl = `${url.origin}/api/vehicles/${vehicleId}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.vehicle) {
          const brand = data.vehicle.basicInfo.brand.toLowerCase();
          const model = data.vehicle.basicInfo.name.toLowerCase().replace(/\s+/g, '-');
          
          // Redirect to the SEO-friendly URL
          return NextResponse.redirect(new URL(`/${brand}/${model}`, request.url));
        }
      } catch (error) {
        console.error('Error in redirect middleware:', error);
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/brands/:path*', '/vehicle/:id*'],
};