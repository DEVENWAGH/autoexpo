import React from "react";
import { Check, X } from "lucide-react";

interface FeaturesTabProps {
  data: Record<string, any>;
  type: "car" | "bike";
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({ data, type }) => {
  const categories =
    type === "car" ? getCarCategories(data) : getBikeCategories(data);

  // Filter categories based on their condition property
  const filteredCategories = categories.filter(
    (category) => !category.condition || category.condition(data)
  );

  // Completely redesigned getNestedValue function to better handle paths and boolean values
  const getNestedValue = (
    obj: Record<string, any>,
    path?: string,
    isBooleanField: boolean = false
  ) => {
    if (!path) return isBooleanField ? false : undefined;

    try {
      // For direct access (no dot in path)
      if (!path.includes(".")) {
        const value = obj[path];
        if (isBooleanField && (value === undefined || value === null))
          return false;
        return value;
      }

      // Split the path into section and field
      const [section, ...fieldParts] = path.split(".");
      const field = fieldParts.join(".");

      if (!obj[section]) return isBooleanField ? false : undefined;

      // For fields with special characters (like parentheses)
      const sectionObj = obj[section];

      // Try direct property access first
      if (field in sectionObj) {
        const value = sectionObj[field];
        return isBooleanField && (value === undefined || value === null)
          ? false
          : value;
      }

      // Try to find the field with case-insensitive match
      const keys = Object.keys(sectionObj);
      const matchingKey = keys.find(
        (k) =>
          k.toLowerCase() === field.toLowerCase() ||
          k.replace(/[^a-zA-Z0-9]/g, "") === field.replace(/[^a-zA-Z0-9]/g, "")
      );

      if (matchingKey) {
        const value = sectionObj[matchingKey];
        return isBooleanField && (value === undefined || value === null)
          ? false
          : value;
      }

      // No match found
      return isBooleanField ? false : undefined;
    } catch (err) {
      console.error("Error accessing nested value:", err, "Path:", path);
      return isBooleanField ? false : undefined;
    }
  };

  // Improved ValueDisplay component to handle boolean values correctly
  const ValueDisplay = ({
    value,
    isBooleanField = false,
  }: {
    value: any;
    isBooleanField?: boolean;
  }) => {
    // For debugging - can be removed after fix is confirmed
    if (
      isBooleanField &&
      ["tachometer", "digitalCluster", "gloveBox"].includes(value?.toString())
    ) {
      console.log(
        `Debug - Field: ${value}, Type: ${typeof value}, Value:`,
        value
      );
    }

    // Always treat boolean fields properly, convert undefined/null to false
    if (isBooleanField) {
      // Add additional checks to handle different boolean representations
      const boolValue =
        value === true ||
        value === "true" ||
        value === "yes" ||
        value === 1 ||
        value === "1" ||
        String(value).toLowerCase() === "true";

      return boolValue ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-red-600" />
      );
    }

    // Handle null/undefined for non-boolean fields
    if (value === null || value === undefined || value === "")
      return <span className="text-gray-400 text-sm">N/A</span>;

    // Handle boolean values that weren't marked as boolean fields
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <X className="h-5 w-5 text-red-600" />
      );
    }

    // Handle string-based boolean values
    if (typeof value === "string") {
      const lowerValue = value.trim().toLowerCase();
      if (["true", "yes", "1"].includes(lowerValue))
        return <Check className="h-5 w-5 text-green-600" />;
      if (["false", "no", "0", "none"].includes(lowerValue))
        return <X className="h-5 w-5 text-red-600" />;
    }

    // Show the actual value
    return <span className="font-medium text-sm">{value}</span>;
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h3 className="text-lg font-semibold">{category.title}</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <tbody className="divide-y">
                  {category.items.map((item) => {
                    // Get the value using path or direct value
                    const displayValue = item.path
                      ? getNestedValue(data, item.path, item.isBoolean)
                      : item.value;

                    return (
                      <tr key={item.label} className="hover:bg-gray-100">
                        <td className="px-4 py-3 text-sm text-gray-600 w-2/3">
                          {item.label}
                        </td>
                        <td className="px-4 py-3 text-sm w-1/3">
                          <ValueDisplay
                            value={displayValue}
                            isBooleanField={item.isBoolean}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Update item structure to include path for accessing nested properties
interface FeatureItem {
  label: string;
  value?: any;
  path?: string; // Path to the property in the data object
  isBoolean?: boolean; // Flag to indicate if this is a boolean field (checkbox)
}

interface FeatureCategory {
  title: string;
  items: FeatureItem[];
  condition?: (data: Record<string, any>) => boolean; // Add this line
}

const getCarCategories = (data: Record<string, any>): FeatureCategory[] => [
  // Reordered to match form sections
  {
    title: "Engine & Transmission",
    items: [
      { label: "Engine Type", path: "engineTransmission.engineType" },
      {
        label: "Displacement",
        value: data.engineTransmission?.displacement
          ? `${data.engineTransmission.displacement} cc`
          : undefined,
      },
      { label: "Max Power", path: "engineTransmission.maxPower" },
      { label: "Max Torque", path: "engineTransmission.maxTorque" },
      { label: "Cylinders", path: "engineTransmission.cylinders" },
      {
        label: "Valves Per Cylinder",
        path: "engineTransmission.valvesPerCylinder",
      },
      {
        label: "Transmission Type",
        path: "engineTransmission.transmissionType",
      },
      { label: "Gearbox", path: "engineTransmission.gearbox" },
      { label: "Drive Type", path: "engineTransmission.driveType" },
      { label: "Turbo Charger", path: "engineTransmission.turboCharger" },
    ],
  },
  {
    title: "Performance & Fuel",
    items: [
      { label: "Fuel Type", path: "fuelPerformance.fuelType" },

      // Only show for non-electric vehicles
      ...(data.fuelPerformance?.fuelType !== "Electric"
        ? [
            {
              label: "Fuel Tank Capacity",
              value: data.fuelPerformance?.fuelTankCapacity
                ? `${data.fuelPerformance.fuelTankCapacity} L`
                : undefined,
            },
            {
              label: "Mileage",
              value: data.fuelPerformance?.mileage
                ? `${data.fuelPerformance.mileage} kmpl`
                : undefined,
            },
            {
              label: "Highway Mileage",
              value: data.fuelPerformance?.highwayMileage
                ? `${data.fuelPerformance.highwayMileage} kmpl`
                : undefined,
            },
          ]
        : []),

      // Show for all vehicles
      {
        label: "Top Speed",
        value: data.fuelPerformance?.topSpeed
          ? `${data.fuelPerformance.topSpeed} kmph`
          : undefined,
      },
      {
        label: "Acceleration (0-100)",
        value: data.fuelPerformance?.acceleration
          ? `${data.fuelPerformance.acceleration} sec`
          : undefined,
      },

      // Show emission norm as ZEV for electric vehicles, otherwise show the actual value
      {
        label: "Emission Norm",
        value:
          data.fuelPerformance?.fuelType === "Electric"
            ? "ZEV" // Zero Emission Vehicle
            : data.fuelPerformance?.emissionNorm || undefined,
      },
    ],
  },
  // Add this section to the getCarCategories function:

  // Inside the "Performance & Fuel" title section, add the electric vehicle fields
  {
    title: "Electric Vehicle Features",
    items: [
      { label: "Electric Range", path: "fuelPerformance.electricRange" },
      { label: "Battery Capacity", path: "fuelPerformance.batteryCapacity" },
      { label: "DC Charging Time", path: "fuelPerformance.chargingTimeDC" },
      { label: "AC Charging Time", path: "fuelPerformance.chargingTimeAC" },
      { label: "Charging Port", path: "fuelPerformance.chargingPort" },
      { label: "Charging Options", path: "fuelPerformance.chargingOptions" },
      {
        label: "Regenerative Braking",
        path: "fuelPerformance.regenerativeBraking",
      },
      {
        label: "Regenerative Braking Levels",
        path: "fuelPerformance.regenerativeBrakingLevels",
      },
    ],
    // Only show this section for electric vehicles
    condition: (data) => data.fuelPerformance?.fuelType === "Electric",
  },
  // ... other categories remain unchanged

  // For comfort & convenience section with boolean values
  {
    title: "Comfort & Convenience",
    items: [
      {
        label: "Power Steering",
        path: "comfortConvenience.powerSteering",
        isBoolean: true,
      },
      {
        label: "Air Conditioner",
        path: "comfortConvenience.airConditioner",
        isBoolean: true,
      },
      { label: "Heater", path: "comfortConvenience.heater", isBoolean: true },
      {
        label: "Adjustable Steering",
        path: "comfortConvenience.adjustableSteering",
        isBoolean: true,
      },
      { label: "Parking Sensors", path: "comfortConvenience.parkingSensors" },
      { label: "USB Charger Location", path: "comfortConvenience.usbCharger" },
      {
        label: "Foldable Rear Seat",
        path: "comfortConvenience.foldableRearSeat",
      },
    ],
  },

  // Interior features section with boolean values
  {
    title: "Interior Features",
    items: [
      { label: "Tachometer", path: "interior.tachometer", isBoolean: true },
      {
        label: "Digital Cluster",
        path: "interior.digitalCluster",
        isBoolean: true,
      },
      { label: "Glove Box", path: "interior.gloveBox", isBoolean: true },
      {
        label: "Digital Cluster Size",
        value: data.interior?.digitalClusterSize
          ? `${data.interior.digitalClusterSize} inch`
          : undefined,
      },
      { label: "Upholstery", path: "interior.upholstery" },
      {
        label: "Additional Features",
        path: "interior.additionalInteriorFeatures",
      },
    ],
  },

  // Exterior features section with boolean values
  {
    title: "Exterior Features",
    items: [
      {
        label: "Adjustable Headlamps",
        path: "exterior.adjustableHeadlamps",
        isBoolean: true,
      },
      {
        label: "Rear Window Wiper",
        path: "exterior.rearWindowWiper",
        isBoolean: true,
      },
      {
        label: "Rear Window Defogger",
        path: "exterior.rearWindowDefogger",
        isBoolean: true,
      },
      {
        label: "Rear Window Washer",
        path: "exterior.rearWindowWasher",
        isBoolean: true,
      },
      {
        label: "Integrated Antenna",
        path: "exterior.integratedAntenna",
        isBoolean: true,
      },
      { label: "LED DRLs", path: "exterior.ledDRLs", isBoolean: true },
      {
        label: "LED Taillights",
        path: "exterior.ledTaillights",
        isBoolean: true,
      },
      {
        label: "Powered & Folding ORVM",
        path: "exterior.poweredFoldingORVM",
        isBoolean: true,
      },
      {
        label: "Halogen Headlamps",
        path: "exterior.halogenHeadlamps",
        isBoolean: true,
      },
      { label: "Fog Lights", path: "exterior.fogLights" },
      { label: "LED Fog Lamps", path: "exterior.ledFogLamps" },
      { label: "Sunroof Type", path: "exterior.sunroofType" },
      { label: "Tyre Size", path: "exterior.tyreSize" },
      { label: "Tyre Type", path: "exterior.tyreType" },
      {
        label: "Additional Features",
        path: "exterior.additionalExteriorFeatures",
      },
    ],
  },

  // Safety features with correct property paths and isBoolean flags
  {
    title: "Safety Features",
    items: [
      {
        label: "Anti-Lock Braking System (ABS)",
        path: "safety.antiLockBrakingSystem", // Simplified property name
        isBoolean: true,
      },
      {
        label: "Electronic Brakeforce Distribution (EBD)",
        path: "safety.electronicBrakeforceDistribution",
        isBoolean: true,
      },
      { label: "Brake Assist", path: "safety.brakeAssist", isBoolean: true },
      {
        label: "Electronic Stability Control (ESC)",
        path: "safety.electronicStabilityControl",
        isBoolean: true,
      },
      { label: "Hill Assist", path: "safety.hillAssist", isBoolean: true },
      {
        label: "Hill Descent Control",
        path: "safety.hillDescentControl",
        isBoolean: true,
      },
      { label: "Driver Airbag", path: "safety.driverAirbag", isBoolean: true },
      {
        label: "Passenger Airbag",
        path: "safety.passengerAirbag",
        isBoolean: true,
      },
      {
        label: "ISOFIX Child Seat Mounts",
        path: "safety.isofixChildSeatMounts",
        isBoolean: true,
      },
      {
        label: "Child Safety Locks",
        path: "safety.childSafetyLocks",
        isBoolean: true,
      },
      {
        label: "Tyre Pressure Monitoring System (TPMS)",
        path: "safety.tyrePressureMonitoringSystem",
        isBoolean: true,
      },
      {
        label: "Engine Immobilizer",
        path: "safety.engineImmobilizer",
        isBoolean: true,
      },
      {
        label: "Speed Sensing Auto Door Lock",
        path: "safety.speedSensingAutoDoorLock",
        isBoolean: true,
      },
      {
        label: "Day & Night Rear View Mirror",
        path: "safety.dayNightRearViewMirror",
        isBoolean: true,
      },
      {
        label: "Seat Belt Warning",
        path: "safety.seatBeltWarning",
        isBoolean: true,
      },
      {
        label: "Central Locking",
        path: "safety.centralLocking",
        isBoolean: true,
      },
      { label: "Number of Airbags", path: "safety.airbags" },
      {
        label: "Global NCAP Rating",
        path: "safety.bharatNcapRating",
      },
      {
        label: "Child Safety Rating",
        path: "safety.bharatNcapChildSafetyRating",
      },
    ],
  },

  // ADAS features with updated paths and isBoolean flags
  {
    title: "ADAS Features",
    items: [
      {
        label: "Forward Collision Warning",
        path: "adasFeatures.forwardCollisionWarning",
        isBoolean: true,
      },
      {
        label: "Auto Emergency Braking",
        path: "adasFeatures.automaticEmergencyBraking",
        isBoolean: true,
      },
      {
        label: "Traffic Sign Recognition",
        path: "adasFeatures.trafficSignRecognition",
        isBoolean: true,
      },
      {
        label: "Lane Departure Warning",
        path: "adasFeatures.laneDepartureWarning",
        isBoolean: true,
      },
      {
        label: "Lane Keep Assist",
        path: "adasFeatures.laneKeepAssist",
        isBoolean: true,
      },
      {
        label: "Adaptive Cruise Control",
        path: "adasFeatures.adaptiveCruiseControl",
        isBoolean: true,
      },
      {
        label: "Adaptive High Beam",
        path: "adasFeatures.adaptiveHighBeamAssist",
        isBoolean: true,
      },
      {
        label: "Blind Spot Detection",
        path: "adasFeatures.blindSpotDetection",
        isBoolean: true,
      },
      {
        label: "Rear Cross Traffic Alert",
        path: "adasFeatures.rearCrossTrafficAlert",
        isBoolean: true,
      },
      {
        label: "Driver Attention Monitor",
        path: "adasFeatures.driverAttentionMonitor",
        isBoolean: true,
      },
      {
        label: "Parking Assist",
        path: "adasFeatures.parkingAssist",
        isBoolean: true,
      },
    ],
  },

  // Entertainment section with updated path access and isBoolean flags
  {
    title: "Entertainment",
    items: [
      {
        label: "Touchscreen",
        path: "entertainment.Touchscreen",
        isBoolean: true,
      },
      {
        label: "Screen Size",
        value: data.entertainment?.touchscreenSize
          ? `${data.entertainment.touchscreenSize} inch`
          : undefined,
      },
      {
        label: "Bluetooth",
        path: "entertainment.Bluetooth Connectivity",
        isBoolean: true,
      },
      { label: "USB Ports", path: "entertainment.USB Ports", isBoolean: true },
      {
        label: "Apple CarPlay",
        path: "entertainment.Apple Car Play",
        isBoolean: true,
      },
      {
        label: "Android Auto",
        path: "entertainment.Android Auto",
        isBoolean: true,
      },
      { label: "Speakers", path: "entertainment.speakers" },
      { label: "Speaker Location", path: "entertainment.speakerLocation" },
      {
        label: "Additional Features",
        path: "entertainment.additionalEntertainmentFeatures",
      },
    ],
  },

  // Connected features with updated paths and isBoolean flags
  {
    title: "Connected Features",
    items: [
      {
        label: "E-Call & I-Call",
        path: "internetFeatures.eCallICall",
        isBoolean: true,
      },
      {
        label: "Remote Vehicle Start",
        path: "internetFeatures.remoteVehicleStart",
        isBoolean: true,
      },
      {
        label: "SOS Button",
        path: "internetFeatures.sosButton",
        isBoolean: true,
      },
      {
        label: "Remote AC Control",
        path: "internetFeatures.remoteACControl",
        isBoolean: true,
      },
      {
        label: "Geo-fence Alert",
        path: "internetFeatures.geoFenceAlert",
        isBoolean: true,
      },
    ],
  },
  // Add turning radius to the features display
  {
    title: "Suspension & Steering",
    items: [
      {
        label: "Front Suspension",
        path: "suspensionSteeringBrakes.frontSuspension",
      },
      {
        label: "Rear Suspension",
        path: "suspensionSteeringBrakes.rearSuspension",
      },
      { label: "Steering Type", path: "suspensionSteeringBrakes.steeringType" },
      {
        label: "Steering Column",
        path: "suspensionSteeringBrakes.steeringColumn",
      },
      {
        label: "Steering Gear Type",
        path: "suspensionSteeringBrakes.steeringGearType",
      },
      {
        label: "Turning Radius",
        value: data.suspensionSteeringBrakes?.turningRadius
          ? `${data.suspensionSteeringBrakes.turningRadius} m`
          : undefined,
      },
    ],
  },
];

// Keep the bike categories part the same, just updating to new format if needed

const getBikeCategories = (data: Record<string, any>): FeatureCategory[] => [
  {
    title: "Engine & Transmission",
    items: [
      { label: "Engine Type", path: "engineTransmission.engineType" },
      {
        label: "Displacement",
        value: data.engineTransmission?.displacement
          ? `${data.engineTransmission.displacement} cc`
          : undefined,
      },
      { label: "Max Power", path: "engineTransmission.maxPower" },
      { label: "Max Torque", path: "engineTransmission.maxTorque" },
      { label: "Cooling System", path: "engineTransmission.coolingSystem" },
      { label: "Starting", path: "engineTransmission.startingType" },
      { label: "Fuel Supply", path: "engineTransmission.fuelSupply" },
      { label: "Clutch", path: "engineTransmission.clutchType" },
    ],
  },
  {
    title: "Performance",
    items: [
      {
        label: "Mileage",
        value: data.mileageAndPerformance?.overallMileage
          ? `${data.mileageAndPerformance.overallMileage} kmpl`
          : undefined,
      },
      {
        label: "Top Speed",
        value: data.mileageAndPerformance?.topSpeed
          ? `${data.mileageAndPerformance.topSpeed} kmph`
          : undefined,
      },
      {
        label: "Acceleration (0-100)",
        value: data.mileageAndPerformance?.acceleration
          ? `${data.mileageAndPerformance.acceleration} sec`
          : undefined,
      },
    ],
  },
  {
    title: "Chassis & Suspension",
    items: [
      { label: "Frame Type", path: "chassisAndSuspension.frameType" },
      {
        label: "Front Suspension",
        path: "chassisAndSuspension.frontSuspension",
      },
      {
        label: "Rear Suspension",
        path: "chassisAndSuspension.rearSuspension",
      },
    ],
  },
  {
    title: "Dimensions",
    items: [
      {
        label: "Fuel Tank Capacity",
        value: data.dimensionsAndCapacity?.fuelCapacity
          ? `${data.dimensionsAndCapacity.fuelCapacity} L`
          : undefined,
      },
      {
        label: "Seat Height",
        value: data.dimensionsAndCapacity?.saddleHeight
          ? `${data.dimensionsAndCapacity.saddleHeight} mm`
          : undefined,
      },
      {
        label: "Ground Clearance",
        value: data.dimensionsAndCapacity?.groundClearance
          ? `${data.dimensionsAndCapacity.groundClearance} mm`
          : undefined,
      },
      {
        label: "Wheelbase",
        value: data.dimensionsAndCapacity?.wheelbase
          ? `${data.dimensionsAndCapacity.wheelbase} mm`
          : undefined,
      },
      {
        label: "Kerb Weight",
        value: data.dimensionsAndCapacity?.kerbWeight
          ? `${data.dimensionsAndCapacity.kerbWeight} kg`
          : undefined,
      },
    ],
  },
  {
    title: "Brakes & Tyres",
    items: [
      { label: "Front Brake", path: "tyresAndBrakes.frontBrakeType" },
      { label: "Rear Brake", path: "tyresAndBrakes.rearBrakeType" },
      { label: "Front Tyre Size", path: "tyresAndBrakes.frontTyreSize" },
      { label: "Rear Tyre Size", path: "tyresAndBrakes.rearTyreSize" },
      { label: "ABS", path: "featuresAndSafety.absType" },
    ],
  },
  {
    title: "Features",
    items: [
      {
        label: "Digital Display",
        value: Boolean(
          data.featuresAndSafety?.displayType?.includes("Digital")
        ),
        isBoolean: true,
      },
      {
        label: "LED Headlight",
        value: Boolean(data.electricals?.headlightType === "LED"),
        isBoolean: true,
      },
      {
        label: "LED Taillight",
        value: Boolean(data.electricals?.taillightType === "LED"),
        isBoolean: true,
      },
      {
        label: "USB Charging Port",
        path: "features.usbChargingPort",
        isBoolean: true,
      },
      {
        label: "Riding Modes",
        path: "featuresAndSafety.ridingModes",
        isBoolean: true,
      },
      {
        label: "Pass Switch",
        path: "featuresAndSafety.passSwitch",
        isBoolean: true,
      },
      {
        label: "Launch Control",
        path: "featuresAndSafety.launchControl",
        isBoolean: true,
      },
      {
        label: "Quick Shifter",
        path: "featuresAndSafety.quickShifter",
        isBoolean: true,
      },
    ],
  },
];
