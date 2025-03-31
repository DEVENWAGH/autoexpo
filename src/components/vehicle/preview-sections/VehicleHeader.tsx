import React from "react";

interface VehicleHeaderProps {
  data: Record<string, any>;
}

export const VehicleHeader: React.FC<VehicleHeaderProps> = ({ data }) => {
  const brand = data.basicInfo?.brand || "Unknown Brand";
  const name = data.basicInfo?.name || "Unknown Model";
  const variantName = data.basicInfo?.variantName || "";
  const variant = data.basicInfo?.variant || "";

  const price = data.basicInfo?.priceExshowroom;

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return "N/A";
    const num = Number(price);
    if (isNaN(num)) return price.toString();

    // Format to Indian currency format (lakhs and crores)
    if (num >= 10000000) {
      // 1 crore = 10000000
      return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      // 1 lakh = 100000
      return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹ ${num.toLocaleString("en-IN")}`;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {brand} {name}
            {variantName && (
              <span className="ml-2 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-md">
                {variantName}
              </span>
            )}
          </h1>
          <div className="text-gray-200 mt-1">
            {variant && (
              <span className="inline-block bg-blue-800 rounded px-2 py-1 text-xs mr-2">
                {variant} Variant
              </span>
            )}
            {data.basicInfo?.carType && (
              <span className="inline-block bg-blue-800 rounded px-2 py-1 text-xs mr-2">
                {data.basicInfo.carType}
              </span>
            )}
            {data.basicInfo?.bikeType && (
              <span className="inline-block bg-blue-800 rounded px-2 py-1 text-xs mr-2">
                {data.basicInfo.bikeType}
              </span>
            )}
            {data.fuelPerformance?.fuelType === "Electric" && (
              <span className="inline-block bg-green-800 rounded px-2 py-1 text-xs mr-2">
                Electric
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-lg">
            <span className="text-sm text-gray-300">Ex-Showroom Price</span>
            <p className="font-bold">{formatPrice(price)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
