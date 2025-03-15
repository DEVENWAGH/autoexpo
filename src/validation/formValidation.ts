import { z } from "zod";

// Shared validation schemas for both car and bike forms
export const basicInfoSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Model name is required"),
  priceExshowroom: z.string().min(1, "Ex-showroom price is required"),
  priceOnroad: z.string().min(1, "On-road price is required"),
  variant: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

export const engineTransmissionSchema = z.object({
  engineType: z.string().min(1, "Engine type is required"),
  displacement: z.union([z.string().min(1), z.number()]).optional(),
  maxPower: z.string().min(1, "Max power is required"),
  maxTorque: z.string().min(1, "Max torque is required"),
});

export const dimensionsSchema = z.object({
  length: z.union([z.string(), z.number()]).optional(),
  width: z.union([z.string(), z.number()]).optional(),
  height: z.union([z.string(), z.number()]).optional(),
});

export const imagesSchema = z.object({
  // Only require main image, others are optional
  mainImages: z.array(z.string()).min(1, "Cover image is required"),
  // Make other image fields optional
  interiorImages: z.array(z.string()).optional(),
  exteriorImages: z.array(z.string()).optional(),
  colorImages: z.array(z.string()).optional(),
  galleryImages: z.array(z.string()).optional(),
});

export const fuelPerformanceSchema = z.object({
  fuelType: z.string().min(1, "Fuel type is required"),
  mileage: z.union([z.string(), z.number()]).optional(),
});

// Validate images section
export const validateImages = (mainImages: string[], otherImages: Record<string, any> = {}) => {
  const hasMainImage = mainImages && mainImages.length > 0;
  
  if (!hasMainImage) {
    return {
      isValid: false,
      error: "At least one main image is required"
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

// Cross-field validation for price
export const validatePrices = (exshowroom: string | number, onroad: string | number) => {
  // Skip validation if values are missing - the required field validation will handle this
  if (!exshowroom || !onroad) return { isValid: true };
  
  const ex = Number(exshowroom);
  const on = Number(onroad);
  
  if (isNaN(ex) || isNaN(on)) {
    return { 
      isValid: false, 
      error: "Please enter valid numbers for prices" 
    };
  }
  
  if (ex >= on) {
    return {
      isValid: false,
      error: "Ex-showroom price must be lower than On-road price"
    };
  }
  
  return { isValid: true };
};

// Utility function to validate a section against its schema
export const validateSection = (section: string, data: any) => {
  let schema;
  
  switch (section) {
    case "basicInfo":
      schema = basicInfoSchema;
      break;
    case "engineTransmission":
      schema = engineTransmissionSchema;
      break;
    case "dimensions":
    case "dimensionsCapacity":
    case "dimensionsAndCapacity":
      schema = dimensionsSchema;
      break;
    case "images":
      // For images, we need to validate the actual files, not just form data
      return { isValid: true, errors: {} }; // Images validated separately
    case "fuelPerformance":
      schema = fuelPerformanceSchema;
      break;
    default:
      // For sections without specific validation
      return { isValid: true, errors: {} };
  }
  
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { isValid: true, errors: {} };
    } else {
      return { 
        isValid: false, 
        errors: result.error.flatten().fieldErrors 
      };
    }
  } catch (error) {
    console.error(`Validation error in ${section}:`, error);
    return { isValid: false, errors: { "_error": ["Validation failed"] } };
  }
};
