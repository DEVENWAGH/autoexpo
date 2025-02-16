import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
    _id: mongoose.Types.ObjectId;
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
    images: {
        main: string;
        mainFileId: string;
        gallery: {
            url: string;
            fileId: string;
        }[];
    };
    featured: boolean;
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
    images: {
        main: { type: String, required: true },
        mainFileId: { type: String, required: true },
        gallery: [{
            url: { type: String, required: true },
            fileId: { type: String, required: true }
        }]
    },
    featured: { type: Boolean, default: false },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export const Car = mongoose.models.Car as mongoose.Model<ICar> ||
    mongoose.model<ICar>("Car", CarSchema);
