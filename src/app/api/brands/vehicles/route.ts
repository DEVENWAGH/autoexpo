import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";
import { Bike } from "@/models/Bike";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const searchParams = new URL(request.url).searchParams;
    const type = searchParams.get('type');
    
    if (!type || (type !== 'cars' && type !== 'bikes')) {
      return NextResponse.json({ error: "Invalid vehicle type" }, { status: 400 });
    }

    const data = await request.json();
    
    // Connect to database
    await dbConnect();
    
    // Add the user ID as creator
    data.createdBy = session.user.id;
    
    // Add missing required fields with defaults if they don't exist
    if (!data.description) {
      data.description = `${data.name} by ${data.brand}`;
    }
    
    // Choose the right model based on vehicle type
    const Model = type === 'cars' ? Car : Bike;
    
    // Create the vehicle
    const vehicle = new Model(data);
    await vehicle.save();
    
    return NextResponse.json({ 
      success: true, 
      message: "Vehicle created successfully",
      id: vehicle._id
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating vehicle:", error);
    
    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return NextResponse.json({ 
        error: "Validation error", 
        validationErrors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create vehicle" 
    }, { status: 500 });
  }
}
