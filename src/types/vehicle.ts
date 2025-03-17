interface BaseVehicle {
  _id?: string;
  name: string;
  brand: string;
  price: {
    starting: number;
    ending: number;
  };
  images: {
    main: string;
    gallery: string[];
  };
  featured: boolean;
  promoted: boolean;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  topSpeed: string;
  acceleration: string;
  seatingCapacity: number;
}

export interface BikeSpecs {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  topSpeed: string;
  acceleration: string;
}

export interface Car extends BaseVehicle {
  specs: CarSpecs;
}

export interface Bike extends BaseVehicle {
  specs: BikeSpecs;
}

export type Vehicle = Car | Bike;

// Add more specific interfaces for form validation
export interface BasicVehicleInfo {
  brand: string;
  name: string;
  priceExshowroom: string;
  priceOnroad: string;
  variantName?: string; // Add this line
  variant?: string;
  launchYear?: string;
  pros?: string;
  cons?: string;
}

export interface EngineTransmissionInfo {
  engineType: string;
  displacement: string | number;
  maxPower: string;
  maxTorque: string;
  cylinders?: string | number;
  transmission?: string;
  // Add other engine fields
}

export interface DimensionsInfo {
  length: string | number;
  width: string | number;
  height: string | number;
  wheelbase?: string | number;
  groundClearance?: string | number;
  seatingCapacity?: string | number;
}

export interface FormState {
  basicInfo?: BasicVehicleInfo;
  engineTransmission?: EngineTransmissionInfo;
  dimensions?: DimensionsInfo;
  [key: string]: any;
}
