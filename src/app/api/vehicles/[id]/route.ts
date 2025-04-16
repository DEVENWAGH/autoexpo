import { NextRequest, NextResponse } from 'next/server';
import { Car } from '@/models/Car';
import { Bike } from '@/models/Bike';
import { auth } from "@/auth";
import { dbConnect } from '@/lib/dbConnect';

// GET /api/vehicles/[id] - Get a vehicle by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    await dbConnect();

    const vehicle = await Car.findById(id);

    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/vehicles/[id] - Delete a vehicle by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Update to use auth() from Next Auth v5
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await dbConnect();
    
    const id = params.id;
    
    // Check car first
    let vehicle = await Car.findById(id);
    let isCarModel = true;
    
    // If not a car, try bike
    if (!vehicle) {
      vehicle = await Bike.findById(id);
      isCarModel = false;
    }
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    // Update userId access for Auth.js v5
    if (
      vehicle.createdBy.toString() !== (session.user as any).id && 
      (session.user as any).role !== 'admin'
    ) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    
    // Delete the vehicle
    if (isCarModel) {
      await Car.findByIdAndDelete(id);
    } else {
      await Bike.findByIdAndDelete(id);
    }
    
    return NextResponse.json({ 
      message: 'Vehicle deleted successfully' 
    });
    
  } catch (error) {
    console.error('API Error deleting vehicle:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete vehicle' }, 
      { status: 500 }
    );
  }
}
