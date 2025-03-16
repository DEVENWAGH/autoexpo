import React from "react";
import { Badge } from "@/components/ui/badge";

interface VehicleHeaderProps {
  data: Record<string, any>;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({ data }) => {
  const { basicInfo } = data;
  const brand = basicInfo?.brand || "Brand";
  const name = basicInfo?.name || "Model Name";
  const priceEx = basicInfo?.priceExshowroom
    ? `₹${Number(basicInfo.priceExshowroom).toLocaleString("en-IN")}`
    : "TBD";
  const priceOn = basicInfo?.priceOnroad
    ? `₹${Number(basicInfo.priceOnroad).toLocaleString("en-IN")}`
    : "TBD";

  return (
    <div className="p-6 bg-gray-50 border-b">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold">
          {brand} {name}
        </h2>
        {(basicInfo?.carType || basicInfo?.bikeType) && (
          <Badge variant="outline" className="ml-2">
            {basicInfo?.carType || basicInfo?.bikeType}
          </Badge>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-4">
        <div>
          <p className="text-sm text-gray-500">Ex-Showroom Price</p>
          <p className="font-semibold">{priceEx}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">On-Road Price</p>
          <p className="font-semibold">{priceOn}</p>
        </div>
        {basicInfo?.variant && (
          <div>
            <p className="text-sm text-gray-500">Variant</p>
            <p className="font-semibold">{basicInfo.variant}</p>
          </div>
        )}
      </div>
    </div>
  );
};
