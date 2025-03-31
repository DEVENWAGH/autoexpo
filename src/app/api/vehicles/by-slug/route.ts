import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandSlug = searchParams.get("brand");
    const modelSlug = searchParams.get("model");

    if (!brandSlug || !modelSlug) {
      return NextResponse.json(
        { message: "Brand and model parameters are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // There are multiple ways the URL might be formatted:
    // 1. "tata" for "Tata Motors"
    // 2. "tata-motors" for "Tata Motors"
    // So we need to try different combinations
    
    // Normalize slugs by replacing hyphens with spaces
    const brandWithSpaces = brandSlug.replace(/-/g, ' ');
    const modelWithSpaces = modelSlug.replace(/-/g, ' ');
    
    console.log(`Looking for brand: "${brandWithSpaces}", model: "${modelWithSpaces}"`);

    // Try different brand matching approaches
    let vehicle;
    
    // First attempt: Direct match with the full brand name
    vehicle = await findVehicleWithBrandAndModel(brandWithSpaces, modelWithSpaces);
    
    // Second attempt: If brand is a partial match (e.g., "tata" instead of "tata motors")
    if (!vehicle) {
      const allCars = await Car.find({});
      
      // Find cars whose brand contains the brand slug
      for (const car of allCars) {
        const brand = car.basicInfo?.brand?.toLowerCase() || '';
        const name = car.basicInfo?.name?.toLowerCase() || '';
        
        console.log(`Checking ${brand} / ${name}`);
        
        // Check if our search terms are contained in the brand and name
        if (brand.includes(brandWithSpaces.toLowerCase())) {
          if (name.toLowerCase().includes(modelWithSpaces.toLowerCase()) ||
              modelWithSpaces.toLowerCase().includes(name.toLowerCase())) {
            vehicle = car;
            break;
          }
        }
      }
    }

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("Error fetching vehicle by slug:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to find vehicle with given brand and model
async function findVehicleWithBrandAndModel(brand: string, model: string) {
  // Try exact match with case insensitivity
  const brandRegex = new RegExp(`^${brand}$`, "i");
  const modelRegex = new RegExp(`^${model}$`, "i");

  let vehicle = await Car.findOne({
    "basicInfo.brand": { $regex: brandRegex },
    "basicInfo.name": { $regex: modelRegex },
  });

  // If not found, try partial match
  if (!vehicle) {
    const partialBrandRegex = new RegExp(brand, "i");
    const partialModelRegex = new RegExp(model, "i");

    vehicle = await Car.findOne({
      "basicInfo.brand": { $regex: partialBrandRegex },
      "basicInfo.name": { $regex: partialModelRegex },
    });
  }

  return vehicle;
}
