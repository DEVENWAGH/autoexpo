import React, { useState } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface ColorsTabProps {
  images: string[];
}

export const ColorsTab: React.FC<ColorsTabProps> = ({ images }) => {
  const [selectedColor, setSelectedColor] = useState(0);

  if (images.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No color variants available
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="aspect-[16/9] relative bg-gray-100 rounded-lg overflow-hidden mb-6">
        <Image
          src={images[selectedColor]}
          alt={`Color variant ${selectedColor + 1}`}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {images.map((color) => {
          const colorId = uuidv4();
          return (
            <button
              key={colorId}
              onClick={() => setSelectedColor(images.indexOf(color))}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 
                ${
                  images.indexOf(color) === selectedColor
                    ? "border-primary"
                    : "border-transparent"
                }`}
            >
              <Image
                src={color}
                alt={`Color variant`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
