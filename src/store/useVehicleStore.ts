"use client";

import { create } from "zustand";

interface Vehicle {
  id: number;
  image: string;
  name: string;
  priceRange: string;
  isFavorite?: boolean;
}

interface VehicleStore {
  vehicles: Vehicle[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  toggleFavorite: (id: number) => void;
  vehicleType: 'cars' | 'bikes';
  mainImages: string[];
  interiorImages: string[];
  exteriorImages: string[];
  colorImages: string[];
  galleryImages: string[];
  error: string;
  
  setVehicleType: (type: 'cars' | 'bikes') => void;
  setMainImages: (images: string[]) => void;
  setInteriorImages: (images: string[]) => void;
  setExteriorImages: (images: string[]) => void;
  setColorImages: (images: string[]) => void;
  setGalleryImages: (images: string[]) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  vehicleType: 'cars' as const,
  mainImages: [],
  interiorImages: [],
  exteriorImages: [],
  colorImages: [],
  galleryImages: [],
  loading: false,
  error: '',
};

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [
    {
      id: 1,
      image: "placeholder.svg",
      name: "Tata Nexon EV",
      priceRange: "₹14.74 - 19.94 Lakh",
      isFavorite: false,
    },
    {
      id: 2,
      image: "placeholder.svg",
      name: "MG ZS EV",
      priceRange: "₹18.98 - 25.08 Lakh",
      isFavorite: false,
    },
    {
      id: 3,
      image: "placeholder.svg",
      name: "Kia EV6",
      priceRange: "₹60.95 - 65.95 Lakh",
      isFavorite: false,
    },
    {
      id: 4,
      image: "placeholder.svg",
      name: "Hyundai IONIQ 5",
      priceRange: "₹44.95 - 45.95 Lakh",
      isFavorite: false,
    },
  ],
  ...initialState,
  setLoading: (loading) => set({ loading }),
  setVehicles: (vehicles) => set({ vehicles }),
  toggleFavorite: (id) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, isFavorite: !vehicle.isFavorite }
          : vehicle
      ),
    })),
  setVehicleType: (type) => set({ vehicleType: type }),
  setMainImages: (images) => set({ mainImages: images }),
  setInteriorImages: (images) => set({ interiorImages: images }),
  setExteriorImages: (images) => set({ exteriorImages: images }),
  setColorImages: (images) => set({ colorImages: images }),
  setGalleryImages: (images) => set({ galleryImages: images }),
  setError: (error) => set({ error }),
  reset: () => set(initialState)
}));
