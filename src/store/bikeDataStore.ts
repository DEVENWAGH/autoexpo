"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BikeBrand {
  name: string;
  models: string[];
}

export interface BikeTypeCount {
  type: string;
  count: number;
}

export interface BikeModel {
  _id: string;
  basicInfo: {
    brand: string;
    name: string;
    bikeType?: string;
    priceExshowroom: number;
    variant?: string;
  };
  engineTransmission?: {
    engineType?: string;
  };
  images?: {
    main: string[];
    gallery?: string[];
    color?: string[];
  };
  minPrice?: number;
  maxPrice?: number;
  basePrice?: number;
  topPrice?: number;
}

interface BikeDataState {
  bikes: BikeModel[];
  brands: BikeBrand[];
  bikeTypes: BikeTypeCount[];
  isLoading: boolean;
  error: string | null;
  fetchBikes: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  filterBikes: (filters: {
    brand?: string;
    model?: string;
    type?: string;
    budget?: string;
    minPrice?: number;
    maxPrice?: number;
    engineType?: string;
  }) => BikeModel[];
}

// Helper to parse budget ranges
const getBudgetRange = (budget: string): { min: number; max: number } => {
  if (budget.includes("Under")) {
    const max = parseInt(budget.match(/\d+/)?.[0] || "1") * 100000;
    return { min: 0, max };
  } else if (budget.includes("Above")) {
    const min = parseInt(budget.match(/\d+/)?.[0] || "5") * 100000;
    return { min, max: Number.MAX_SAFE_INTEGER };
  } else {
    const values = budget.match(/\d+/g) || ["1", "2"];
    return {
      min: parseInt(values[0]) * 100000,
      max: parseInt(values[1]) * 100000,
    };
  }
};

export const useBikeDataStore = create<BikeDataState>()(
  persist(
    (set, get) => ({
      bikes: [],
      brands: [],
      bikeTypes: [],
      isLoading: false,
      error: null,
      
      fetchBikes: async () => {
        // Don't fetch if we're already loading or have bikes
        if (get().isLoading || get().bikes.length > 0) {
          return;
        }
        
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/bikes/filter");
          if (!response.ok) {
            throw new Error("Failed to fetch bikes");
          }
          
          const data = await response.json();
          if (data && data.bikes && Array.isArray(data.bikes)) {
            set({ bikes: data.bikes });
            
            // Count bike types
            const typeCount: Record<string, number> = {};
            data.bikes.forEach((bike: BikeModel) => {
              const type = bike.basicInfo?.bikeType || "Other";
              typeCount[type] = (typeCount[type] || 0) + 1;
            });
            
            const bikeTypes = Object.entries(typeCount).map(([type, count]) => ({ 
              type, count 
            }));
            
            set({ bikeTypes });
          } else {
            throw new Error("Invalid data format received from the server");
          }
        } catch (error) {
          console.error("Error fetching bikes:", error);
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
          const response = await fetch('/api/brands?type=bikes');
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
      
      filterBikes: (filters) => {
        const { bikes } = get();
        
        return bikes.filter((bike) => {
          // Brand filter
          if (filters.brand && bike.basicInfo.brand !== filters.brand) {
            return false;
          }
          
          // Model filter
          if (filters.model && bike.basicInfo.name !== filters.model) {
            return false;
          }
          
          // Type filter
          if (filters.type && bike.basicInfo.bikeType !== filters.type) {
            return false;
          }
          
          // Budget filter
          if (filters.budget) {
            const { min, max } = getBudgetRange(filters.budget);
            const price = bike.basicInfo.priceExshowroom;
            if (price < min || price > max) {
              return false;
            }
          }
          
          // Custom price range filter
          if (filters.minPrice && bike.basicInfo.priceExshowroom < filters.minPrice) {
            return false;
          }
          if (filters.maxPrice && bike.basicInfo.priceExshowroom > filters.maxPrice) {
            return false;
          }
          
          // Engine type filter
          if (filters.engineType && bike.engineTransmission?.engineType !== filters.engineType) {
            return false;
          }
          
          return true;
        });
      },
    }),
    {
      name: "bike-data-store",
      partialize: (state) => ({ 
        bikes: state.bikes,
        brands: state.brands,
        bikeTypes: state.bikeTypes
      }),
      // Make sure to merge the items from storage properly
      merge: (persisted, current) => {
        return {
          ...current,
          bikes: persisted.bikes || [],
          brands: persisted.brands || [],
          bikeTypes: persisted.bikeTypes || [],
        };
      }
    }
  )
);
