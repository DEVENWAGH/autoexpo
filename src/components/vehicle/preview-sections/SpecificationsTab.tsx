import React from "react";
import { v4 as uuidv4 } from "uuid";

interface SpecificationsTabProps {
  data: Record<string, any>;
  type: "car" | "bike";
}

export const SpecificationsTab: React.FC<SpecificationsTabProps> = ({
  data,
  type,
}) => {
  const specs = type === "car" ? getCarSpecs(data) : getBikeSpecs(data);

  return (
    <div className="p-6">
      <div className="space-y-6">
        {specs.map((section) => {
          const sectionId = uuidv4();
          return (
            <div key={sectionId}>
              <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <tbody>
                    {section.items.map((item) => (
                      <tr
                        key={`${sectionId}-${item.label}`}
                        className="border-b last:border-0"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600 w-1/3">
                          {item.label}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {item.value || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getCarSpecs = (data: Record<string, any>) => [
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
      { label: "Turbo Charger", value: data.engineTransmission?.turboCharger },
      {
        label: "Transmission Type",
        value: data.engineTransmission?.transmissionType,
      },
      { label: "Gearbox", value: data.engineTransmission?.gearbox },
      { label: "Drive Type", value: data.engineTransmission?.driveType },
    ],
  },
  {
    title: "Fuel & Performance",
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
];

const getBikeSpecs = (data: Record<string, any>) => [
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
        label: "Cooling System",
        value: data.engineTransmission?.coolingSystem,
      },
      { label: "Starting", value: data.engineTransmission?.startingType },
      { label: "Fuel Supply", value: data.engineTransmission?.fuelSupply },
      { label: "Clutch", value: data.engineTransmission?.clutchType },
    ],
  },
  {
    title: "Performance & Efficiency",
    items: [
      {
        label: "Overall Mileage",
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
      { label: "Body Type", value: data.chassisAndSuspension?.bodyType },
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
    title: "Dimensions & Capacity",
    items: [
      {
        label: "Fuel Capacity",
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
    title: "Electricals",
    items: [
      { label: "Headlight", value: data.electricals?.headlightType },
      { label: "Taillight", value: data.electricals?.taillightType },
      { label: "Battery", value: data.electricals?.batteryType },
    ],
  },
  {
    title: "Tyres & Brakes",
    items: [
      { label: "Front Brake Type", value: data.tyresAndBrakes?.frontBrakeType },
      { label: "Rear Brake Type", value: data.tyresAndBrakes?.rearBrakeType },
      {
        label: "Front Brake Diameter",
        value: `${data.tyresAndBrakes?.frontBrakeDiameter} mm`,
      },
      {
        label: "Rear Brake Diameter",
        value: `${data.tyresAndBrakes?.rearBrakeDiameter} mm`,
      },
      { label: "Front Tyre Size", value: data.tyresAndBrakes?.frontTyreSize },
      { label: "Rear Tyre Size", value: data.tyresAndBrakes?.rearTyreSize },
      {
        label: "Tyre Type",
        value: data.tyresAndBrakes?.tubelessTyre ? "Tubeless" : "Tube",
      },
    ],
  },
];
