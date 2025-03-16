import React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VehicleHeader } from "./preview-sections/VehicleHeader";
import { OverviewTab } from "./preview-sections/OverviewTab";
import { FeaturesTab } from "./preview-sections/FeaturesTab";
import { ColorsTab } from "./preview-sections/ColorsTab";
import { GalleryTab } from "./preview-sections/GalleryTab";

interface VehiclePreviewProps {
  data: Record<string, any>;
  images: {
    main: string;
    interior?: string[];
    exterior?: string[];
    gallery?: string[];
    colors: string[];
  };
}

export const VehiclePreview: React.FC<VehiclePreviewProps> = ({
  data,
  images,
}) => {
  const mainImage = images.main || "/placeholder.svg";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <VehicleHeader data={data} />

      {/* Main image display */}
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        <Image
          src={mainImage}
          alt={`${data.basicInfo?.brand || "Brand"} ${
            data.basicInfo?.name || "Model"
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
          <OverviewTab data={data} type="car" />
        </TabsContent>

        <TabsContent value="features">
          <FeaturesTab data={data} type="car" />
        </TabsContent>

        <TabsContent value="colors">
          <ColorsTab images={images.colors} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryTab type="car" images={images} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
