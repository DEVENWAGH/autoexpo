import mongoose, { Schema, Document } from "mongoose";

export interface IBike extends Document {
  name: string;
  brand: string;
  variant: 'Base' | 'Mid' | 'Top';
  launchYear: number;
  price: {
    onroad: number;
    exshowroom: number;
  };
  pros: string[];
  cons: string[];
  specs: {
    engineType: string;
    displacement: number;
    maxPower: string;
    maxTorque: string;
    cylinders: number;
    coolingSystem: 'Liquid Cooled' | 'Air Cooled' | 'Oil Cooled';
    starting: 'Self Start Only' | 'Kick and Self Start';
    fuelSupply: 'Fuel Injection' | 'Carburetor';
    clutchType: 'Assist & Slipper' | 'Wet Multi-plate' | 'Dry' | 'Manual';
    gearBox: string;
    driveType: 'Chain Drive' | 'Belt Drive';
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    saddleHeight: number;
    wheelBase: number;
    groundClearance: number;
    kerbWeight: number;
    fuelCapacity: number;
  };
  chassis: {
    bodyType: string;
    frameType: string;
    frontSuspension: string;
    rearSuspension: string;
  };
  tyresAndBrakes: {
    frontBrake: 'Disc' | 'Drum';
    rearBrake: 'Disc' | 'Drum';
    abs: 'Single Channel' | 'Dual Channel' | 'None';
    frontTyreSize: string;
    rearTyreSize: string;
    tyreType: 'Tubeless' | 'Tube';
  };
  features: {
    speedometer: 'Digital' | 'Analog' | 'Not Available';
    tripmeter: 'Digital' | 'Analog' | 'Not Available';
    clockType: 'Digital' | 'Analog' | 'Not Available';
    bodyGraphics: boolean;
    passengerFootrest: boolean;
    usbCharger: boolean;
    bluetoothConnectivity: boolean;
  };
  mainImages: string[];
  colorImages: string[];
  galleryImages: string[];
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BikeSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  variant: {
    type: String,
    required: true,
    enum: ['Base', 'Mid', 'Top']
  },
  launchYear: { type: Number, required: true },
  price: {
    onroad: { type: Number, required: true },
    exshowroom: { type: Number, required: true }
  },
  pros: [{ type: String }],
  cons: [{ type: String }],
  specs: {
    engineType: { type: String, required: true },
    displacement: { type: Number, required: true },
    maxPower: { type: String, required: true },
    maxTorque: { type: String, required: true },
    cylinders: { type: Number, required: true },
    coolingSystem: { type: String, enum: ['Liquid Cooled', 'Air Cooled', 'Oil Cooled'], required: true },
    starting: { type: String, enum: ['Self Start Only', 'Kick and Self Start'], required: true },
    fuelSupply: { type: String, enum: ['Fuel Injection', 'Carburetor'], required: true },
    clutchType: { type: String, enum: ['Assist & Slipper', 'Wet Multi-plate', 'Dry', 'Manual'], required: true },
    gearBox: { type: String, required: true },
    driveType: { type: String, enum: ['Chain Drive', 'Belt Drive'], required: true }
  },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    saddleHeight: { type: Number, required: true },
    wheelBase: { type: Number, required: true },
    groundClearance: { type: Number, required: true },
    kerbWeight: { type: Number, required: true },
    fuelCapacity: { type: Number, required: true }
  },
  chassis: {
    bodyType: { type: String, required: true },
    frameType: { type: String, required: true },
    frontSuspension: { type: String, required: true },
    rearSuspension: { type: String, required: true }
  },
  tyresAndBrakes: {
    frontBrake: { type: String, enum: ['Disc', 'Drum'], required: true },
    rearBrake: { type: String, enum: ['Disc', 'Drum'], required: true },
    abs: { type: String, enum: ['Single Channel', 'Dual Channel', 'None'], required: true },
    frontTyreSize: { type: String, required: true },
    rearTyreSize: { type: String, required: true },
    tyreType: { type: String, enum: ['Tubeless', 'Tube'], required: true }
  },
  features: {
    speedometer: { type: String, enum: ['Digital', 'Analog', 'Not Available'], required: true },
    tripmeter: { type: String, enum: ['Digital', 'Analog', 'Not Available'], required: true },
    clockType: { type: String, enum: ['Digital', 'Analog', 'Not Available'], required: true },
    bodyGraphics: { type: Boolean, required: true },
    passengerFootrest: { type: Boolean, required: true },
    usbCharger: { type: Boolean, required: true },
    bluetoothConnectivity: { type: Boolean, required: true }
  },
  mainImages: [{ type: String, required: true }],
  colorImages: [{ type: String, required: true }],
  galleryImages: [{ type: String, required: true }],
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export const Bike = mongoose.models.Bike as mongoose.Model<IBike> || mongoose.model<IBike>("Bike", BikeSchema);