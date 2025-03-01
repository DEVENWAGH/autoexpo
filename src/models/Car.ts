import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  name: string;
  brand: string;
  variant: 'Base' | 'Mid' | 'Top';
  price: {
    onroad: number;
    offroad: number;
  };
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG' | 'LPG';
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
  specifications: {
    engineTransmission: {
      engineType: string;
      displacement: number;
      maxPower: string;
      maxTorque: string;
      cylinders: number;
      valvesPerCylinder: number;
      turboCharger: boolean;
      transmissionType: 'Manual' | 'Automatic';
      gearbox: string;
      driveType: '2WD' | '4WD';
    };
    fuelPerformance: {
      fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
      fuelTankCapacity: number;
      highwayMileage: string;
      emissionNorm: string;
    };
    suspensionSteeringBrakes: {
      frontSuspension: string;
      rearSuspension: string;
      steeringType: 'Hydraulic' | 'Electric';
      steeringColumn: 'Tilt' | 'Telescopic';
      steeringGearType: string;
      frontBrakeType: 'Disc' | 'Drum';
      rearBrakeType: 'Disc' | 'Drum';
      frontWheelSize: number;
      rearWheelSize: number;
    };
    dimensionsCapacity: {
      length: number;
      width: number;
      height: number;
      seatingCapacity: number;
      groundClearance: number;
      wheelBase: number;
      approachAngle: number;
      breakoverAngle: number;
      departureAngle: number;
      doors: number;
    };
    comfortConvenience: {
      powerSteering: boolean;
      airConditioner: boolean;
      heater: boolean;
      adjustableSteering: boolean;
      heightAdjustableDriverSeat: boolean;
      accessoryPowerOutlet: boolean;
      rearReadingLamp: boolean;
      adjustableHeadrest: boolean;
      cruiseControl: boolean;
      parkingSensors: 'Front' | 'Rear' | 'Both' | 'None';
      foldableRearSeat: string;
      keylessEntry: boolean;
      voiceCommands: boolean;
      usbCharger: 'Front' | 'Rear' | 'Both';
      laneChangeIndicator: boolean;
      followMeHomeHeadlamps: boolean;
    };
    interior: {
      tachometer: boolean;
      gloveBox: boolean;
      upholstery: 'Fabric' | 'Leatherette' | 'Leather';
      digitalCluster: boolean;
    };
    exterior: {
      adjustableHeadlamps: boolean;
      rearWindowDefogger: boolean;
      alloyWheels: boolean;
      integratedAntenna: boolean;
      halogenHeadlamps: boolean;
      fogLights: 'Front' | 'Rear' | 'Both' | 'None';
      tyreSize: string;
      tyreType: string;
      ledTaillights: boolean;
    };
    safety: {
      abs: boolean;
      brakeAssist: boolean;
      centralLocking: boolean;
      airbags: number;
      driverAirbag: boolean;
      passengerAirbag: boolean;
      ebd: boolean;
      seatBeltWarning: boolean;
      tpms: boolean;
      engineImmobilizer: boolean;
      esc: boolean;
      speedSensingDoorLock: boolean;
      isofix: boolean;
      hillDescentControl: boolean;
      hillAssist: boolean;
    };
    entertainment: {
      radio: boolean;
      integrated2DINAudio: boolean;
      bluetooth: boolean;
      touchscreen: boolean;
      touchscreenSize: string;
      connectivity: string[];
      speakers: number;
      usbPorts: boolean;
      inbuiltApps: string;
      tweeters: number;
      speakerLocation: 'Front' | 'Rear' | 'Both';
    };
    internetFeatures: {
      eCallICall: boolean;
      overSpeedingAlert: boolean;
    };
  };
}

const CarSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  variant: {
    type: String,
    required: true,
    enum: ['Base', 'Mid', 'Top']
  },
  price: {
    onroad: { type: Number, required: true },
    offroad: { type: Number, required: true }
  },
  specs: {
    engine: { type: String, required: true },
    power: { type: String, required: true },
    torque: { type: String, required: true },
    transmission: { type: String, required: true },
    fuelType: { 
      type: String, 
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'],
      required: true 
    },
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
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  specifications: {
    engineTransmission: {
      engineType: { type: String, required: true },
      displacement: { type: Number, required: true },
      maxPower: { type: String, required: true },
      maxTorque: { type: String, required: true },
      cylinders: { type: Number, required: true },
      valvesPerCylinder: { type: Number, required: true },
      turboCharger: { type: Boolean, default: false },
      transmissionType: { type: String, enum: ['Manual', 'Automatic'], required: true },
      gearbox: { type: String, required: true },
      driveType: { type: String, enum: ['2WD', '4WD'], required: true }
    },
    // ...Add other specification sections following the same pattern
  }
}, {
  timestamps: true
});

export const Car = mongoose.models.Car as mongoose.Model<ICar> || mongoose.model<ICar>("Car", CarSchema);
