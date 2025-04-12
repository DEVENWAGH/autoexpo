import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";
import { Bike } from "@/models/Bike";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const type = searchParams.get("type") || "cars";

    if (!brand) {
      return NextResponse.json({ 
        error: "Brand parameter is required" 
      }, { status: 400 });
    }

    await dbConnect();

    let models = [];
    
    if (type === "cars") {
      // Get all unique models for the specified car brand
      const result = await Car.aggregate([
        { $match: { "basicInfo.brand": brand } },
        { $group: { _id: "$basicInfo.name" } },
        { $sort: { _id: 1 } }, // Sort alphabetically
        { $project: { _id: 0, name: "$_id" } }
      ]);
      models = result.map(item => item.name).filter(Boolean);
    } else {
      // Get all unique models for the specified bike brand
      const result = await Bike.aggregate([
        { $match: { "basicInfo.brand": brand } },
        { $group: { _id: "$basicInfo.name" } },
        { $sort: { _id: 1 } }, // Sort alphabetically
        { $project: { _id: 0, name: "$_id" } }
      ]);
      models = result.map(item => item.name).filter(Boolean);
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}
