import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  name: string;
  brand: string;
  price: {
    starting: number;
    ending: number;
  };
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuelType: string;
    mileage: string;
    topSpeed: string;
    acceleration: string;
    seatingCapacity: number;
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
  price: {
    starting: { type: Number, required: true },
    ending: { type: Number, required: true }
  },
  specs: {
    engine: { type: String, required: true },
    power: { type: String, required: true },
    torque: { type: String, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    mileage: { type: String, required: true },
    topSpeed: { type: String, required: true },
    acceleration: { type: String, required: true },
    seatingCapacity: { type: Number, required: true }
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
