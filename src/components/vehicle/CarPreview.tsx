import React from 'react';
import { DEFAULT_CAR_DATA } from '@/store/vehicleStore';
import { VehiclePreview } from './VehiclePreview';

interface CarPreviewProps {
  data: Record<string, any>; // Use Record<string, any> instead of specific shape
  images: {
    main: string;
    interior?: string[];
    exterior?: string[];
    colors: string[];
  };
}

export const CarPreview: React.FC<CarPreviewProps> = ({ data, images }) => {
  // Make sure we use the placeholder if no main image
  const finalImages = {
    ...images,
    main: images.main || '/placeholder.svg',
    interior: images.interior || [],
    exterior: images.exterior || [],
    colors: images.colors || []
  };
  
  const finalData = {
    ...DEFAULT_CAR_DATA,
    ...data
  };

  return (
    <VehiclePreview 
      data={finalData}
      type="car"
      images={finalImages}
    />
  );
};
