import mongoose, { Schema, Document } from "mongoose";

export interface IBike extends Document {
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
    promoted: boolean;
    description: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BikeSchema = new Schema({
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
        acceleration: { type: String, required: true }
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
    promoted: { type: Boolean, default: false },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

export const Bike = mongoose.models.Bike as mongoose.Model<IBike> ||
    mongoose.model<IBike>("Bike", BikeSchema);