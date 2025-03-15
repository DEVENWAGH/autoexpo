import React from 'react';
import { DEFAULT_BIKE_DATA } from '@/store/vehicleStore';
import { VehiclePreview } from './VehiclePreview';

interface BikePreviewProps {
  data: Record<string, any>; // Use Record<string, any> instead of specific shape
  images: {
    main: string;
    gallery?: string[];
    colors: string[];
  };
}

export const BikePreview: React.FC<BikePreviewProps> = ({ data, images }) => {
  // Make sure we use the placeholder if no main image
  const finalImages = {
    ...images,
    main: images.main || '/placeholder.svg',
    gallery: images.gallery || [],
    colors: images.colors || []
  };
  
  const finalData = {
    ...DEFAULT_BIKE_DATA,
    ...data
  };

  return (
    <VehiclePreview 
      data={finalData}
      type="bike"
      images={finalImages}
    />
  );
};
