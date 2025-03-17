import mongoose, { Schema, Document } from "mongoose";

export interface IBike extends Document {
  basicInfo: {
    brand: string;
    name: string;
    variant: string;
    variantName?: string;
    bikeType?: string;
    priceExshowroom: number;
    priceOnroad: number;
    launchYear?: number;
    pros: string[];
    cons: string[];
  };
  engineTransmission: {
    engineType: string;
    displacement: number;
    maxPower: string;
    maxTorque: string;
    cylinders?: number;
    coolingSystem?: string;
    startingType?: string;
    fuelSupply?: string;
    clutchType?: string;
  };
  featuresAndSafety: {
    passSwitch?: boolean;
    ridingModes?: boolean;
    tractionControl?: boolean;
    launchControl?: boolean;
    quickShifter?: boolean;
    absType?: string;
    displayType?: string;
  };
  mileageAndPerformance: {
    overallMileage?: number;
    topSpeed?: number;
    acceleration?: number;
  };
  chassisAndSuspension: {
    bodyType?: string;
    frameType?: string;
    frontSuspension?: string;
    rearSuspension?: string;
  };
  dimensionsAndCapacity: {
    fuelCapacity?: number;
    saddleHeight?: number;
    groundClearance?: number;
    wheelbase?: number;
    kerbWeight?: number;
  };
  electricals: {
    headlightType?: string;
    taillightType?: string;
    ledTaillights?: boolean;
    lowBatteryIndicator?: boolean;
    lowFuelIndicator?: boolean;
    turnSignalLamp?: boolean;
  };
  tyresAndBrakes: {
    frontBrakeType?: string;
    rearBrakeType?: string;
    frontBrakeDiameter?: number;
    rearBrakeDiameter?: number;
    frontTyreSize?: string;
    rearTyreSize?: string;
    tubelessTyre?: boolean;
  };
  motorAndBattery: {
    motorType?: string;
    motorPower?: number;
    batteryType?: string;
    batteryCapacity?: number;
    chargingTime?: number;
    range?: number;
  };
  underpinnings: {
    frontFork?: string;
    rearMonoshock?: string;
    swingarm?: string;
    chassisType?: string;
  };
  features: {
    usbChargingPort?: boolean;
    cruiseControl?: boolean;
    bodyGraphics?: boolean;
    stepupSeat?: boolean;
    passengerFootrest?: boolean;
  };
  images: {
    main: string[];
    gallery: string[];
    color: string[];
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BikeSchema = new Schema({
  basicInfo: {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    variant: { type: String, required: true },
    variantName: { type: String },
    bikeType: { type: String },
    priceExshowroom: { type: Number, required: true },
    priceOnroad: { type: Number, required: true },
    launchYear: { type: Number },
    pros: [{ type: String }],
    cons: [{ type: String }]
  },
  engineTransmission: {
    engineType: { type: String, required: true },
    displacement: { type: Number },
    maxPower: { type: String, required: true },
    maxTorque: { type: String, required: true },
    cylinders: { type: Number },
    coolingSystem: { type: String },
    startingType: { type: String },
    fuelSupply: { type: String },
    clutchType: { type: String }
  },
  featuresAndSafety: {
    passSwitch: { type: Boolean, default: false },
    ridingModes: { type: Boolean, default: false },
    tractionControl: { type: Boolean, default: false },
    launchControl: { type: Boolean, default: false },
    quickShifter: { type: Boolean, default: false },
    absType: { type: String },
    displayType: { type: String }
  },
  mileageAndPerformance: {
    overallMileage: { type: Number },
    topSpeed: { type: Number },
    acceleration: { type: Number }
  },
  chassisAndSuspension: {
    bodyType: { type: String },
    frameType: { type: String },
    frontSuspension: { type: String },
    rearSuspension: { type: String }
  },
  dimensionsAndCapacity: {
    fuelCapacity: { type: Number },
    saddleHeight: { type: Number },
    groundClearance: { type: Number },
    wheelbase: { type: Number },
    kerbWeight: { type: Number }
  },
  electricals: {
    headlightType: { type: String },
    taillightType: { type: String },
    ledTaillights: { type: Boolean, default: false },
    lowBatteryIndicator: { type: Boolean, default: false },
    lowFuelIndicator: { type: Boolean, default: false },
    turnSignalLamp: { type: Boolean, default: false }
  },
  tyresAndBrakes: {
    frontBrakeType: { type: String },
    rearBrakeType: { type: String },
    frontBrakeDiameter: { type: Number },
    rearBrakeDiameter: { type: Number },
    frontTyreSize: { type: String },
    rearTyreSize: { type: String },
    tubelessTyre: { type: Boolean, default: false }
  },
  motorAndBattery: {
    motorType: { type: String },
    motorPower: { type: Number },
    batteryType: { type: String },
    batteryCapacity: { type: Number },
    chargingTime: { type: Number },
    range: { type: Number }
  },
  underpinnings: {
    frontFork: { type: String },
    rearMonoshock: { type: String },
    swingarm: { type: String },
    chassisType: { type: String }
  },
  features: {
    usbChargingPort: { type: Boolean, default: false },
    cruiseControl: { type: Boolean, default: false },
    bodyGraphics: { type: Boolean, default: false },
    stepupSeat: { type: Boolean, default: false },
    passengerFootrest: { type: Boolean, default: false }
  },
  images: {
    main: [{ type: String, required: true }],
    gallery: [{ type: String }],
    color: [{ type: String }]
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export const Bike = mongoose.models.Bike as mongoose.Model<IBike> || mongoose.model<IBike>("Bike", BikeSchema);