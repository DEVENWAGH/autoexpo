import React, { useState } from 'react';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface VehiclePreviewProps {
  data: Record<string, any>;
  type: 'car' | 'bike';
  images: {
    main: string;
    interior?: string[];
    exterior?: string[];
    gallery?: string[];
    colors: string[];
  };
}

export const VehiclePreview: React.FC<VehiclePreviewProps> = ({ data, type, images }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const { basicInfo } = data;
  
  // Extract common info
  const brand = basicInfo?.brand || 'Brand';
  const name = basicInfo?.name || 'Model Name';
  const priceEx = basicInfo?.priceExshowroom ? `₹${Number(basicInfo.priceExshowroom).toLocaleString('en-IN')}` : 'TBD';
  const priceOn = basicInfo?.priceOnroad ? `₹${Number(basicInfo.priceOnroad).toLocaleString('en-IN')}` : 'TBD';
  
  // Convert pros and cons from string to array
  const prosArray = basicInfo?.pros ? basicInfo.pros.split('\n').filter(Boolean) : [];
  const consArray = basicInfo?.cons ? basicInfo.cons.split('\n').filter(Boolean) : [];
  
  // Use main image or placeholder - don't use color images as fallbacks for main
  const mainImage = images.main || '/placeholder.svg';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with vehicle name and price */}
      <div className="p-6 bg-gray-50 border-b">
        <h2 className="text-2xl font-bold">{brand} {name}</h2>
        <div className="mt-2 flex flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500">Ex-Showroom Price</p>
            <p className="font-semibold">{priceEx}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">On-Road Price</p>
            <p className="font-semibold">{priceOn}</p>
          </div>
        </div>
      </div>
      
      {/* Main image display - only use the main image or placeholder */}
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        <Image 
          src={mainImage}
          alt={`${brand} ${name}`}
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Color options */}
      {images.colors.length > 0 && (
        <div className="p-4 border-t border-b">
          <p className="text-sm font-medium mb-2">Available Colors:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.colors.map((color, index) => (
              <button
                key={index}
                className={`w-12 h-12 rounded overflow-hidden border-2 ${selectedColor === index ? 'border-primary' : 'border-gray-200'}`}
                onClick={() => setSelectedColor(index)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={color}
                    alt={`Color ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 p-0 h-auto">
          <TabsTrigger value="overview" className="px-4 py-2 rounded-none">Overview</TabsTrigger>
          <TabsTrigger value="specifications" className="px-4 py-2 rounded-none">Specifications</TabsTrigger>
          <TabsTrigger value="colors" className="px-4 py-2 rounded-none">Colors</TabsTrigger>
          <TabsTrigger value="gallery" className="px-4 py-2 rounded-none">Gallery</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="p-4 space-y-6">
          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prosArray.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-green-600 mb-2">Pros</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {prosArray.map((pro, index) => (
                    <li key={index} className="text-sm">{pro}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {consArray.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-red-600 mb-2">Cons</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {consArray.map((con, index) => (
                    <li key={index} className="text-sm">{con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Key Specifications */}
          <div>
            <h3 className="font-semibold mb-2">Key Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {type === 'car' ? (
                <>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Engine</p>
                    <p className="text-sm font-medium">{data.engineTransmission?.engineType || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Fuel Type</p>
                    <p className="text-sm font-medium">{data.fuelPerformance?.fuelType || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="text-sm font-medium">{data.engineTransmission?.transmissionType || 'N/A'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Engine</p>
                    <p className="text-sm font-medium">{data.engineTransmission?.engineType || 'N/A'}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Displacement</p>
                    <p className="text-sm font-medium">{data.engineTransmission?.displacement || 'N/A'} cc</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500">Mileage</p>
                    <p className="text-sm font-medium">{data.mileageAndPerformance?.overallMileage || 'N/A'} kmpl</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Specifications Tab */}
        <TabsContent value="specifications" className="p-4 space-y-6">
          {/* Engine & Transmission */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Engine & Transmission</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div>
                <p className="text-xs text-gray-500">Engine Type</p>
                <p className="text-sm">{data.engineTransmission?.engineType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Displacement</p>
                <p className="text-sm">{data.engineTransmission?.displacement || 'N/A'} cc</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Power</p>
                <p className="text-sm">{data.engineTransmission?.maxPower || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Torque</p>
                <p className="text-sm">{data.engineTransmission?.maxTorque || 'N/A'}</p>
              </div>
              {type === 'car' && (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="text-sm">{data.engineTransmission?.transmissionType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gearbox</p>
                    <p className="text-sm">{data.engineTransmission?.gearbox || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Type-specific specifications */}
          {type === 'car' ? (
            <>
              {/* Fuel & Performance */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Fuel & Performance</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Fuel Type</p>
                    <p className="text-sm">{data.fuelPerformance?.fuelType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fuel Tank Capacity</p>
                    <p className="text-sm">{data.fuelPerformance?.fuelTankCapacity || 'N/A'} L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mileage</p>
                    <p className="text-sm">{data.fuelPerformance?.mileage || 'N/A'} kmpl</p>
                  </div>
                </div>
              </div>
              
              {/* Dimensions & Capacity */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Dimensions & Capacity</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Length</p>
                    <p className="text-sm">{data.dimensionsCapacity?.length || 'N/A'} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Width</p>
                    <p className="text-sm">{data.dimensionsCapacity?.width || 'N/A'} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Height</p>
                    <p className="text-sm">{data.dimensionsCapacity?.height || 'N/A'} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wheelbase</p>
                    <p className="text-sm">{data.dimensionsCapacity?.wheelBase || 'N/A'} mm</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mileage & Performance */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Mileage & Performance</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Overall Mileage</p>
                    <p className="text-sm">{data.mileageAndPerformance?.overallMileage || 'N/A'} kmpl</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Top Speed</p>
                    <p className="text-sm">{data.mileageAndPerformance?.topSpeed || 'N/A'} kmph</p>
                  </div>
                </div>
              </div>
              
              {/* Dimensions & Capacity */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Dimensions & Capacity</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Fuel Capacity</p>
                    <p className="text-sm">{data.dimensionsAndCapacity?.fuelCapacity || 'N/A'} L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Saddle Height</p>
                    <p className="text-sm">{data.dimensionsAndCapacity?.saddleHeight || 'N/A'} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ground Clearance</p>
                    <p className="text-sm">{data.dimensionsAndCapacity?.groundClearance || 'N/A'} mm</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        {/* Colors Tab - New tab for color variants */}
        <TabsContent value="colors" className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {images.colors.length > 0 ? (
              images.colors.map((color, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-md border">
                  <Image 
                    src={color} 
                    alt={`Color variant ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-black/50 text-white p-1 text-xs text-center">
                    Color {index + 1}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">No color variants available</p>
            )}
          </div>
        </TabsContent>
        
        {/* Gallery Tab - Show categorized images */}
        <TabsContent value="gallery" className="p-4">
          {type === 'car' ? (
            <>
              {/* Car-specific gallery sections */}
              {(images.interior && images.interior.length > 0) && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Interior</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.interior.map((image, index) => (
                      <div key={index} className="aspect-square relative overflow-hidden rounded-md border">
                        <Image 
                          src={image} 
                          alt={`Interior image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(images.exterior && images.exterior.length > 0) && (
                <div>
                  <h3 className="font-semibold mb-2">Exterior</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.exterior.map((image, index) => (
                      <div key={index} className="aspect-square relative overflow-hidden rounded-md border">
                        <Image 
                          src={image} 
                          alt={`Exterior image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!images.interior?.length && !images.exterior?.length) && (
                <p className="col-span-full text-center text-gray-500 py-8">No gallery images available</p>
              )}
            </>
          ) : (
            <>
              {/* Bike-specific gallery section */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(images.gallery && images.gallery.length > 0) ? (
                  images.gallery.map((image, index) => (
                    <div key={index} className="aspect-square relative overflow-hidden rounded-md border">
                      <Image 
                        src={image} 
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-8">No gallery images available</p>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
