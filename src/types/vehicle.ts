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
