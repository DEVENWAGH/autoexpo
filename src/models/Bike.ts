import mongoose, { Schema, Document } from "mongoose";

export interface IBike extends Document {
    _id: mongoose.Types.ObjectId;
    bikeModel: string;
    category: 'Sport' | 'Sport Naked' | 'Cruiser' | 'Touring' | 'Adventure' | 'Commuter' | 'Electric' | 'Super Bike';
    price: number;
    description: string;
    mainImage: string;
    images: Array<{
        url: string;
        alt?: string;
        order?: number;
    }>;
    brand: {
        name: string;
        logo?: string;
        country: string;
    };
    specifications: {
        engine: {
            type: 'Single Cylinder' | 'Parallel Twin' | 'V-Twin' | 'Inline-4';
            displacement: string;
            maxPower: string;
            maxTorque: string;
            compression: string;
            bore: string;
            stroke: string;
            fuelSystem: string;
            cooling: 'Air' | 'Liquid' | 'Oil' | 'Air & Oil';
            startingSystem: 'Electric' | 'Kick' | 'Electric & Kick';
        };
        transmission: {
            type: string;
            gearbox: string;
            clutch: string;
            driveType: string;
        };
        chassis: {
            frame: string;
            frontSuspension: string;
            rearSuspension: string;
            frontBrake: string;
            rearBrake: string;
            abs: 'Single Channel' | 'Dual Channel' | 'CBS' | 'None';
            frontTyre: string;
            rearTyre: string;
        };
        dimensions: {
            length: number;
            width: number;
            height: number;
            wheelbase: number;
            groundClearance: number;
            seatHeight: number;
            kerbWeight: number;
            fuelCapacity: number;
        };
        performance: {
            mileage: string;
            topSpeed?: string;
            acceleration?: string;
        };
        features: {
            lighting: string[];
            instruments: string[];
            safety: string[];
            comfort: string[];
            technology: string[];
        };
    };
    variants: Array<{
        name: string;
        price: {
            ex_showroom: number;
            onRoad?: number;
        };
        baseModel: boolean;
        colors: Array<{
            name: string;
            hexCode: string;
            imageUrl?: string;
        }>;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const mongoBikeSchema = new Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    mainImage: { type: String, required: true },
    images: [{
        url: { type: String, required: true },
        alt: String,
        order: Number
    }],
    brand: {
        name: { type: String, required: true },
        logo: String,
        country: { type: String, required: true }
    },
    specifications: {
        engine: {
            type: { type: String, enum: ['Single Cylinder', 'Parallel Twin', 'V-Twin', 'Inline-4'] },
            displacement: String,
            maxPower: String,
            maxTorque: String,
            compression: String,
            bore: String,
            stroke: String,
            fuelSystem: String,
            cooling: { type: String, enum: ['Air', 'Liquid', 'Oil', 'Air & Oil'] },
            startingSystem: { type: String, enum: ['Electric', 'Kick', 'Electric & Kick'] }
        },
        transmission: {
            type: String,
            gearbox: String,
            clutch: String,
            driveType: String
        },
        chassis: {
            frame: String,
            frontSuspension: String,
            rearSuspension: String,
            frontBrake: String,
            rearBrake: String,
            abs: { type: String, enum: ['Single Channel', 'Dual Channel', 'None'] },
            frontTyre: String,
            rearTyre: String
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            wheelbase: Number,
            groundClearance: Number,
            seatHeight: Number,
            kerbWeight: Number,
            fuelCapacity: Number
        },
        performance: {
            mileage: String,
            topSpeed: String,
            acceleration: String
        },
        features: {
            lighting: [String],
            instruments: [String],
            safety: [String],
            comfort: [String],
            technology: [String]
        }
    },
    variants: [{
        name: { type: String, required: true },
        price: {
            ex_showroom: { type: Number, required: true },
            onRoad: Number
        },
        baseModel: Boolean,
        colors: [{
            name: String,
            hexCode: String,
            imageUrl: String
        }]
    }]
}, {
    timestamps: true
});

export const Bike = mongoose.models.Bike as mongoose.Model<IBike> ||
    mongoose.model<IBike>("Bike", mongoBikeSchema);