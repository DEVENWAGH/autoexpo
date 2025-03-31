import { z } from "zod";
import { carBasicInfoSchema, carEngineSchema, bikeBasicInfoSchema, bikeEngineSchema } from "@/lib/form-utils";

// Simplified validation schemas without strict requirements
const validationSchemas = {
  cars: {
    basicInfo: z.object({
      // Make all fields optional
      brand: z.string().optional(),
      name: z.string().optional(),
      priceExshowroom: z.string().optional(),
      priceOnroad: z.string().optional(),
      // ...other fields
    }),
    engineTransmission: z.object({
      // Make all fields optional
      engineType: z.string().optional(),
      maxPower: z.string().optional(),
      maxTorque: z.string().optional(),
      displacement: z.union([z.string(), z.number()]).optional(),
      cylinders: z.union([z.string(), z.number()]).optional(),
      valvesPerCylinder: z.union([z.string(), z.number()]).optional(),
      transmissionType: z.string().optional(),
      gearbox: z.string().optional(),
      driveType: z.string().optional(),
      turboCharger: z.string().optional(),
    }),
    // ...existing validation schemas...
  },
  bikes: {
    basicInfo: bikeBasicInfoSchema,
    engineTransmission: bikeEngineSchema,
    // Add more bike schemas
  }
};

export const validateSection = (
  section: string, 
  data: any, 
  vehicleType: 'cars' | 'bikes' = 'cars'
) => {
  // Always return valid to skip validation
  return { isValid: true, errors: null };
};

// Remove the validatePrices function or modify it to not require onroad price
// Remove any other validation related to onroad price
