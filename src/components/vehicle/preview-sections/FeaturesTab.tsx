import React from "react";
import { Check, X } from "lucide-react";

interface FeaturesTabProps {
  data: Record<string, any>;
  type: "car" | "bike";
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({ data, type }) => {
  const categories =
    type === "car" ? getCarCategories(data) : getBikeCategories(data);

  const ValueDisplay = ({
    value,
  }: {
    value: boolean | string | undefined | null;
  }) => {
    // Handle boolean values
    if (typeof value === "boolean") {
      return (
        <div
          className={`flex items-center gap-2 ${
            value ? "text-green-600" : "text-red-600"
          }`}
        >
          {value ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </div>
      );
    }

    // Handle string values
    if (typeof value === "string") {
      // For string values that represent booleans
      if (value.toLowerCase() === "true" || value.toLowerCase() === "yes") {
        return <Check className="h-5 w-5 text-green-600" />;
      }
      if (value.toLowerCase() === "false" || value.toLowerCase() === "no") {
        return <X className="h-5 w-5 text-red-600" />;
      }
      if (value.toLowerCase() === "none" || value === "") {
        return <X className="h-5 w-5 text-red-600" />;
      }

      // For all other string values, display them directly
      return <span className="font-medium text-sm">{value}</span>;
    }

    // Handle empty/undefined/null values
    return <span className="font-medium text-sm">N/A</span>;
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h3 className="text-lg font-semibold">{category.title}</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <tbody className="divide-y">
                  {category.items.map((item) => (
                    <tr key={item.label} className="hover:bg-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-600 w-2/3">
                        {item.label}
                      </td>
                      <td className="px-4 py-3 text-sm w-1/3">
                        <ValueDisplay value={item.value} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getCarCategories = (data: Record<string, any>) => [
  // Reordered to match form sections
  {
    title: "Engine & Transmission",
    items: [
      { label: "Engine Type", value: data.engineTransmission?.engineType },
      {
        label: "Displacement",
        value: `${data.engineTransmission?.displacement} cc`,
      },
      { label: "Max Power", value: data.engineTransmission?.maxPower },
      { label: "Max Torque", value: data.engineTransmission?.maxTorque },
      { label: "Cylinders", value: data.engineTransmission?.cylinders },
      {
        label: "Valves Per Cylinder",
        value: data.engineTransmission?.valvesPerCylinder,
      },
      {
        label: "Transmission Type",
        value: data.engineTransmission?.transmissionType,
      },
      { label: "Gearbox", value: data.engineTransmission?.gearbox },
      { label: "Drive Type", value: data.engineTransmission?.driveType },
      { label: "Turbo Charger", value: data.engineTransmission?.turboCharger },
    ],
  },
  {
    title: "Performance & Fuel",
    items: [
      { label: "Fuel Type", value: data.fuelPerformance?.fuelType },
      {
        label: "Fuel Tank Capacity",
        value: `${data.fuelPerformance?.fuelTankCapacity} L`,
      },
      { label: "Mileage", value: `${data.fuelPerformance?.mileage} kmpl` },
      {
        label: "Highway Mileage",
        value: `${data.fuelPerformance?.highwayMileage} kmpl`,
      },
      { label: "Top Speed", value: `${data.fuelPerformance?.topSpeed} kmph` },
      {
        label: "Acceleration (0-100)",
        value: `${data.fuelPerformance?.acceleration} sec`,
      },
      { label: "Emission Norm", value: data.fuelPerformance?.emissionNorm },
    ],
  },
  {
    title: "Dimensions & Capacity",
    items: [
      { label: "Length", value: `${data.dimensionsCapacity?.length} mm` },
      { label: "Width", value: `${data.dimensionsCapacity?.width} mm` },
      { label: "Height", value: `${data.dimensionsCapacity?.height} mm` },
      { label: "Wheelbase", value: `${data.dimensionsCapacity?.wheelBase} mm` },
      {
        label: "Ground Clearance",
        value: `${data.dimensionsCapacity?.groundClearance} mm`,
      },
      { label: "Boot Space", value: `${data.dimensionsCapacity?.bootSpace} L` },
      {
        label: "Seating Capacity",
        value: data.dimensionsCapacity?.seatingCapacity,
      },
      { label: "No. of Doors", value: data.dimensionsCapacity?.doors },
      {
        label: "Kerb Weight",
        value: `${data.dimensionsCapacity?.kerbWeight} kg`,
      },
      {
        label: "Approach Angle",
        value: `${data.dimensionsCapacity?.approachAngle}°`,
      },
      {
        label: "Break-over Angle",
        value: `${data.dimensionsCapacity?.breakOverAngle}°`,
      },
      {
        label: "Departure Angle",
        value: `${data.dimensionsCapacity?.departureAngle}°`,
      },
    ],
  },
  {
    title: "Suspension, Steering & Brakes",
    items: [
      {
        label: "Front Suspension",
        value: data.suspensionSteeringBrakes?.frontSuspension,
      },
      {
        label: "Rear Suspension",
        value: data.suspensionSteeringBrakes?.rearSuspension,
      },
      {
        label: "Steering Type",
        value: data.suspensionSteeringBrakes?.steeringType,
      },
      {
        label: "Steering Column",
        value: data.suspensionSteeringBrakes?.steeringColumn,
      },
      {
        label: "Steering Gear Type",
        value: data.suspensionSteeringBrakes?.steeringGearType,
      },
      {
        label: "Front Brake Type",
        value: data.suspensionSteeringBrakes?.frontBrakeType,
      },
      {
        label: "Rear Brake Type",
        value: data.suspensionSteeringBrakes?.rearBrakeType,
      },
      {
        label: "Front Wheel Size",
        value: `${data.suspensionSteeringBrakes?.frontWheelSize} inch`,
      },
      {
        label: "Rear Wheel Size",
        value: `${data.suspensionSteeringBrakes?.rearWheelSize} inch`,
      },
      { label: "Wheel Type", value: data.suspensionSteeringBrakes?.wheelType },
    ],
  },
  {
    title: "Comfort & Convenience",
    items: [
      {
        label: "Power Steering",
        value: data.comfortConvenience?.powerSteering,
      },
      {
        label: "Air Conditioner",
        value: data.comfortConvenience?.airConditioner,
      },
      { label: "Heater", value: data.comfortConvenience?.heater },
      {
        label: "Adjustable Steering",
        value: data.comfortConvenience?.adjustableSteering,
      },
      {
        label: "Parking Sensors",
        value: data.comfortConvenience?.parkingSensors,
      },
      {
        label: "USB Charger Location",
        value: data.comfortConvenience?.usbCharger,
      },
      {
        label: "Foldable Rear Seat",
        value: data.comfortConvenience?.foldableRearSeat,
      },
    ],
  },
  {
    title: "Interior Features",
    items: [
      { label: "Tachometer", value: data.interior?.tachometer },
      { label: "Digital Cluster", value: data.interior?.digitalCluster },
      { label: "Glove Box", value: data.interior?.gloveBox },
      {
        label: "Digital Cluster Size",
        value: `${data.interior?.digitalClusterSize} inch`,
      },
      { label: "Upholstery", value: data.interior?.upholstery },
      {
        label: "Additional Features",
        value: data.interior?.additionalInteriorFeatures,
      },
    ],
  },
  {
    title: "Exterior Features",
    items: [
      {
        label: "Adjustable Headlamps",
        value: data.exterior?.adjustableHeadlamps,
      },
      {
        label: "Rear Window Wiper",
        value: data.exterior?.rearWindowWiper,
      },
      {
        label: "Rear Window Defogger",
        value: data.exterior?.rearWindowDefogger,
      },
      {
        label: "Rear Window Washer",
        value: data.exterior?.rearWindowWasher,
      },
      {
        label: "Integrated Antenna",
        value: data.exterior?.integratedAntenna,
      },
      {
        label: "LED DRLs",
        value: data.exterior?.ledDRLs,
      },
      {
        label: "LED Taillights",
        value: data.exterior?.ledTaillights,
      },
      {
        label: "Powered & Folding ORVM",
        value: data.exterior?.poweredFoldingORVM,
      },
      {
        label: "Halogen Headlamps",
        value: data.exterior?.halogenHeadlamps,
      },
      {
        label: "Fog Lights",
        value: data.exterior?.fogLights,
      },
      {
        label: "LED Fog Lamps",
        value: data.exterior?.ledFogLamps,
      },
      {
        label: "Sunroof Type",
        value: data.exterior?.sunroofType,
      },
      {
        label: "Tyre Size",
        value: data.exterior?.tyreSize,
      },
      {
        label: "Tyre Type",
        value: data.exterior?.tyreType,
      },
      {
        label: "Additional Features",
        value: data.exterior?.additionalExteriorFeatures,
      },
    ],
  },
  {
    title: "Safety Features",
    items: [
      {
        label: "Anti-Lock Braking System (ABS)",
        value: Boolean(data.safety?.["antiLockBrakingSystem(ABS)"]),
      },
      {
        label: "Electronic Brakeforce Distribution (EBD)",
        value: Boolean(
          data.safety?.["Electronic Brakeforce Distribution (EBD)"]
        ),
      },
      { label: "Brake Assist", value: Boolean(data.safety?.brakeAssist) },
      {
        label: "Electronic Stability Control (ESC)",
        value: Boolean(data.safety?.["Electronic Stability Control (ESC)"]),
      },
      {
        label: "Hill Assist",
        value: Boolean(data.safety?.["Hill Assist"]),
      },
      {
        label: "Hill Descent Control",
        value: Boolean(data.safety?.["Hill Descent Control"]),
      },
      {
        label: "Driver Airbag",
        value: Boolean(data.safety?.["Driver Airbag"]),
      },
      {
        label: "Passenger Airbag",
        value: Boolean(data.safety?.["Passenger Airbag"]),
      },
      {
        label: "ISOFIX Child Seat Mounts",
        value: Boolean(data.safety?.["ISOFIX Child Seat Mounts"]),
      },
      {
        label: "Child Safety Locks",
        value: Boolean(data.safety?.childSafetyLocks),
      },
      {
        label: "Tyre Pressure Monitoring System (TPMS)",
        value: Boolean(data.safety?.["Tyre Pressure Monitoring System (TPMS)"]),
      },
      {
        label: "Engine Immobilizer",
        value: Boolean(data.safety?.["Engine Immobilizer"]),
      },
      {
        label: "Speed Sensing Auto Door Lock",
        value: Boolean(data.safety?.["Speed Sensing Auto Door Lock"]),
      },
      {
        label: "Day & Night Rear View Mirror",
        value: Boolean(data.safety?.["Day & Night Rear View Mirror"]),
      },
      {
        label: "Seat Belt Warning",
        value: Boolean(data.safety?.["Seat Belt Warning"]),
      },
      { label: "Central Locking", value: Boolean(data.safety?.centralLocking) },
      { label: "Number of Airbags", value: data.safety?.airbags },
      {
        label: "Global NCAP Rating",
        value:
          data.safety?.bharatNcapRating || data.safety?.bharatNcapSafetyRating,
      },
      {
        label: "Child Safety Rating",
        value: data.safety?.bharatNcapChildSafetyRating,
      },
    ],
  },
  {
    title: "ADAS Features",
    items: [
      {
        label: "Forward Collision Warning",
        value: data.adasFeatures?.forwardCollisionWarning,
      },
      {
        label: "Auto Emergency Braking",
        value: data.adasFeatures?.automaticEmergencyBraking,
      },
      {
        label: "Traffic Sign Recognition",
        value: data.adasFeatures?.trafficSignRecognition,
      },
      {
        label: "Lane Departure Warning",
        value: data.adasFeatures?.laneDepartureWarning,
      },
      { label: "Lane Keep Assist", value: data.adasFeatures?.laneKeepAssist },
      {
        label: "Adaptive Cruise Control",
        value: data.adasFeatures?.adaptiveCruiseControl,
      },
      {
        label: "Adaptive High Beam",
        value: data.adasFeatures?.adaptiveHighBeamAssist,
      },
      {
        label: "Blind Spot Detection",
        value: data.adasFeatures?.blindSpotDetection,
      },
      {
        label: "Rear Cross Traffic Alert",
        value: data.adasFeatures?.rearCrossTrafficAlert,
      },
      {
        label: "Driver Attention Monitor",
        value: data.adasFeatures?.driverAttentionMonitor,
      },
      { label: "Parking Assist", value: data.adasFeatures?.parkingAssist },
      { label: "System Name", value: data.adasFeatures?.adasSystemName },
      {
        label: "Additional Features",
        value: data.adasFeatures?.additionalADASFeatures,
      },
    ],
  },
  {
    title: "Entertainment",
    items: [
      { label: "Touchscreen", value: data.entertainment?.["Touchscreen"] },
      {
        label: "Screen Size",
        value: data.entertainment?.touchscreenSize
          ? `${data.entertainment?.touchscreenSize} inch`
          : undefined,
      },
      {
        label: "Bluetooth",
        value: data.entertainment?.["Bluetooth Connectivity"],
      },
      { label: "USB Ports", value: data.entertainment?.["USB Ports"] },
      { label: "Apple CarPlay", value: data.entertainment?.["Apple Car Play"] },
      { label: "Android Auto", value: data.entertainment?.["Android Auto"] },
      { label: "Speakers", value: data.entertainment?.speakers },
      { label: "Speaker Location", value: data.entertainment?.speakerLocation },
      {
        label: "Additional Features",
        value: data.entertainment?.additionalEntertainmentFeatures,
      },
    ],
  },
  {
    title: "Connected Features",
    items: [
      { label: "E-Call & I-Call", value: data.internetFeatures?.eCallICall },
      {
        label: "Remote Vehicle Start",
        value: data.internetFeatures?.remoteVehicleStart,
      },
      { label: "SOS Button", value: data.internetFeatures?.sosButton },
      {
        label: "Remote AC Control",
        value: data.internetFeatures?.remoteACControl,
      },
      { label: "Geo-fence Alert", value: data.internetFeatures?.geoFenceAlert },
      {
        label: "Connected Car App",
        value: data.internetFeatures?.connectedCarApp,
      },
      {
        label: "Additional Features",
        value: data.internetFeatures?.additionalConnectedFeatures,
      },
    ],
  },
];

const getBikeCategories = (data: Record<string, any>) => [
  {
    title: "Engine & Transmission",
    items: [
      { label: "Engine Type", value: data.engineTransmission?.engineType },
      {
        label: "Displacement",
        value: `${data.engineTransmission?.displacement} cc`,
      },
      { label: "Max Power", value: data.engineTransmission?.maxPower },
      { label: "Max Torque", value: data.engineTransmission?.maxTorque },
      {
        label: "Cooling System",
        value: data.engineTransmission?.coolingSystem,
      },
      { label: "Starting", value: data.engineTransmission?.startingType },
      { label: "Fuel Supply", value: data.engineTransmission?.fuelSupply },
      { label: "Clutch", value: data.engineTransmission?.clutchType },
    ],
  },
  {
    title: "Performance",
    items: [
      {
        label: "Mileage",
        value: `${data.mileageAndPerformance?.overallMileage} kmpl`,
      },
      {
        label: "Top Speed",
        value: `${data.mileageAndPerformance?.topSpeed} kmph`,
      },
      {
        label: "Acceleration (0-100)",
        value: `${data.mileageAndPerformance?.acceleration} sec`,
      },
    ],
  },
  {
    title: "Chassis & Suspension",
    items: [
      { label: "Frame Type", value: data.chassisAndSuspension?.frameType },
      {
        label: "Front Suspension",
        value: data.chassisAndSuspension?.frontSuspension,
      },
      {
        label: "Rear Suspension",
        value: data.chassisAndSuspension?.rearSuspension,
      },
    ],
  },
  {
    title: "Dimensions",
    items: [
      {
        label: "Fuel Tank Capacity",
        value: `${data.dimensionsAndCapacity?.fuelCapacity} L`,
      },
      {
        label: "Seat Height",
        value: `${data.dimensionsAndCapacity?.saddleHeight} mm`,
      },
      {
        label: "Ground Clearance",
        value: `${data.dimensionsAndCapacity?.groundClearance} mm`,
      },
      {
        label: "Wheelbase",
        value: `${data.dimensionsAndCapacity?.wheelbase} mm`,
      },
      {
        label: "Kerb Weight",
        value: `${data.dimensionsAndCapacity?.kerbWeight} kg`,
      },
    ],
  },
  {
    title: "Brakes & Tyres",
    items: [
      { label: "Front Brake", value: data.tyresAndBrakes?.frontBrakeType },
      { label: "Rear Brake", value: data.tyresAndBrakes?.rearBrakeType },
      { label: "Front Tyre Size", value: data.tyresAndBrakes?.frontTyreSize },
      { label: "Rear Tyre Size", value: data.tyresAndBrakes?.rearTyreSize },
      { label: "ABS", value: data.featuresAndSafety?.absType },
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
      },
      {
        label: "LED Headlight",
        value: Boolean(data.electricals?.headlightType === "LED"),
      },
      {
        label: "LED Taillight",
        value: Boolean(data.electricals?.taillightType === "LED"),
      },
      {
        label: "USB Charging Port",
        value: Boolean(data.features?.usbChargingPort),
      },
      {
        label: "Riding Modes",
        value: Boolean(data.featuresAndSafety?.ridingModes),
      },
      {
        label: "Pass Switch",
        value: Boolean(data.featuresAndSafety?.passSwitch),
      },
      {
        label: "Launch Control",
        value: Boolean(data.featuresAndSafety?.launchControl),
      },
      {
        label: "Quick Shifter",
        value: Boolean(data.featuresAndSafety?.quickShifter),
      },
    ],
  },
];
