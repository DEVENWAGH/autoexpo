import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Bike } from "@/models/Bike";

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

    // Handle single brand filtering (for backward compatibility)
    const brand = searchParams.get("brand");
    if (brand && !brands) {
      query["basicInfo.brand"] = brand;
    }
    
    // Handle model filtering
    const models = searchParams.get("models");
    if (models) {
      const modelArray = models.split(",");
      query["basicInfo.name"] = { $in: modelArray };
    }

    // Handle single model filtering (for backward compatibility)
    const model = searchParams.get("model");
    if (model && !models) {
      query["basicInfo.name"] = model;
    }
    
    // Handle bike type filtering
    const types = searchParams.get("types");
    if (types) {
      const typeArray = types.split(",");
      query["basicInfo.bikeType"] = { $in: typeArray };
    }

    // Handle single type filtering (for backward compatibility)
    const type = searchParams.get("type");
    if (type && !types) {
      query["basicInfo.bikeType"] = type;
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

    // Handle budget parameter
    const budget = searchParams.get("budget");
    if (budget) {
      // Parse budget range
      if (budget.includes("Under")) {
        const maxValue = parseInt(budget.match(/\d+/)?.[0] || "1") * 100000;
        query["basicInfo.priceExshowroom"] = { $lte: maxValue };
      } else if (budget.includes("Above")) {
        const minValue = parseInt(budget.match(/\d+/)?.[0] || "5") * 100000;
        query["basicInfo.priceExshowroom"] = { $gte: minValue };
      } else if (budget.includes("-")) {
        const values = budget.match(/\d+/g) || ["1", "2"];
        const minValue = parseInt(values[0]) * 100000;
        const maxValue = parseInt(values[1]) * 100000;
        query["basicInfo.priceExshowroom"] = { $gte: minValue, $lte: maxValue };
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
        sortOption = { "mileageAndPerformance.overallMileage": -1 };
        break;
      default:
        sortOption = { "basicInfo.priceExshowroom": 1 };
    }
    
    // Fetch bikes based on filters
    const bikes = await Bike.find(query).sort(sortOption).limit(100);
    
    // Get distinct values for filter options
    const distinctBrands = await Bike.distinct("basicInfo.brand");
    const distinctTypes = await Bike.distinct("basicInfo.bikeType");
    const distinctEngineTypes = await Bike.distinct("engineTransmission.engineType");
    
    return NextResponse.json({
      success: true,
      bikes,
      filters: {
        brands: distinctBrands,
        types: distinctTypes.filter(Boolean),
        engineTypes: distinctEngineTypes.filter(Boolean)
      }
    });
    
  } catch (error) {
    console.error("Error in bike filter API:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bikes" },
      { status: 500 }
    );
  }
}
