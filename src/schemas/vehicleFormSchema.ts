import { z } from "zod";

// Basic info schema (common for both car and bike)
export const basicInfoSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Name is required"),
  variantName: z.string().optional(),
  variant: z.string().default("Base"),
  carType: z.string().optional(), // For cars only
  bikeType: z.string().optional(), // For bikes only
  priceExshowroom: z.string().min(1, "Ex-showroom price is required"),
  priceOnroad: z.string().min(1, "On-road price is required"),
  launchYear: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// Car-specific schemas
export const engineTransmissionSchema = z.object({
  engineType: z.string().min(1, "Engine type is required"),
  displacement: z.string().optional(),
  maxPower: z.string().min(1, "Maximum power is required"),
  maxTorque: z.string().min(1, "Maximum torque is required"),
  cylinders: z.string().optional(),
  valvesPerCylinder: z.string().optional(),
  transmissionType: z.string().optional(),
  gearbox: z.string().optional(),
  driveType: z.string().optional(),
  turboCharger: z.string().optional(),
  coolingSystem: z.string().optional(), // For bikes
  startingType: z.string().optional(), // For bikes
  fuelSupply: z.string().optional(), // For bikes
  clutchType: z.string().optional(), // For bikes
});

// Performance and fuel schema
export const fuelPerformanceSchema = z.object({
  fuelType: z.string().min(1, "Fuel type is required"),
  fuelTankCapacity: z.string().optional(),
  mileage: z.string().optional(),
  highwayMileage: z.string().optional(),
  topSpeed: z.string().optional(),
  acceleration: z.string().optional(),
  emissionNorm: z.string().optional(),
  // Electric vehicle specific fields
  electricRange: z.string().optional(),
  batteryCapacity: z.string().optional(),
  chargingTimeDC: z.string().optional(),
  chargingTimeAC: z.string().optional(),
  chargingPort: z.string().optional(),
  chargingOptions: z.string().optional(),
  regenerativeBraking: z.string().optional(),
  regenerativeBrakingLevels: z.string().optional().or(z.number().optional()),
});

// Other schemas...
export const comfortConvenienceSchema = z.object({
  powerSteering: z.boolean().optional().default(false),
  airConditioner: z.boolean().optional().default(false),
  heater: z.boolean().optional().default(false),
  adjustableSteering: z.boolean().optional().default(false),
  parkingSensors: z.string().optional(),
  usbCharger: z.string().optional(),
  foldableRearSeat: z.string().optional(),
});

export const interiorSchema = z.object({
  tachometer: z.boolean().optional().default(true),
  digitalCluster: z.boolean().optional().default(true),
  gloveBox: z.boolean().optional().default(true),
  digitalClusterSize: z.string().optional(),
  upholstery: z.string().optional().default("Leatherette"),
  additionalInteriorFeatures: z.string().optional(),
});

// And so on for other schemas...

// Complete form schema
export const carFormSchema = z.object({
  basicInfo: basicInfoSchema,
  engineTransmission: engineTransmissionSchema,
  fuelPerformance: fuelPerformanceSchema,
  comfortConvenience: comfortConvenienceSchema,
  interior: interiorSchema,
  // Add other schemas as needed
});

export type CarFormValues = z.infer<typeof carFormSchema>;

// Similarly for bike schema...
