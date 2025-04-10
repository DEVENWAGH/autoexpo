import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  basicInfo: {
    brand: string;
    name: string;
    variant: string;
    variantName?: string;
    carType?: string;
    priceExshowroom: number;
    launchYear?: number;
    pros: string[];
    cons: string[];
  };
  engineTransmission: {
    engineType: string;        // Required
    maxPower: string;         // Required
    maxTorque: string;        // Required
    displacement?: string;     // Updated to string to match form input
    cylinders?: string;       // Updated to string to match form input
    valvesPerCylinder?: string; // Updated to string to match form input
    transmissionType?: string;
    gearbox?: string;
    driveType?: string;
    turboCharger?: string;
  };
  fuelPerformance: {
    fuelType: string;
    fuelTankCapacity?: number;
    mileage?: string;
    highwayMileage?: string;
    topSpeed?: number;
    acceleration?: number;
    emissionNorm?: string;
    electricRange?: string;
    batteryCapacity?: string;
    chargingTimeDC?: string;
    chargingTimeAC?: string;
    chargingPort?: string;
    chargingOptions?: string;
    regenerativeBraking?: string;
    regenerativeBrakingLevels?: number;
  };
  dimensionsCapacity: {
    length?: number;
    width?: number;
    height?: number;
    wheelBase?: number;
    groundClearance?: number;
    seatingCapacity?: number;
    doors?: number;
    bootSpace?: number;
    kerbWeight?: number;
    approachAngle?: number;
    departureAngle?: number;
    breakOverAngle?: number;
  };
  suspensionSteeringBrakes: {
    frontSuspension?: string;
    rearSuspension?: string;
    steeringType?: string;
    steeringColumn?: string;
    steeringGearType?: string;
    turningRadius?: number; // Added this line for turning radius
    frontBrakeType?: string;
    rearBrakeType?: string;
    frontWheelSize?: number;
    rearWheelSize?: number;
    wheelType?: string;
  };
  comfortConvenience: {
    powerSteering: boolean;
    airConditioner: boolean;
    heater: boolean;
    adjustableSteering: boolean;
    foldableRearSeat?: string;
    parkingSensors?: string;
    usbCharger?: string;
  };
  interior: {
    tachometer: boolean;
    gloveBox: boolean;
    digitalCluster: boolean;
    digitalClusterSize?: number;
    upholstery: string;
    additionalInteriorFeatures?: string;
  };
  exterior: {
    adjustableHeadlamps: boolean;
    rearWindowWiper: boolean;
    rearWindowDefogger: boolean;
    rearWindowWasher: boolean;
    integratedAntenna: boolean;
    ledDRLs: boolean;
    ledTaillights: boolean;
    poweredFoldingORVM: boolean;
    halogenHeadlamps: boolean;
    fogLights?: string;
    ledFogLamps?: string;
    sunroofType?: string;
    tyreSize?: string;
    tyreType?: string;
    additionalExteriorFeatures?: string;
  };
  safety: {
    antiLockBrakingSystem: boolean;
    brakeAssist: boolean;
    centralLocking: boolean;
    driverAirbag: boolean;
    childSafetyLocks: boolean;
    passengerAirbag: boolean;
    dayNightRearViewMirror: boolean;
    electronicBrakeforceDistribution: boolean;
    seatBeltWarning: boolean;
    tyrePressureMonitoringSystem: boolean;
    engineImmobilizer: boolean;
    electronicStabilityControl: boolean;
    speedSensingAutoDoorLock: boolean;
    isofixChildSeatMounts: boolean;
    hillDescentControl: boolean;
    hillAssist: boolean;
    airbags?: number;
    bharatNcapRating?: string;
    bharatNcapChildSafetyRating?: string;
  };
  adasFeatures: {
    forwardCollisionWarning: boolean;
    automaticEmergencyBraking: boolean;
    trafficSignRecognition: boolean;
    laneDepartureWarning: boolean;
    laneKeepAssist: boolean;
    adaptiveCruiseControl: boolean;
    adaptiveHighBeamAssist: boolean;
    blindSpotDetection: boolean;
    rearCrossTrafficAlert: boolean;
    driverAttentionMonitor: boolean;
    parkingAssist: boolean;
  };
  entertainment: {
    Radio?: boolean;
    "Wireless Phone Charger"?: boolean;
    "Integrated 2DIN Audio"?: boolean;
    "Bluetooth Connectivity"?: boolean;
    Touchscreen?: boolean;
    "USB Ports"?: boolean;
    "Apple Car Play"?: boolean;
    "Android Auto"?: boolean;
    "Connected Apps"?: boolean;
    "DTS Sound Staging"?: boolean;
    Tweeters?: boolean;
    Subwoofer?: boolean;
    touchscreenSize?: number;
    speakers?: number;
    speakerLocation?: string;
    additionalEntertainmentFeatures?: string;
  };
  internetFeatures: {
    eCallICall?: boolean;
    remoteVehicleStart?: boolean;
    sosButton?: boolean;
    remoteACControl?: boolean;
    geoFenceAlert?: boolean;
  };
  images: {
    main: string[];
    interior: string[];
    exterior: string[];
    color: string[];
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema({
  basicInfo: {
    brand: { type: String },
    name: { type: String },
    variant: { type: String },
    variantName: { type: String },
    carType: { type: String },
    priceExshowroom: { type: Number },
    launchYear: { type: Number },
    pros: [{ type: String }],
    cons: [{ type: String }]
  },
  engineTransmission: {
    engineType: { type: String },
    maxPower: { type: String },
    maxTorque: { type: String },
    displacement: { type: String },
    cylinders: { type: String },
    valvesPerCylinder: { type: String },
    transmissionType: { type: String },
    gearbox: { type: String },
    driveType: { type: String },
    turboCharger: { type: String }
  },
  fuelPerformance: {
    fuelType: { type: String },
    fuelTankCapacity: { type: Number },
    mileage: { type: String },
    highwayMileage: { type: String },
    topSpeed: { type: Number },
    acceleration: { type: Number },
    emissionNorm: { type: String },
    electricRange: { type: String },        // Range in km (e.g., "557 - 683 km")
    batteryCapacity: { type: String },      // Capacity in kWh (e.g., "59 - 79 kWh") 
    chargingTimeDC: { type: String },       // DC charging time
    chargingTimeAC: { type: String },       // AC charging time
    chargingPort: { type: String },
    chargingOptions: { type: String },
    regenerativeBraking: { type: String },
    regenerativeBrakingLevels: { type: Number }
  },
  dimensionsCapacity: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    wheelBase: { type: Number },
    groundClearance: { type: Number },
    seatingCapacity: { type: Number },
    doors: { type: Number },
    bootSpace: { type: Number },
    kerbWeight: { type: Number },
    approachAngle: { type: Number },
    departureAngle: { type: Number },
    breakOverAngle: { type: Number }
  },
  suspensionSteeringBrakes: {
    frontSuspension: { type: String },
    rearSuspension: { type: String },
    steeringType: { type: String },
    steeringColumn: { type: String },
    steeringGearType: { type: String },
    turningRadius: { type: Number },
    frontBrakeType: { type: String },
    rearBrakeType: { type: String },
    frontWheelSize: { type: Number },
    rearWheelSize: { type: Number },
    wheelType: { type: String }
  },
  comfortConvenience: {
    powerSteering: { type: Boolean, default: false },
    airConditioner: { type: Boolean, default: false },
    heater: { type: Boolean, default: false },
    adjustableSteering: { type: Boolean, default: false },
    foldableRearSeat: { type: String },
    parkingSensors: { type: String },
    usbCharger: { type: String }
  },
  interior: {
    tachometer: { type: Boolean, default: true },
    gloveBox: { type: Boolean, default: true },
    digitalCluster: { type: Boolean, default: true },
    digitalClusterSize: { type: Number },
    upholstery: { type: String, default: 'Leatherette' },
    additionalInteriorFeatures: { type: String }
  },
  exterior: {
    adjustableHeadlamps: { type: Boolean, default: false },
    rearWindowWiper: { type: Boolean, default: false },
    rearWindowDefogger: { type: Boolean, default: false },
    rearWindowWasher: { type: Boolean, default: false },
    integratedAntenna: { type: Boolean, default: false },
    ledDRLs: { type: Boolean, default: false },
    ledTaillights: { type: Boolean, default: false },
    poweredFoldingORVM: { type: Boolean, default: false },
    halogenHeadlamps: { type: Boolean, default: false },
    fogLights: { type: String },
    ledFogLamps: { type: String },
    sunroofType: { type: String },
    tyreSize: { type: String },
    tyreType: { type: String },
    additionalExteriorFeatures: { type: String }
  },
  safety: {
    antiLockBrakingSystem: { type: Boolean, default: false },
    brakeAssist: { type: Boolean, default: false },
    centralLocking: { type: Boolean, default: false },
    driverAirbag: { type: Boolean, default: false },
    childSafetyLocks: { type: Boolean, default: false },
    passengerAirbag: { type: Boolean, default: false },
    dayNightRearViewMirror: { type: Boolean, default: false },
    electronicBrakeforceDistribution: { type: Boolean, default: false },
    seatBeltWarning: { type: Boolean, default: false },
    tyrePressureMonitoringSystem: { type: Boolean, default: false },
    engineImmobilizer: { type: Boolean, default: false },
    electronicStabilityControl: { type: Boolean, default: false },
    speedSensingAutoDoorLock: { type: Boolean, default: false },
    isofixChildSeatMounts: { type: Boolean, default: false },
    hillDescentControl: { type: Boolean, default: false },
    hillAssist: { type: Boolean, default: false },
    airbags: { type: Number },
    bharatNcapRating: { type: String },
    bharatNcapChildSafetyRating: { type: String }
  },
  adasFeatures: {
    forwardCollisionWarning: { type: Boolean, default: false },
    automaticEmergencyBraking: { type: Boolean, default: false },
    trafficSignRecognition: { type: Boolean, default: false },
    laneDepartureWarning: { type: Boolean, default: false },
    laneKeepAssist: { type: Boolean, default: false },
    adaptiveCruiseControl: { type: Boolean, default: false },
    adaptiveHighBeamAssist: { type: Boolean, default: false },
    blindSpotDetection: { type: Boolean, default: false },
    rearCrossTrafficAlert: { type: Boolean, default: false },
    driverAttentionMonitor: { type: Boolean, default: false },
    parkingAssist: { type: Boolean, default: false }
  },
  entertainment: {
    Radio: { type: Boolean, default: false },
    "Wireless Phone Charger": { type: Boolean, default: false },
    "Integrated 2DIN Audio": { type: Boolean, default: false },
    "Bluetooth Connectivity": { type: Boolean, default: false },
    Touchscreen: { type: Boolean, default: false },
    "USB Ports": { type: Boolean, default: false },
    "Apple Car Play": { type: Boolean, default: false },
    "Android Auto": { type: Boolean, default: false },
    "Connected Apps": { type: Boolean, default: false },
    "DTS Sound Staging": { type: Boolean, default: false },
    Tweeters: { type: Boolean, default: false },
    Subwoofer: { type: Boolean, default: false },
    touchscreenSize: { type: Number },
    speakers: { type: Number },
    speakerLocation: { type: String },
    additionalEntertainmentFeatures: { type: String }
  },
  internetFeatures: {
    eCallICall: { type: Boolean, default: false },
    remoteVehicleStart: { type: Boolean, default: false },
    sosButton: { type: Boolean, default: false },
    remoteACControl: { type: Boolean, default: false },
    geoFenceAlert: { type: Boolean, default: false }
  },
  images: {
    main: [{ type: String }],
    interior: [{ type: String }],
    exterior: [{ type: String }],
    color: [{ type: String }]
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Remove the validation middleware
CarSchema.pre('save', function(next) {
  // If this is an electric vehicle, ensure cylinder-related fields are removed
  if (this.fuelPerformance?.fuelType === "Electric") {
    // Explicitly set these fields to undefined
    if (this.engineTransmission) {
      this.engineTransmission.cylinders = undefined;
      this.engineTransmission.valvesPerCylinder = undefined;
      this.engineTransmission.gearbox = undefined;
    }
  }
  next();
});

// Keep the conversion middleware but remove validation
CarSchema.pre('save', function(next) {
  if (this.engineTransmission) {
    // Convert string numbers to actual numbers before saving
    if (this.engineTransmission.displacement) {
      this.engineTransmission.displacement = Number(this.engineTransmission.displacement) || undefined;
    }
    if (this.engineTransmission.cylinders) {
      this.engineTransmission.cylinders = Number(this.engineTransmission.cylinders) || undefined;
    }
    if (this.engineTransmission.valvesPerCylinder) {
      this.engineTransmission.valvesPerCylinder = Number(this.engineTransmission.valvesPerCylinder) || undefined;
    }
  }
  next();
});

export const Car = mongoose.models.Car as mongoose.Model<ICar> || mongoose.model<ICar>("Car", CarSchema);
