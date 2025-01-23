import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Zod schema for validation
export const VehicleSchema = z.object({
  make: z
    .string({
      required_error: "Make is required",
      invalid_type_error: "Make must be a string",
    })
    .min(1, "Make cannot be empty"),
  model: z
    .string({
      required_error: "Model is required",
      invalid_type_error: "Model must be a string",
    })
    .min(1, "Model cannot be empty"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive"),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"], {
    required_error: "Fuel type is required",
    invalid_type_error: "Invalid fuel type",
  }),
  transmission: z.enum(["Manual", "Automatic"]),
  category: z.enum(["Car", "SUV", "Truck", "Van", "Motorcycle"]),
  description: z.string(), // Made required for new vehicles
  mainImage: z.string().url(),
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().optional(),
      order: z.number().optional(),
    })
  ),
  brand: z.object({
    name: z.string().min(1),
    logo: z.string().url().optional(),
    country: z.string().min(1),
  }),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  specifications: z.object({
    engine: z.object({
      type: z.string({
        required_error: "Engine type is required",
      }),
      displacement: z.string({
        required_error: "Engine displacement is required",
      }),
      maxPower: z.string({
        required_error: "Maximum power specification is required",
      }),
      maxTorque: z.string(), // e.g., "111.7Nm@4300rpm"
      cylinders: z.number(),
      valvesPerCylinder: z.number(),
    }),
    transmission: z.object({
      type: z.string(), // e.g., "Automatic"
      gearbox: z.string(), // e.g., "5-Speed AMT"
      driveType: z.string(), // e.g., "FWD"
    }),
    fuelPerformance: z.object({
      fuelType: z.string(),
      mileage: z.string(), // e.g., "25.71 kmpl"
      fuelTankCapacity: z.number(), // in Liters
      emissionNorm: z.string(), // e.g., "BS VI 2.0"
    }),
    dimensions: z.object({
      length: z.number(), // mm
      width: z.number(), // mm
      height: z.number(), // mm
      wheelbase: z.number(), // mm
      bootSpace: z.number(), // Liters
      seatingCapacity: z.number(),
      groundClearance: z.number(), // mm
      kerbWeight: z.string(), // e.g., "920-960 kg"
      grossWeight: z.number(), // kg
    }),
    suspension: z.object({
      front: z.string(),
      rear: z.string(),
      steeringType: z.string(),
      turningRadius: z.number(), // meters
      frontBrake: z.string(),
      rearBrake: z.string(),
      wheelSize: z.string(),
    }),
    features: z.object({
      comfort: z.array(z.string()),
      safety: z.array(z.string()),
      interior: z.array(z.string()),
      exterior: z.array(z.string()),
      entertainment: z.array(z.string()),
      adasFeatures: z.array(z.string()),
      connectivity: z.array(z.string()),
    }),
  }),
  variants: z.array(
    z.object({
      name: z.string().min(1),
      price: z.object({
        ex_showroom: z.number(),
        onRoad: z.number().optional(),
      }),
      baseModel: z.boolean({
        required_error: "Base model status is required",
        invalid_type_error: "Base model status must be a boolean",
      }),
      specifications: z.object({
        engine: z.object({
          type: z.string(),
          displacement: z.string(), // e.g., "1197 cc"
          maxPower: z.string(), // e.g., "80bhp@5700rpm"
          maxTorque: z.string(), // e.g., "111.7Nm@4300rpm"
          cylinders: z.number(),
          valvesPerCylinder: z.number(),
          engineFamily: z.string().optional(),
          configuration: z.string().optional(),
        }),
        transmission: z.object({
          type: z.string(), // e.g., "Automatic"
          gearbox: z.string(), // e.g., "5-Speed AMT"
          driveType: z.string(), // e.g., "FWD"
          clutchType: z.string().optional(),
        }),
        fuelPerformance: z.object({
          fuelType: z.string(),
          mileage: z.string(), // e.g., "25.71 kmpl"
          fuelTankCapacity: z.number(), // in Liters
          emissionNorm: z.string(), // e.g., "BS VI 2.0"
        }),
        dimensions: z.object({
          length: z.number(), // mm
          width: z.number(), // mm
          height: z.number(), // mm
          wheelbase: z.number(), // mm
          bootSpace: z.number(), // Liters
          seatingCapacity: z.number(),
          groundClearance: z.number(), // mm
          kerbWeight: z.string(), // e.g., "920-960 kg"
          grossWeight: z.number(), // kg
        }),
        suspension: z.object({
          front: z.string(),
          rear: z.string(),
          steeringType: z.string(),
          turningRadius: z.number(), // meters
          frontBrake: z.string(),
          rearBrake: z.string(),
          wheelSize: z.string(),
        }),
        features: z.object({
          comfort: z.array(z.string()),
          safety: z.array(z.string()),
          interior: z.array(z.string()),
          exterior: z.array(z.string()),
          entertainment: z.array(z.string()),
          adasFeatures: z.array(z.string()),
          connectivity: z.array(z.string()),
          variantSpecific: z.array(z.string()),
        }),
      }),
      colors: z.array(
        z.object({
          name: z.string(),
          hexCode: z.string(),
          imageUrl: z.string().url().optional(),
        })
      ),
    })
  ),
});

// Mongoose schema
const mongooseVehicleSchema = new Schema(
  {
    make: {
      type: String,
      required: [true, "Make is required"],
    },
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Interface for TypeScript
export interface IVehicle extends Document {
  make: string;
  vehicleModel: string;
  price: number;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  transmission: "Manual" | "Automatic";
  category: "Car" | "SUV" | "Truck" | "Van" | "Motorcycle";
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
  }>;
}

export const Vehicle =
  (mongoose.models.Vehicle as mongoose.Model<IVehicle>) ||
  mongoose.model<IVehicle>("Vehicle", mongooseVehicleSchema);

export const CreateVehicleSchema = VehicleSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const UpdateVehicleSchema = VehicleSchema.partial().omit({
  createdAt: true,
  updatedAt: true,
});

export type CreateVehicleInput = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleSchema>;
