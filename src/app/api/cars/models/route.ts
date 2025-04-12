import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Extract brand parameter
    const searchParams = request.nextUrl.searchParams;
    const brands = searchParams.get("brands");
    
    if (!brands) {
      return NextResponse.json({ 
        success: false, 
        message: "Brands parameter is required" 
      }, { status: 400 });
    }
    
    const brandArray = brands.split(",");
    
    // Find models for the specified brands
    const cars = await Car.find({ 
      "basicInfo.brand": { $in: brandArray }
    }).select("basicInfo.name").lean();
    
    // Extract unique model names
    const modelSet = new Set<string>();
    cars.forEach((car) => {
      if (car.basicInfo?.name) {
        modelSet.add(car.basicInfo.name);
      }
    });
    
    const models = Array.from(modelSet);
    
    return NextResponse.json({
      success: true,
      models
    });
    
  } catch (error) {
    console.error("Error in car models API:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch car models" },
      { status: 500 }
    );
  }
}
