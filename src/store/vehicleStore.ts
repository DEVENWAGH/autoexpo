"use client";

import { create } from "zustand";
import { FormState } from "@/types/vehicle";
import { persist } from "zustand/middleware";

type VehicleType = 'cars' | 'bikes';

interface VehicleStore {
  vehicleType: VehicleType;
  formState: FormState;
  mainImages: string[];
  interiorImages: string[];
  exteriorImages: string[];
  galleryImages: string[];
  colorImages: string[];
  error: string;
  
  setVehicleType: (type: VehicleType) => void;
  updateFormSection: (section: string, data: any) => void;
  setMainImages: (images: string[]) => void;
  setInteriorImages: (images: string[]) => void;
  setExteriorImages: (images: string[]) => void;
  setGalleryImages: (images: string[]) => void;
  setColorImages: (images: string[]) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  vehicleType: 'cars' as VehicleType,
  formState: {},
  mainImages: [],
  interiorImages: [],
  exteriorImages: [],
  galleryImages: [],
  colorImages: [],
  error: '',
};

// Common placeholder texts - keep as is, our components will handle display correctly
export const CAR_PLACEHOLDERS = {
  name: "New Model",
  brand: "",
  variant: "Base",
  launchYear: new Date().getFullYear().toString(),
  priceExshowroom: "850000",
  pros: "Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride",
  cons: "Average Performance\nBasic Infotainment System\nLimited Color Options",
};

export const BIKE_PLACEHOLDERS = {
  name: "Street Fighter",
  brand: "",
  variant: "Base", 
  launchYear: new Date().getFullYear().toString(),
  priceExshowroom: "120000",
  pros: "Excellent Mileage\nEasy Handling\nAffordable Maintenance\nSporty Look",
  cons: "Limited Power\nBasic Features\nAverage Build Quality",
};

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      ...initialState,
      setVehicleType: (type) => set({ vehicleType: type }),
      updateFormSection: (section, data) => set((state) => {
        // Always preserve existing data by deep cloning the section
        const currentSectionData = { ...(state.formState[section] || {}) };
        
        // Merge new data into the existing data
        Object.entries(data).forEach(([key, value]) => {
          // Handle special case conversions if needed
          currentSectionData[key] = value;
        });
        
        return {
          formState: {
            ...state.formState,
            [section]: currentSectionData
          }
        };
      }),
      setMainImages: (images) => set({ mainImages: images }),
      setInteriorImages: (images) => set({ interiorImages: images }),
      setExteriorImages: (images) => set({ exteriorImages: images }),
      setGalleryImages: (images) => set({ galleryImages: images }),
      setColorImages: (images) => set({ colorImages: images }),
      setError: (error) => set({ error }),
      reset: () => set(initialState)
    }),
    {
      name: 'vehicle-store',
      partialize: (state) => ({
        vehicleType: state.vehicleType,
        formState: state.formState,
        mainImages: state.mainImages,
        interiorImages: state.interiorImages,
        exteriorImages: state.exteriorImages,
        galleryImages: state.galleryImages,
        colorImages: state.colorImages
      }),
      // Make sure to hydrate the store from localStorage
      skipHydration: false
    }
  )
);

// Update if there's any form state cleaning that needs to handle these fields
export const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateFormSection: (section, data) => set((state) => {
        // Preserve existing data by deep cloning the section
        const currentSectionData = { ...(state.formState[section] || {}) };
        
        // Clean up removed fields if they're accidentally provided
        if (section === "internetFeatures") {
          // Remove any connectedCarApp or additionalConnectedFeatures properties
          const { connectedCarApp, additionalConnectedFeatures, ...cleanedData } = data;
          Object.entries(cleanedData).forEach(([key, value]) => {
            currentSectionData[key] = value;
          });
        } else if (section === "adasFeatures") {
          // Remove any adasSystemName or additionalADASFeatures properties
          const { adasSystemName, additionalADASFeatures, ...cleanedData } = data;
          Object.entries(cleanedData).forEach(([key, value]) => {
            currentSectionData[key] = value;
          });
        } else {
          // For other sections, proceed normally
          Object.entries(data).forEach(([key, value]) => {
            currentSectionData[key] = value;
          });
        }
        
        return {
          formState: {
            ...state.formState,
            [section]: currentSectionData
          }
        };
      }),
      // ...existing code...
    }),
    // ...existing code...
  )
);
