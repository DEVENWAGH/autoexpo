import mongoose, { Schema, Document } from "mongoose";

export interface IBike extends Document {
  name: string;
  brand: string;
  variant: 'Base' | 'Mid' | 'Top';
  price: {
    onroad: number;
    offroad: number;
  };
  specs: {
    engine: string;
    power: string;
    torque: string;
    fuelType: 'Petrol' | 'Electric' | 'Hybrid' | 'CNG';
    mileage: string;
    topSpeed: string;
    acceleration: string;
  };
  mainImages: string[];
  colorImages: string[];
  galleryImages: string[];
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  specifications: {
    engineTransmission: {
      engineType: string;
      displacement: number;
      maxTorque: string;
      noOfCylinders: number;
      coolingSystem: 'Liquid Cooled' | 'Air Cooled';
      valvePerCylinder: number;
      starting: 'Self Start Only' | 'Kick and Self Start';
      fuelSupply: 'Fuel Injection' | 'Carburetor';
      gearBox: string;
      emissionType: string;
    };
    features: {
      instrumentConsole: 'Digital' | 'Analog' | 'Digital-Analog';
      bluetoothConnectivity: boolean;
      speedometer: 'Digital' | 'Analog';
      tachometer: 'Digital' | 'Analog';
      tripmeter: 'Digital' | 'Analog';
      odometer: 'Digital' | 'Analog';
      gearPositionIndicator: boolean;
      seatType: 'Split' | 'Single' | 'Step-up';
      bodyGraphics: boolean;
      clock: boolean;
      passengerFootrest: boolean;
      averageFuelEconomyIndicator: boolean;
      distanceToEmptyIndicator: boolean;
    };
    featuresAndSafety: {
      passSwitch: boolean;
      clock: boolean;
      additionalFeatures: string[];
      passengerFootrest: boolean;
      display: boolean;
    };
    mileageAndPerformance: {
      overallMileage: number;
      topSpeed: number;
    };
    chassisAndSuspension: {
      bodyType: string;
      bodyGraphics: boolean;
    };
    dimensionsAndCapacity: {
      width: number;
      length: number;
      height: number;
      fuelCapacity: number;
      saddleHeight: number;
      groundClearance: number;
      wheelbase: number;
      kerbWeight: number;
    };
    electricals: {
      headlight: 'LED' | 'Halogen' | 'Projector';
      taillight: 'LED' | 'Bulb';
      turnSignalLamp: 'LED' | 'Bulb';
      lowFuelIndicator: boolean;
      distanceToEmptyIndicator: boolean;
      averageFuelEconomyIndicator: boolean;
    };
    tyresAndBrakes: {
      frontBrakeDiameter: number;
      rearBrakeDiameter: number;
      frontBrakes: 'Disc' | 'Drum';
      rearBrakes: 'Disc' | 'Drum';
      abs: 'Single Channel' | 'Dual Channel' | 'None';
      tyreType: 'Tubeless' | 'Tube';
    };
    motorAndBattery: {
      peakPower: string;
      driveType: 'Chain Drive' | 'Belt Drive';
      batteryCapacity: string;
      transmission: 'Manual' | 'Automatic';
    };
    underpinnings: {
      frontSuspension: string;
      rearSuspension: string;
    };
  }
}

const BikeSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  variant: {
    type: String,
    required: true,
    enum: ['Base', 'Mid', 'Top']
  },
  price: {
    onroad: { type: Number, required: true },
    offroad: { type: Number, required: true }
  },
  specs: {
    engine: { type: String, required: true },
    power: { type: String, required: true },
    torque: { type: String, required: true },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Electric', 'Hybrid', 'CNG'],
      required: true
    },
    mileage: { type: String, required: true },
    topSpeed: { type: String, required: true },
    acceleration: { type: String, required: true }
  },
  mainImages: [{ type: String, required: true }],
  colorImages: [{ type: String, required: true }],
  galleryImages: [{ type: String, required: true }],
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specifications: {
    engineTransmission: {
      engineType: { type: String, required: true },
      displacement: { type: Number, required: true },
      maxTorque: { type: String, required: true },
      noOfCylinders: { type: Number, default: 1 },
      coolingSystem: { type: String, enum: ['Liquid Cooled', 'Air Cooled'], default: 'Liquid Cooled' },
      valvePerCylinder: { type: Number, default: 4 },
      starting: { type: String, enum: ['Self Start Only', 'Kick and Self Start'], default: 'Self Start Only' },
      fuelSupply: { type: String, enum: ['Fuel Injection', 'Carburetor'], default: 'Fuel Injection' },
      gearBox: { type: String, required: true },
      emissionType: { type: String, default: 'BS6-2.0' }
    },
    // ... add other section schemas following the same pattern
  }
}, {
  timestamps: true
});

export const Bike = mongoose.models.Bike as mongoose.Model<IBike> || mongoose.model<IBike>("Bike", BikeSchema);