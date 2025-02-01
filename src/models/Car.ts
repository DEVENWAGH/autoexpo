import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript
export interface ICar extends Document {
  vehicleModel: string;
  price: number;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic";
  category: "Sedan" | "SUV" | "hatchBack" | "Luxury" | "Sports" | "Electric";
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
  createdAt: Date;
  updatedAt: Date;
  specifications: {
    engine: {
      type: string;
      displacement: string;
      maxPower: string;
      maxTorque: string;
      cylinders: number;
      valvesPerCylinder: number;
    };
    transmission: {
      type: string;
      gearbox: string;
      driveType: string;
    };
    fuelPerformance: {
      fuelType: string;
      mileage: string;
      fuelTankCapacity: number;
      emissionNorm: string;
    };
    dimensions: {
      length: number;
      width: number;
      height: number;
      wheelbase: number;
      bootSpace: number;
      seatingCapacity: number;
      groundClearance: number;
      kerbWeight: string;
      grossWeight: number;
    };
    suspension: {
      front: string;
      rear: string;
      steeringType: string;
      turningRadius: number;
      frontBrake: string;
      rearBrake: string;
      wheelSize: string;
    };
    features: {
      comfort: string[];
      safety: string[];
      interior: string[];
      exterior: string[];
      entertainment: string[];
      adasFeatures: string[];
      connectivity: string[];
    };
  };
  variants: Array<{
    name: string;
    price: {
      ex_showroom: number;
      onRoad?: number;
    };
    baseModel: boolean;
    tags?: string[];
    specifications: {
      engine: {
        type: string;
        displacement: string;
        maxPower: string;
        maxTorque: string;
        cylinders: number;
        valvesPerCylinder: number;
        engineFamily?: string;
        configuration?: string;
      };
      transmission: {
        type: string;
        gearbox: string;
        driveType: string;
        clutchType?: string;
      };
      fuelPerformance: {
        fuelType: string;
        mileage: string;
        fuelTankCapacity: number;
        emissionNorm: string;
      };
      dimensions: {
        length: number;
        width: number;
        height: number;
        wheelbase: number;
        bootSpace: number;
        seatingCapacity: number;
        groundClearance: number;
        kerbWeight: string;
        grossWeight: number;
      };
      suspension: {
        front: string;
        rear: string;
        steeringType: string;
        turningRadius: number;
        frontBrake: string;
        rearBrake: string;
        wheelSize: string;
      };
      features: {
        comfort: string[];
        safety: string[];
        interior: string[];
        exterior: string[];
        entertainment: string[];
        adasFeatures: string[];
        connectivity: string[];
        variantSpecific: string[];
      };
    };
    colors: Array<{
      name: string;
      hexCode: string;
      imageUrl?: string;
    }>;
    images: Array<{
      url: string;
      alt?: string;
      order?: number;
    }>;
  }>;
  pros: string[];
  cons: string[];
}

// Mongoose schema
const mongooseCarSchema = new Schema(
  {
    vehicleModel: {
      type: String,
      required: [true, "Model is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      validate: {
        validator: (v: number) => v > 0,
        message: "Price must be positive",
      },
    },
    fuelType: {
      type: String,
      enum: {
        values: ["Petrol", "Diesel", "Electric", "Hybrid"],
        message: "Invalid fuel type: {VALUE}",
      },
      required: [true, "Fuel type is required"],
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Car", "SUV", "Truck", "Van", "Motorcycle"],
      required: true,
    },
    description: { type: String, required: true },
    mainImage: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        order: Number,
      },
    ],
    brand: {
      name: { type: String, required: true },
      logo: { type: String },
      country: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    specifications: {
      engine: {
        type: { type: String, required: [true, "Engine type is required"] },
        displacement: {
          type: String,
          required: [true, "Engine displacement is required"],
        },
        maxPower: {
          type: String,
          required: [true, "Maximum power specification is required"],
        },
        maxTorque: { type: String, required: true },
        cylinders: { type: Number, required: true },
        valvesPerCylinder: { type: Number, required: true },
      },
      transmission: {
        type: { type: String, required: true },
        gearbox: { type: String, required: true },
        driveType: { type: String, required: true },
      },
      fuelPerformance: {
        fuelType: { type: String, required: true },
        mileage: { type: String, required: true },
        fuelTankCapacity: { type: Number, required: true },
        emissionNorm: { type: String, required: true },
      },
      dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        wheelbase: { type: Number, required: true },
        bootSpace: { type: Number, required: true },
        seatingCapacity: { type: Number, required: true },
        groundClearance: { type: Number, required: true },
        kerbWeight: { type: String, required: true },
        grossWeight: { type: Number, required: true },
      },
      suspension: {
        front: { type: String, required: true },
        rear: { type: String, required: true },
        steeringType: { type: String, required: true },
        turningRadius: { type: Number, required: true },
        frontBrake: { type: String, required: true },
        rearBrake: { type: String, required: true },
        wheelSize: { type: String, required: true },
      },
      features: {
        comfort: [String],
        safety: [String],
        interior: [String],
        exterior: [String],
        entertainment: [String],
        adasFeatures: [String],
        connectivity: [String],
      },
    },
    variants: [
      {
        name: { type: String, required: true },
        price: {
          ex_showroom: { type: Number, required: true },
          onRoad: Number,
        },
        baseModel: {
          type: Boolean,
          required: [true, "Base model status is required"],
        },
        tags: [String],
        specifications: {
          engine: {
            type: { type: String, required: true },
            displacement: { type: String, required: true },
            maxPower: { type: String, required: true },
            maxTorque: { type: String, required: true },
            cylinders: { type: Number, required: true },
            valvesPerCylinder: { type: Number, required: true },
            engineFamily: String,
            configuration: String,
          },
          transmission: {
            type: { type: String, required: true },
            gearbox: { type: String, required: true },
            driveType: { type: String, required: true },
            clutchType: String,
          },
          fuelPerformance: {
            fuelType: { type: String, required: true },
            mileage: { type: String, required: true },
            fuelTankCapacity: { type: Number, required: true },
            emissionNorm: { type: String, required: true },
          },
          dimensions: {
            length: { type: Number, required: true },
            width: { type: Number, required: true },
            height: { type: Number, required: true },
            wheelbase: { type: Number, required: true },
            bootSpace: { type: Number, required: true },
            seatingCapacity: { type: Number, required: true },
            groundClearance: { type: Number, required: true },
            kerbWeight: { type: String, required: true },
            grossWeight: { type: Number, required: true },
          },
          suspension: {
            front: { type: String, required: true },
            rear: { type: String, required: true },
            steeringType: { type: String, required: true },
            turningRadius: { type: Number, required: true },
            frontBrake: { type: String, required: true },
            rearBrake: { type: String, required: true },
            wheelSize: { type: String, required: true },
          },
          features: {
            comfort: [String],
            safety: [String],
            interior: [String],
            exterior: [String],
            entertainment: [String],
            adasFeatures: [String],
            connectivity: [String],
            variantSpecific: [String],
          },
        },
        colors: [
          {
            name: { type: String, required: true },
            hexCode: { type: String, required: true },
            imageUrl: String,
          },
        ],
        images: [
          {
            url: { type: String, required: true },
            alt: String,
            order: Number,
          },
        ],
      },
    ],
    pros: [String],
    cons: [String],
  },
  {
    timestamps: true,
  }
);

export const Car =
  (mongoose.models.Car as mongoose.Model<ICar>) ||
  mongoose.model<ICar>("Car", mongooseCarSchema);
