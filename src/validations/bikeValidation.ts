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
});

// Mileage & Performance validation
export const mileagePerformanceSchema = z.object({
  overallMileage: z.union([z.string().min(1, "Mileage is required"), z.number().positive()]),
  topSpeed: z.union([z.string(), z.number()]).optional(),
});

// Dimensions & Capacity validation
export const dimensionsCapacitySchema = z.object({
  fuelCapacity: z.union([z.string().min(1, "Fuel capacity is required"), z.number().positive()]),
  saddleHeight: z.union([z.string(), z.number()]).optional(),
  groundClearance: z.union([z.string(), z.number()]).optional(),
  wheelbase: z.union([z.string(), z.number()]).optional(),
});

// Validate section function
export const validateBikeSection = (section: string, data: any) => {
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
        
      case "mileageAndPerformance":
        return {
          isValid: mileagePerformanceSchema.safeParse(data).success,
          errors: mileagePerformanceSchema.safeParse(data).success ? {} :
                  mileagePerformanceSchema.safeParse(data).error.flatten().fieldErrors
        };
        
      case "dimensionsAndCapacity":
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

// Complete bike form validation schema
export const bikeValidationSchema = z.object({
  basicInfo: basicInfoSchema,
  engineTransmission: engineTransmissionSchema.optional(),
  mileageAndPerformance: mileagePerformanceSchema.optional(),
  dimensionsAndCapacity: dimensionsCapacitySchema.optional(),
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
