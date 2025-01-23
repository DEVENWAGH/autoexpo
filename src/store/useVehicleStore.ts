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
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [
    {
      id: 1,
      image: "/vehicles/tata-nexon.jpg",
      name: "Tata Nexon EV",
      priceRange: "₹14.74 - 19.94 Lakh",
      isFavorite: false,
    },
    {
      id: 2,
      image: "/vehicles/mg-zs.jpg",
      name: "MG ZS EV",
      priceRange: "₹18.98 - 25.08 Lakh",
      isFavorite: false,
    },
    {
      id: 3,
      image: "/vehicles/kia-ev6.jpg",
      name: "Kia EV6",
      priceRange: "₹60.95 - 65.95 Lakh",
      isFavorite: false,
    },
    {
      id: 4,
      image: "/vehicles/hyundai-ioniq.jpg",
      name: "Hyundai IONIQ 5",
      priceRange: "₹44.95 - 45.95 Lakh",
      isFavorite: false,
    },
  ],
  loading: false,
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
}));
