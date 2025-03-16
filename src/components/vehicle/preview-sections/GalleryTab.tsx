import React, { useState } from "react";
import Image from "next/image";
import { ImageGrid } from "./ImageGrid";

interface GalleryTabProps {
  type: "car" | "bike";
  images: {
    interior?: string[];
    exterior?: string[];
    gallery?: string[];
  };
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ type, images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Show empty state if no images available
  if (type === "car" && !images.interior?.length && !images.exterior?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No gallery images available
      </div>
    );
  }

  if (type === "bike" && !images.gallery?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No gallery images available
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-xl"
          >
            ✕
          </button>
          <div className="relative w-full max-w-4xl aspect-[16/9]">
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Gallery content */}
      <div className="space-y-8">
        {type === "car" ? (
          <>
            <ImageGrid
              images={images.interior || []}
              title="Interior Gallery"
              onImageClick={setSelectedImage}
            />
            <ImageGrid
              images={images.exterior || []}
              title="Exterior Gallery"
              onImageClick={setSelectedImage}
            />
          </>
        ) : (
          <ImageGrid
            images={images.gallery || []}
            title="Gallery"
            onImageClick={setSelectedImage}
          />
        )}
      </div>
    </div>
  );
};
