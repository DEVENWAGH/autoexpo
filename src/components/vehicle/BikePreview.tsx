import React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { VehicleHeader } from "./preview-sections/VehicleHeader";
import { OverviewTab } from "./preview-sections/OverviewTab";
import { FeaturesTab } from "./preview-sections/FeaturesTab";
import { ColorsTab } from "./preview-sections/ColorsTab";
import { GalleryTab } from "./preview-sections/GalleryTab";
import { useBikeStore } from "@/store/useBikeStore";

interface BikePreviewProps {
  onBackToEdit: () => void;
  onSubmit: () => void;
}

export const BikePreview: React.FC<BikePreviewProps> = ({
  onBackToEdit,
  onSubmit,
}) => {
  const { formState, mainImages, galleryImages, colorImages, isSubmitting } =
    useBikeStore();

  const mainImage = mainImages[0] || "/placeholder.svg";

  return (
    <div className="space-y-6">
      {/* Removed duplicate header with Back button, as it's now handled by the parent component */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <VehicleHeader data={formState} />

        {/* Main image display */}
        <div className="relative aspect-[16/9] w-full bg-gray-100">
          <Image
            src={mainImage}
            alt={`${formState.basicInfo?.brand || "Brand"} ${
              formState.basicInfo?.name || "Model"
            }`}
            fill
            className="object-contain"
            priority
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 p-0 h-auto">
            <TabsTrigger value="overview" className="px-4 py-2 rounded-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="features" className="px-4 py-2 rounded-none">
              Features & Specifications
            </TabsTrigger>
            <TabsTrigger value="colors" className="px-4 py-2 rounded-none">
              Colors
            </TabsTrigger>
            <TabsTrigger value="gallery" className="px-4 py-2 rounded-none">
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab data={formState} type="bike" />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTab data={formState} type="bike" />
          </TabsContent>

          <TabsContent value="colors">
            <ColorsTab images={colorImages} />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab
              type="bike"
              images={{
                gallery: galleryImages,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Bike"}
        </Button>
      </div>
    </div>
  );
};
