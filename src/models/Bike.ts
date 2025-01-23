import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export const BikeSchema = z.object({
    make: z.string().min(1, "Make cannot be empty"),
    model: z.string().min(1, "Model cannot be empty"),
    price: z.number().positive("Price must be positive"),
    description: z.string(),
    mainImage: z.string().url(),
    images: z.array(z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        order: z.number().optional()
    })),
    brand: z.object({
        name: z.string().min(1),
        logo: z.string().url().optional(),
        country: z.string().min(1),
    }),
    specifications: z.object({
        engine: z.object({
            type: z.enum(['Single Cylinder', 'Parallel Twin', 'V-Twin', 'Inline-4']),
            displacement: z.string(),         // e.g., "150 cc"
            maxPower: z.string(),            // e.g., "19.8 PS @ 8500 rpm"
            maxTorque: z.string(),           // e.g., "17.3 Nm @ 6500 rpm"
            compression: z.string(),          // e.g., "10:1"
            bore: z.string(),                 // e.g., "57.3 mm"
            stroke: z.string(),               // e.g., "57.8 mm"
            fuelSystem: z.string(),           // e.g., "Fuel Injection"
            cooling: z.enum(['Air', 'Liquid', 'Oil', 'Air & Oil']),
            startingSystem: z.enum(['Electric', 'Kick', 'Electric & Kick']),
        }),
        transmission: z.object({
            type: z.string(),                // e.g., "Manual"
            gearbox: z.string(),             // e.g., "6 Speed"
            clutch: z.string(),              // e.g., "Wet Multi-Disc"
            driveType: z.string(),           // e.g., "Chain Drive"
        }),
        chassis: z.object({
            frame: z.string(),               // e.g., "Diamond Frame"
            frontSuspension: z.string(),     // e.g., "Telescopic Forks"
            rearSuspension: z.string(),      // e.g., "Mono Shock"
            frontBrake: z.string(),          // e.g., "Disc"
            rearBrake: z.string(),           // e.g., "Disc"
            abs: z.enum(['Single Channel', 'Dual Channel', 'None']),
            frontTyre: z.string(),           // e.g., "100/80-17"
            rearTyre: z.string(),            // e.g., "130/70-17"
        }),
        dimensions: z.object({
            length: z.number(),              // mm
            width: z.number(),               // mm
            height: z.number(),              // mm
            wheelbase: z.number(),           // mm
            groundClearance: z.number(),     // mm
            seatHeight: z.number(),          // mm
            kerbWeight: z.number(),          // kg
            fuelCapacity: z.number(),        // litres
        }),
        performance: z.object({
            mileage: z.string(),             // e.g., "40 kmpl"
            topSpeed: z.string().optional(), // e.g., "140 kmph"
            acceleration: z.string().optional(), // e.g., "0-100 in 10 sec"
        }),
        features: z.object({
            lighting: z.array(z.string()),    // e.g., ["LED Headlamp", "LED Taillight"]
            instruments: z.array(z.string()), // e.g., ["Digital Console", "Tachometer"]
            safety: z.array(z.string()),      // e.g., ["ABS", "Engine Kill Switch"]
            comfort: z.array(z.string()),     // e.g., ["Split Seats", "Passenger Backrest"]
            technology: z.array(z.string()),  // e.g., ["Ride Modes", "Bluetooth Connectivity"]
        }),
    }),
    variants: z.array(z.object({
        name: z.string().min(1),
        price: z.object({
            ex_showroom: z.number(),
            onRoad: z.number().optional(),
        }),
        baseModel: z.boolean(),
        colors: z.array(z.object({
            name: z.string(),
            hexCode: z.string(),
            imageUrl: z.string().url().optional(),
        })),
    })),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

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

export interface IBike extends Document {
    make: string;
    bikeModel: string;
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

export const Bike = mongoose.models.Bike as mongoose.Model<IBike> || 
    mongoose.model<IBike>("Bike", mongoBikeSchema);

export const CreateBikeSchema = BikeSchema.omit({
    createdAt: true,
    updatedAt: true,
});

export const UpdateBikeSchema = BikeSchema.partial().omit({
    createdAt: true,
    updatedAt: true,
});

export type CreateBikeInput = z.infer<typeof CreateBikeSchema>;
export type UpdateBikeInput = z.infer<typeof UpdateBikeSchema>;
