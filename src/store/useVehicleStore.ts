"use client";

import { create } from "zustand";
import { ICar } from "@/models/Car";
import { IBike } from "@/models/Bike";

interface VehicleStore {
  vehicleType: 'cars' | 'bikes';
  formData: Partial<ICar | IBike>;
  mainImages: string[];
  interiorImages: string[];
  exteriorImages: string[];
  colorImages: string[];
  galleryImages: string[];
  loading: boolean;
  error: string;
  
  setVehicleType: (type: 'cars' | 'bikes') => void;
  updateFormData: (data: Partial<ICar | IBike>) => void;
  setMainImages: (images: string[]) => void;
  setInteriorImages: (images: string[]) => void;
  setExteriorImages: (images: string[]) => void;
  setColorImages: (images: string[]) => void;
  setGalleryImages: (images: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  vehicleType: 'cars' as const,
  formData: {},
  mainImages: [],
  interiorImages: [],
  exteriorImages: [],
  colorImages: [],
  galleryImages: [],
  loading: false,
  error: '',
};

export const useVehicleStore = create<VehicleStore>((set) => ({
  ...initialState,
  setVehicleType: (type) => set({ vehicleType: type }),
  updateFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  setMainImages: (images) => set({ mainImages: images }),
  setInteriorImages: (images) => set({ interiorImages: images }),
  setExteriorImages: (images) => set({ exteriorImages: images }),
  setColorImages: (images) => set({ colorImages: images }),
  setGalleryImages: (images) => set({ galleryImages: images }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState)
}));
