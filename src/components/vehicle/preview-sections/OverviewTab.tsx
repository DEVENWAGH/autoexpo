import React from "react";
interface OverviewTabProps {
  data: Record<string, any>;
  type: "car" | "bike";
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, type }) => {
  const { basicInfo } = data;
  const pros = basicInfo?.pros?.split("\n").filter(Boolean) || [];
  const cons = basicInfo?.cons?.split("\n").filter(Boolean) || [];

  const vehicleSpec =
    type === "car"
      ? [
          {
            label: "Body Type",
            value: data.basicInfo?.carType || "N/A",
          },
          {
            label: "Power Type",
            value:
              data.fuelPerformance?.fuelType === "Electric"
                ? "Electric"
                : "Combustion",
          },
        ]
      : [];

  return (
    <div className="p-6 space-y-8">
      {/* Key Specs Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Key Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {type === "car" ? (
            <>
              <InfoCard
                label="Engine"
                value={data.engineTransmission?.displacement || "N/A"}
                unit="cc"
              />
              <InfoCard
                label="Power"
                value={data.engineTransmission?.maxPower || "N/A"}
              />
              <InfoCard
                label="Mileage"
                value={data.fuelPerformance?.mileage || "N/A"}
                unit="kmpl"
              />
              <InfoCard
                label="Transmission"
                value={data.engineTransmission?.transmissionType || "N/A"}
              />
              {vehicleSpec.map((spec) => (
                <InfoCard
                  key={spec.label}
                  label={spec.label}
                  value={spec.value}
                />
              ))}
            </>
          ) : (
            <>
              <InfoCard
                label="Engine"
                value={data.engineTransmission?.displacement || "N/A"}
                unit="cc"
              />
              <InfoCard
                label="Power"
                value={data.engineTransmission?.maxPower || "N/A"}
              />
              <InfoCard
                label="Mileage"
                value={data.mileageAndPerformance?.overallMileage || "N/A"}
                unit="kmpl"
              />
              <InfoCard
                label="Kerb Weight"
                value={data.dimensionsAndCapacity?.kerbWeight || "N/A"}
                unit="kg"
              />
            </>
          )}
        </div>
      </div>

      {/* Pros & Cons Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600">Pros</h3>
          <ul className="list-disc pl-5 space-y-2">
            {pros.map((pro: string) => (
              <li key={`pro-${pro}`} className="text-gray-600">
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Cons</h3>
          <ul className="list-disc pl-5 space-y-2">
            {cons.map((con: string) => (
              <li key={`con-${con}`} className="text-gray-600">
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: string;
  unit?: string;
}) => (
  <div className="bg-gray-50 p-3 rounded">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">
      {value} {unit}
    </p>
  </div>
);
