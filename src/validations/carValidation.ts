import { z } from "zod";

// Basic Info validation
export const basicInfoSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Model name is required"), 
  priceExshowroom: z.string().min(1, "Ex-showroom price is required"),
  priceOnroad: z.string().min(1, "On-road price is required"),
  variant: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// Engine & Transmission validation
export const engineTransmissionSchema = z.object({
  engineType: z.string().min(1, "Engine type is required"),
  displacement: z.union([z.string().min(1, "Displacement is required"), z.number().positive("Displacement must be positive")]),
  maxPower: z.string().min(1, "Max power is required"),
  maxTorque: z.string().min(1, "Max torque is required"),
  cylinders: z.union([z.string(), z.number()]).optional(),
  valvesPerCylinder: z.union([z.string(), z.number()]).optional(),
  transmissionType: z.string().optional(),
  gearbox: z.string().optional(),
});

// Fuel & Performance validation
export const fuelPerformanceSchema = z.object({
  fuelType: z.string().min(1, "Fuel type is required"),
  fuelTankCapacity: z.union([z.string().min(1, "Fuel capacity is required"), z.number().positive()]),
  mileage: z.string().optional(),
});

// Dimensions & Capacity validation
export const dimensionsCapacitySchema = z.object({
  length: z.union([z.string().min(1, "Length is required"), z.number().positive()]),
  width: z.union([z.string().min(1, "Width is required"), z.number().positive()]),
  height: z.union([z.string().min(1, "Height is required"), z.number().positive()]),
  seatingCapacity: z.union([z.string(), z.number()]).optional(),
  groundClearance: z.union([z.string(), z.number()]).optional(),
  wheelBase: z.union([z.string(), z.number()]).optional(),
});

// Validate section function
export const validateCarSection = (section: string, data: any) => {
  try {
    switch (section) {
      case "basicInfo":
        return {
          isValid: basicInfoSchema.safeParse(data).success,
          errors: basicInfoSchema.safeParse(data).success ? {} : 
                  basicInfoSchema.safeParse(data).error.flatten().fieldErrors
        };
      
      case "engineTransmission":
        return {
          isValid: engineTransmissionSchema.safeParse(data).success,
          errors: engineTransmissionSchema.safeParse(data).success ? {} :
                  engineTransmissionSchema.safeParse(data).error.flatten().fieldErrors
        };
        
      case "fuelPerformance":
        return {
          isValid: fuelPerformanceSchema.safeParse(data).success,
          errors: fuelPerformanceSchema.safeParse(data).success ? {} :
                  fuelPerformanceSchema.safeParse(data).error.flatten().fieldErrors
        };
        
      case "dimensionsCapacity":
        return {
          isValid: dimensionsCapacitySchema.safeParse(data).success,
          errors: dimensionsCapacitySchema.safeParse(data).success ? {} :
                  dimensionsCapacitySchema.safeParse(data).error.flatten().fieldErrors
        };
        
      // For sections that don't need validation (like images)
      case "images":
        return { isValid: true, errors: {} };
        
      // For sections with optional validation
      default:
        return { isValid: true, errors: {} };
    }
  } catch (error) {
    return { isValid: false, errors: { _errors: ["Validation error"] } };
  }
};

// Complete car form validation schema
export const carValidationSchema = z.object({
  basicInfo: basicInfoSchema,
  engineTransmission: engineTransmissionSchema.optional(),
  fuelPerformance: fuelPerformanceSchema.optional(),
  dimensionsCapacity: dimensionsCapacitySchema.optional(),
}).refine(data => {
  // Cross-field validation for prices
  if (data.basicInfo) {
    const ex = Number(data.basicInfo.priceExshowroom);
    const on = Number(data.basicInfo.priceOnroad);
    return ex < on;
  }
  return true;
}, {
  message: "Ex-showroom price must be lower than On-road price",
  path: ["basicInfo", "priceExshowroom"],
});
