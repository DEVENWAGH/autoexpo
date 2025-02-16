import { NextResponse } from "next/server";
import { Car } from "@/models/Car";
import { Bike } from "@/models/Bike";
import { dbConnect } from "@/lib/dbConnect";
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const type = new URL(request.url).searchParams.get('type');
    
    // Validate vehicle type
    if (!type || !['cars', 'bikes'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid vehicle type" },
        { status: 400 }
      );
    }

    // Validate required image arrays
    if (type === 'cars') {
      if (!data.mainImages?.length) {
        return NextResponse.json(
          { error: "At least one main image is required" },
          { status: 400 }
        );
      }
      if (!data.interiorImages?.length) {
        return NextResponse.json(
          { error: "At least one interior image is required" },
          { status: 400 }
        );
      }
      if (!data.exteriorImages?.length) {
        return NextResponse.json(
          { error: "At least one exterior image is required" },
          { status: 400 }
        );
      }
    } else {
      if (!data.mainImages?.length) {
        return NextResponse.json(
          { error: "At least one main image is required" },
          { status: 400 }
        );
      }
      if (!data.galleryImages?.length) {
        return NextResponse.json(
          { error: "At least one gallery image is required" },
          { status: 400 }
        );
      }
    }

    // Create vehicle with appropriate model
    const Model = type === 'cars' ? Car : Bike;
    const vehicle = await Model.create({
      ...data,
      // Add user ID when auth is implemented
      createdBy: '65f2d6169ced5366aab6ab09' // Temporary: Replace with actual user ID
    });

    return NextResponse.json({
      success: true,
      vehicle
    });

  } catch (error) {
    console.error("Vehicle creation error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create vehicle",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const type = new URL(request.url).searchParams.get('type');
    
    let vehicles;
    if (type === 'cars') {
      vehicles = await Car.find().sort({ createdAt: -1 });
    } else if (type === 'bikes') {
      vehicles = await Bike.find().sort({ createdAt: -1 });
    } else {
      // If no type specified, get both cars and bikes
      const [cars, bikes] = await Promise.all([
        Car.find().sort({ createdAt: -1 }),
        Bike.find().sort({ createdAt: -1 })
      ]);
      vehicles = [...cars, ...bikes].sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
    
    return NextResponse.json({
      success: true,
      vehicles
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch vehicles",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
