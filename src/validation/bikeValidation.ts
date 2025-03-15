import { z } from "zod";

export const bikeValidationSchema = z.object({
  basicInfo: z.object({
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Model name is required"),
    priceExshowroom: z.string().min(1, "Ex-showroom price is required"),
    priceOnroad: z.string().min(1, "On-road price is required"),
    variant: z.string().optional(),
    pros: z.string().optional(),
    cons: z.string().optional(),
  }),
  
  engineTransmission: z.object({
    engineType: z.string().min(1, "Engine type is required"),
    displacement: z.union([z.string().min(1), z.number()]).optional(),
    maxPower: z.string().min(1, "Max power is required"),
    maxTorque: z.string().min(1, "Max torque is required"),
  }).optional(),
  
  fuelPerformance: z.object({
    fuelType: z.string().min(1, "Fuel type is required"),
    // Other optional fields
  }).optional(),
  
  // Add validation for other critical sections as needed
}).refine(data => {
  if (data.basicInfo) {
    const ex = Number(data.basicInfo.priceExshowroom);
    const on = Number(data.basicInfo.priceOnroad);
    return ex < on;
  }
  return true;
}, {
  message: "Ex-showroom price must be lower than On-road price",
  path: ["basicInfo", "priceExshowroom"]
});
