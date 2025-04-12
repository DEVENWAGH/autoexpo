import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Car } from "@/models/Car";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Build the filter query
    const query: any = {};
    
    // Handle brand filtering
    const brands = searchParams.get("brands");
    if (brands) {
      const brandArray = brands.split(",");
      query["basicInfo.brand"] = { $in: brandArray };
    }
    
    // Handle model filtering
    const models = searchParams.get("models");
    if (models) {
      const modelArray = models.split(",");
      query["basicInfo.name"] = { $in: modelArray };
    }
    
    // Handle car type filtering
    const types = searchParams.get("types");
    if (types) {
      const typeArray = types.split(",");
      query["basicInfo.carType"] = { $in: typeArray };
    }
    
    // Handle fuel type filtering
    const fuelTypes = searchParams.get("fuelTypes");
    if (fuelTypes) {
      const fuelTypeArray = fuelTypes.split(",");
      query["fuelPerformance.fuelType"] = { $in: fuelTypeArray };
    }
    
    // Handle transmission type filtering
    const transmissionTypes = searchParams.get("transmissionTypes");
    if (transmissionTypes) {
      const transmissionTypeArray = transmissionTypes.split(",");
      query["engineTransmission.transmissionType"] = { $in: transmissionTypeArray };
    }
    
    // Handle price range filtering
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    
    if (minPrice || maxPrice) {
      query["basicInfo.priceExshowroom"] = {};
      
      if (minPrice) {
        query["basicInfo.priceExshowroom"].$gte = parseInt(minPrice);
      }
      
      if (maxPrice && maxPrice !== "9007199254740991") { // Don't filter if maxPrice is MAX_SAFE_INTEGER
        query["basicInfo.priceExshowroom"].$lte = parseInt(maxPrice);
      }
    }
    
    // Determine sorting
    let sortOption = {};
    const sortBy = searchParams.get("sortBy") || "price-low";
    
    switch (sortBy) {
      case "price-low":
        sortOption = { "basicInfo.priceExshowroom": 1 };
        break;
      case "price-high":
        sortOption = { "basicInfo.priceExshowroom": -1 };
        break;
      case "newest":
        sortOption = { "basicInfo.launchYear": -1 };
        break;
      case "mileage":
        sortOption = { "fuelPerformance.mileage": -1 };
        break;
      default:
        sortOption = { "basicInfo.priceExshowroom": 1 };
    }
    
    // Fetch cars based on filters
    const cars = await Car.find(query).sort(sortOption).limit(100);
    
    // Get distinct values for filter options
    const distinctBrands = await Car.distinct("basicInfo.brand");
    const distinctTypes = await Car.distinct("basicInfo.carType");
    const distinctFuelTypes = await Car.distinct("fuelPerformance.fuelType");
    const distinctTransmissionTypes = await Car.distinct("engineTransmission.transmissionType");
    
    return NextResponse.json({
      success: true,
      cars,
      filters: {
        brands: distinctBrands,
        types: distinctTypes,
        fuelTypes: distinctFuelTypes.filter(Boolean),
        transmissionTypes: distinctTransmissionTypes.filter(Boolean),
      }
    });
    
  } catch (error) {
    console.error("Error in car filter API:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}
