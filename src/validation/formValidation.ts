import { z } from "zod";
import { carBasicInfoSchema, carEngineSchema, bikeBasicInfoSchema, bikeEngineSchema } from "@/lib/form-utils";

// Validation schemas for different form sections
const validationSchemas: Record<string, any> = {
  cars: {
    basicInfo: carBasicInfoSchema,
    engineTransmission: carEngineSchema,
    // Add more car schemas
  },
  bikes: {
    basicInfo: bikeBasicInfoSchema,
    engineTransmission: bikeEngineSchema,
    // Add more bike schemas
  }
};

// Validate a section based on vehicle type and section name
export const validateSection = (
  section: string, 
  data: any, 
  vehicleType: 'cars' | 'bikes' = 'cars'
) => {
  const schema = validationSchemas[vehicleType]?.[section];
  
  if (!schema) {
    // For sections without schema, perform basic required field validation
    if (section === "basicInfo") {
      const errors: Record<string, string[]> = {};
      const { brand, name, priceExshowroom, priceOnroad } = data || {};
      
      if (!brand) errors.brand = ["Brand is required"];
      if (!name) errors.name = ["Name is required"];
      if (!priceExshowroom) errors.priceExshowroom = ["Ex-showroom price is required"];
      if (!priceOnroad) errors.priceOnroad = ["On-road price is required"];
      
      return { 
        isValid: Object.keys(errors).length === 0,
        errors: Object.keys(errors).length > 0 ? errors : null 
      };
    }
    return { isValid: true, errors: null }; // No schema, consider valid
  }
  
  try {
    schema.parse(data);
    return { isValid: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce((acc: Record<string, string[]>, curr) => {
        const field = curr.path.join('.');
        if (!acc[field]) acc[field] = [];
        acc[field].push(curr.message);
        return acc;
      }, {});
      
      return { isValid: false, errors: fieldErrors };
    }
    return { isValid: false, errors: { _form: ['Validation failed'] } };
  }
};

// Enhance price validation with more clear error messages
export const validatePrices = (
  exShowroom?: string | number,
  onRoad?: string | number
) => {
  if (!exShowroom || !onRoad) return { isValid: true };
  
  const exNum = Number(exShowroom);
  const onNum = Number(onRoad);
  
  if (isNaN(exNum) || isNaN(onNum)) {
    return {
      isValid: false,
      error: "Please enter valid price numbers",
    };
  }
  
  if (exNum >= onNum) {
    return {
      isValid: false,
      error: "Ex-showroom price must be less than on-road price",
    };
  }
  
  return { isValid: true };
};
