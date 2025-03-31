import React from "react";
import { InfoCard } from "./InfoCard";

interface OverviewTabProps {
  data: any;
  type: "car" | "bike";
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, type }) => {
  // Handle both array and string formats for pros and cons
  const processTextItems = (items: string[] | string | undefined): string[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    return items.split("\n").filter((item) => item.trim() !== "");
  };

  const pros = processTextItems(data.basicInfo?.pros);
  const cons = processTextItems(data.basicInfo?.cons);

  return (
    <div className="p-6 space-y-6">
      {/* Price & Key Specs Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {type === "car" ? (
            <>
              <InfoCard
                label="Engine"
                value={data.engineTransmission?.engineType || "N/A"}
              />
              <InfoCard
                label="Max Power"
                value={data.engineTransmission?.maxPower || "N/A"}
              />
              <InfoCard
                label="Mileage"
                value={data.fuelPerformance?.mileage || "N/A"}
                unit="kmpl"
              />
              <InfoCard
                label="Boot Space"
                value={data.dimensionsCapacity?.bootSpace || "N/A"}
                unit="L"
              />
              <InfoCard
                label="Safety"
                value={`${data.safety?.airbags || "0"} Airbags`}
              />
            </>
          ) : (
            <>
              <InfoCard
                label="Engine"
                value={data.engineTransmission?.engineType || "N/A"}
              />
              <InfoCard
                label="Max Power"
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
            {pros.length > 0 ? (
              pros.map((pro, index) => (
                <li key={`pro-${index}`} className="text-gray-600">
                  {pro}
                </li>
              ))
            ) : (
              <li className="text-gray-600">Information not available</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-600">Cons</h3>
          <ul className="list-disc pl-5 space-y-2">
            {cons.length > 0 ? (
              cons.map((con, index) => (
                <li key={`con-${index}`} className="text-gray-600">
                  {con}
                </li>
              ))
            ) : (
              <li className="text-gray-600">Information not available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Rest of your component */}
      {/* ... */}
    </div>
  );
};
