import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
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
    valvesPerCylinder: number;
    transmission: string;
    gearbox: string;
    driveType: '2WD' | '4WD';
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG' | 'LPG';
    turboCharger: boolean;
    mileage: string;
    topSpeed: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelBase: number;
    groundClearance: number;
    seatingCapacity: number;
    bootSpace: number;
    fuelTankCapacity: number;
  };
  suspension: {
    front: string;
    rear: string;
  };
  brakes: {
    front: 'Disc' | 'Drum';
    rear: 'Disc' | 'Drum';
  };
  features: {
    exterior: {
      alloyWheels: boolean;
      fogLights: 'Front' | 'Rear' | 'Front & Rear' | 'None';
      sunroof: 'None' | 'Regular' | 'Panoramic' | 'Single-Pane' | 'Multi-Pane';
      ledDRLs: boolean;
      ledTaillights: boolean;
      adjustableHeadlights: boolean;
    };
    interior: {
      upholstery: 'Fabric' | 'Leatherette' | 'Leather';
      digitalCluster: boolean;
      touchscreenSize: number;
      speakers: number;
      speakerLocation: 'Front' | 'Rear' | 'Front & Rear';
    };
    safety: {
      airbags: number;
      abs: boolean;
      parkingSensors: 'Front' | 'Rear' | 'Front & Rear' | 'None';
      camera: 'None' | 'With Guidelines' | 'Without Guidelines';
      tpms: boolean;
      hillAssist: boolean;
    };
    comfort: {
      airConditioner: boolean;
      powerSteering: boolean;
      keylessEntry: boolean;
      cruiseControl: boolean;
      paddleShifters: boolean;
    };
  };
  mainImages: string[];
  interiorImages: string[];
  exteriorImages: string[];
  colorImages: string[];
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema({
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
    valvesPerCylinder: { type: Number, required: true },
    transmission: { type: String, required: true },
    gearbox: { type: String, required: true },
    driveType: { type: String, enum: ['2WD', '4WD'], required: true },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'], required: true },
    turboCharger: { type: Boolean, default: false },
    mileage: { type: String, required: true },
    topSpeed: { type: String, required: true }
  },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    wheelBase: { type: Number, required: true },
    groundClearance: { type: Number, required: true },
    seatingCapacity: { type: Number, required: true },
    bootSpace: { type: Number, required: true },
    fuelTankCapacity: { type: Number, required: true }
  },
  suspension: {
    front: { type: String, required: true },
    rear: { type: String, required: true }
  },
  brakes: {
    front: { type: String, enum: ['Disc', 'Drum'], required: true },
    rear: { type: String, enum: ['Disc', 'Drum'], required: true }
  },
  features: {
    exterior: {
      alloyWheels: { type: Boolean, required: true },
      fogLights: { type: String, enum: ['Front', 'Rear', 'Front & Rear', 'None'], required: true },
      sunroof: { type: String, enum: ['None', 'Regular', 'Panoramic', 'Single-Pane', 'Multi-Pane'], required: true },
      ledDRLs: { type: Boolean, required: true },
      ledTaillights: { type: Boolean, required: true },
      adjustableHeadlights: { type: Boolean, required: true }
    },
    interior: {
      upholstery: { type: String, enum: ['Fabric', 'Leatherette', 'Leather'], required: true },
      digitalCluster: { type: Boolean, required: true },
      touchscreenSize: { type: Number, required: true },
      speakers: { type: Number, required: true },
      speakerLocation: { type: String, enum: ['Front', 'Rear', 'Front & Rear'], required: true }
    },
    safety: {
      airbags: { type: Number, required: true },
      abs: { type: Boolean, required: true },
      parkingSensors: { type: String, enum: ['Front', 'Rear', 'Front & Rear', 'None'], required: true },
      camera: { type: String, enum: ['None', 'With Guidelines', 'Without Guidelines'], required: true },
      tpms: { type: Boolean, required: true },
      hillAssist: { type: Boolean, required: true }
    },
    comfort: {
      airConditioner: { type: Boolean, required: true },
      powerSteering: { type: Boolean, required: true },
      keylessEntry: { type: Boolean, required: true },
      cruiseControl: { type: Boolean, required: true },
      paddleShifters: { type: Boolean, required: true }
    }
  },
  mainImages: [{ type: String, required: true }],
  interiorImages: [{ type: String, required: true }],
  exteriorImages: [{ type: String, required: true }],
  colorImages: [{ type: String, required: true }],
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export const Car = mongoose.models.Car as mongoose.Model<ICar> || mongoose.model<ICar>("Car", CarSchema);
