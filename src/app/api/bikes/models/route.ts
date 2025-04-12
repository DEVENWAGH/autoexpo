import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Bike } from "@/models/Bike";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Extract brand parameter
    const searchParams = request.nextUrl.searchParams;
    const brands = searchParams.get("brands");
    const brand = searchParams.get("brand");
    
    if (!brands && !brand) {
      return NextResponse.json({ 
        success: false, 
        message: "Brand parameter is required" 
      }, { status: 400 });
    }
    
    let brandArray: string[] = [];
    if (brands) {
      brandArray = brands.split(",");
    } else if (brand) {
      brandArray = [brand];
    }
    
    // Find models for the specified brands
    const bikes = await Bike.find({ 
      "basicInfo.brand": { $in: brandArray }
    }).select("basicInfo.name").lean();
    
    // Extract unique model names
    const modelSet = new Set<string>();
    bikes.forEach((bike) => {
      if (bike.basicInfo?.name) {
        modelSet.add(bike.basicInfo.name);
      }
    });
    
    const models = Array.from(modelSet);
    
    return NextResponse.json({
      success: true,
      models
    });
    
  } catch (error) {
    console.error("Error in bike models API:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bike models" },
      { status: 500 }
    );
  }
}
