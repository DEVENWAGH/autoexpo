import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

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

// Only run middleware on vehicle routes
export const config = {
  matcher: ['/vehicle/:id*'],
};