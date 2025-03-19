import { NextRequest, NextResponse } from 'next/server';
import { Car } from '@/models/Car';
import { Bike } from '@/models/Bike';
import { auth } from "@/auth";
import { dbConnect } from '@/lib/dbConnect';

// GET /api/vehicles/my-vehicles - Get vehicles for the current user
export async function GET(req: NextRequest) {
  try {
    // Update to use auth() from Next Auth v5
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Update userId access for Auth.js v5
    const userId = (session.user as any).id;
    
    const cars = await Car.find({ createdBy: userId }).sort({ createdAt: -1 });
    const bikes = await Bike.find({ createdBy: userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      cars,
      bikes
    });
    
  } catch (error) {
    console.error('API Error getting user vehicles:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get vehicles' },
      { status: 500 }
    );
  }
}
