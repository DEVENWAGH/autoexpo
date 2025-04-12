import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check if path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  // Check if path starts with /brands
  if (request.nextUrl.pathname.startsWith('/brands')) {
    if (request.nextUrl.pathname.match(/\/brands\/[^\/]+\.svg$/)) {
      return NextResponse.next();
    }
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

export const config = {
  matcher: ['/admin/:path*', '/brands/:path*', '/vehicle/:id*'],
};