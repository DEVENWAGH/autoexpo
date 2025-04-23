"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CarBrand {
  name: string;
  models: string[];
}

export interface CarTypeCount {
  type: string;
  count: number;
}

export interface CarModel {
  _id: string;
  basicInfo: {
    brand: string;
    name: string;
    carType?: string;
    priceExshowroom: number;
    variant?: string;
  };
  fuelPerformance?: {
    fuelType?: string;
  };
  images?: {
    main: string[];
    interior?: string[];
    exterior?: string[];
  };
  minPrice?: number;
  maxPrice?: number;
  basePrice?: number;
  topPrice?: number;
}

interface CarDataState {
  cars: CarModel[];
  brands: CarBrand[];
  carTypes: CarTypeCount[];
  isLoading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  filterCars: (filters: {
    brand?: string;
    model?: string;
    type?: string;
    budget?: string;
    minPrice?: number;
    maxPrice?: number;
    fuelType?: string;
  }) => CarModel[];
}

// Helper to parse budget ranges
const getBudgetRange = (budget: string): { min: number; max: number } => {
  if (budget.includes("Under")) {
    const max = parseInt(budget.match(/\d+/)?.[0] || "5") * 100000;
    return { min: 0, max };
  } else if (budget.includes("Above")) {
    const min = parseInt(budget.match(/\d+/)?.[0] || "50") * 100000;
    return { min, max: Number.MAX_SAFE_INTEGER };
  } else {
    const values = budget.match(/\d+/g) || ["5", "10"];
    return {
      min: parseInt(values[0]) * 100000,
      max: parseInt(values[1]) * 100000,
    };
  }
};

export const useCarDataStore = create<CarDataState>()(
  persist(
    (set, get) => ({
      cars: [],
      brands: [],
      carTypes: [],
      isLoading: false,
      error: null,

      fetchCars: async () => {
        // Only check if we're currently loading
        if (get().isLoading) {
          return;
        }
        
        set({ isLoading: true, error: null });
        try {
          // Use the vehicles endpoint to fetch all cars
          const response = await fetch("/api/vehicles/my-vehicles");
          if (!response.ok) {
            throw new Error("Failed to fetch cars");
          }
          
          const data = await response.json();
          if (data && data.cars && Array.isArray(data.cars)) {
            set({ cars: data.cars });
            
            // Count car types
            const typeCount: Record<string, number> = {};
            data.cars.forEach((car: CarModel) => {
              const type = car.basicInfo?.carType || "Other";
              typeCount[type] = (typeCount[type] || 0) + 1;
            });
            
            const carTypes = Object.entries(typeCount).map(([type, count]) => ({ 
              type, count 
            }));
            
            set({ carTypes });
          } else {
            throw new Error("Invalid data format received from the server");
          }
        } catch (error) {
          console.error("Error fetching cars:", error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchBrands: async () => {
        // Don't fetch if we're already loading or have brands
        if (get().isLoading || get().brands.length > 0) {
          return;
        }
        
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/brands?type=cars');
          if (!response.ok) {
            throw new Error("Failed to fetch brands");
          }
          
          const data = await response.json();
          set({ brands: data.brands || [] });
        } catch (error) {
          console.error("Error fetching brands:", error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      filterCars: (filters) => {
        const { cars } = get();
        
        return cars.filter((car) => {
          // Brand filter - Add logging for debugging
          if (filters.brand && car.basicInfo.brand !== filters.brand) {
            console.debug(`Filtering out: ${car.basicInfo.brand} != ${filters.brand}`);
            return false;
          }

          // Model filter
          if (filters.model && car.basicInfo.name !== filters.model) {
            return false;
          }

          // Type filter
          if (filters.type && car.basicInfo.carType !== filters.type) {
            return false;
          }

          // Budget filter
          if (filters.budget) {
            const { min, max } = getBudgetRange(filters.budget);
            const price = car.basicInfo.priceExshowroom;
            if (price < min || price > max) {
              return false;
            }
          }

          // Custom price range filter
          if (filters.minPrice && car.basicInfo.priceExshowroom < filters.minPrice) {
            return false;
          }
          if (filters.maxPrice && car.basicInfo.priceExshowroom > filters.maxPrice) {
            return false;
          }

          // Fuel type filter
          if (filters.fuelType && car.fuelPerformance?.fuelType !== filters.fuelType) {
            return false;
          }

          return true;
        });
      },
    }),
    {
      name: "car-data-store",
      partialize: (state) => ({
        cars: state.cars,
        brands: state.brands,
        carTypes: state.carTypes,
      }),
      // Make sure to merge the items from storage properly
      merge: (persisted, current) => {
        return {
          ...current,
          cars: persisted.cars || [],
          brands: persisted.brands || [],
          carTypes: persisted.carTypes || [],
        };
      },
    }
  )
);
