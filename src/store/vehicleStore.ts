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

// Common placeholder texts
export const CAR_PLACEHOLDERS = {
  name: "New Model",
  brand: "",
  variant: "Base",
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "1000000",
  priceExshowroom: "850000",
  pros: "Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride",
  cons: "Average Performance\nBasic Infotainment System\nLimited Color Options",
};

export const BIKE_PLACEHOLDERS = {
  name: "Street Fighter",
  brand: "",
  variant: "Base", 
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "150000",
  priceExshowroom: "120000",
  pros: "Excellent Mileage\nEasy Handling\nAffordable Maintenance\nSporty Look",
  cons: "Limited Power\nBasic Features\nAverage Build Quality",
};

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      ...initialState,
      setVehicleType: (type) => set({ vehicleType: type }),
      updateFormSection: (section, data) => set((state) => ({
        formState: {
          ...state.formState,
          [section]: {
            ...(state.formState[section] || {}),
            ...data
          }
        }
      })),
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
      })
    }
  )
);
