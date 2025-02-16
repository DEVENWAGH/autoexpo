import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";
import { Bike } from "@/models/Bike";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');
    const data = await req.json();

    if (!type || (type !== 'cars' && type !== 'bikes')) {
      return NextResponse.json(
        { error: 'Invalid vehicle type' },
        { status: 400 }
      );
    }

    const Model = type === 'cars' ? Car : Bike;
    
    // Add error handling for missing required fields
    if (!data.name || !data.brand || !data.images?.main) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vehicle = await Model.create({
      ...data,
      createdBy: session.user.id
    });

    return NextResponse.json({
      success: true,
      data: vehicle
    });

  } catch (error) {
    console.error('Vehicle creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'cars';
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const Model = type === 'cars' ? Car : Bike;
    
    const vehicles = await Model.find({
      createdBy: session.user.id
    }).sort({ createdAt: -1 });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
