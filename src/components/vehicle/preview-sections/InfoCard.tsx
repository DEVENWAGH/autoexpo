import React from "react";

interface InfoCardProps {
  label: string;
  value: string;
  unit?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  unit = "",
}) => (
  <div className="bg-gray-50 p-3 rounded">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">
      {value} {unit}
    </p>
  </div>
);
