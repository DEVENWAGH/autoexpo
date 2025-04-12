import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";
import { Bike } from "@/models/Bike";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "cars";

    await dbConnect();

    let brands = [];
    
    if (type === "cars") {
      // Get all unique car brands from the database
      const result = await Car.aggregate([
        { $group: { _id: "$basicInfo.brand" } },
        { $sort: { _id: 1 } }, // Sort alphabetically
        { $project: { name: "$_id", _id: 0 } }
      ]);
      brands = result.filter(brand => brand.name); // Filter out null/undefined brands
    } else {
      // Get all unique bike brands from the database
      const result = await Bike.aggregate([
        { $group: { _id: "$basicInfo.brand" } },
        { $sort: { _id: 1 } }, // Sort alphabetically
        { $project: { name: "$_id", _id: 0 } }
      ]);
      brands = result.filter(brand => brand.name); // Filter out null/undefined brands
    }

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
