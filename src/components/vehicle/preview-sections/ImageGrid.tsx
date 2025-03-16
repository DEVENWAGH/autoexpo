import React from "react";
import Image from "next/image";

interface ImageGridProps {
  images: string[];
  title: string;
  onImageClick: (image: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  title,
  onImageClick,
}) => {
  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={`${title}-${image}`}
            onClick={() => onImageClick(image)}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <Image
              src={image}
              alt={`${title} image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
