import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Common schemas for both car and bike
const commonBasicInfoSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Name is required"),
  priceExshowroom: z.string().min(1, "Ex-showroom price is required"),
  priceOnroad: z.string().min(1, "On-road price is required"),
  variant: z.string().optional(),
  launchYear: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// Car specific schemas
export const carBasicInfoSchema = commonBasicInfoSchema.extend({
  carType: z.string().optional(),
});

export const carEngineSchema = z.object({
  engineType: z.string().min(1, "Engine type is required"),
  displacement: z.string().min(1, "Displacement is required"),
  maxPower: z.string().min(1, "Maximum power is required"),
  maxTorque: z.string().min(1, "Maximum torque is required"),
  cylinders: z.string().optional(),
  valvesPerCylinder: z.string().optional(),
  transmissionType: z.string().optional(),
  gearbox: z.string().optional(),
  driveType: z.string().optional(),
});

// Bike specific schemas
export const bikeBasicInfoSchema = commonBasicInfoSchema.extend({
  bikeType: z.string().optional(),
});

export const bikeEngineSchema = z.object({
  engineType: z.string().min(1, "Engine type is required"),
  displacement: z.string().min(1, "Displacement is required"),
  maxPower: z.string().min(1, "Maximum power is required"),
  maxTorque: z.string().min(1, "Maximum torque is required"),
  coolingSystem: z.string().optional(),
  startingType: z.string().optional(),
  fuelSupply: z.string().optional(),
  clutchType: z.string().optional(),
});

// Helper function to create a form with section validation
export function useFormWithSections(schema: Record<string, z.ZodTypeAny>) {
  return useForm({
    mode: "onBlur",
    resolver: zodResolver(
      z.object(
        Object.entries(schema).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: value }),
          {}
        )
      )
    ),
  });
}

// Validate prices separately
export const validatePrices = (
  exShowroom?: string | number,
  onRoad?: string | number
) => {
  if (!exShowroom || !onRoad) return { isValid: true };
  
  const exNum = Number(exShowroom);
  const onNum = Number(onRoad);
  
  if (exNum >= onNum) {
    return {
      isValid: false,
      error: "Ex-showroom price must be less than on-road price",
    };
  }
  
  return { isValid: true };
};
