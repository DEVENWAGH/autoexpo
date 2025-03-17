"use client";

import { create } from "zustand";
import { FormState } from "@/types/vehicle";
import { persist } from "zustand/middleware";

interface CarStore {
  formState: FormState;
  mainImages: string[];
  interiorImages: string[];
  exteriorImages: string[];
  colorImages: string[];
  isSubmitting: boolean;
  error: string;
  
  updateFormSection: (section: string, data: any) => void;
  setMainImages: (images: string[]) => void;
  setInteriorImages: (images: string[]) => void;
  setExteriorImages: (images: string[]) => void;
  setColorImages: (images: string[]) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  formState: {},
  mainImages: [],
  interiorImages: [],
  exteriorImages: [],
  colorImages: [],
  isSubmitting: false,
  error: '',
};

// Function to handle form validation using React Hook Form
export const useCarForm = () => {
  // This is a placeholder function that will be replaced with actual implementation
  return {
    handleSubmit: (callback: any) => (e: any) => {
      e.preventDefault();
      callback();
    },
    register: () => ({}),
    formState: { errors: {} },
    watch: () => ({}),
    setValue: () => {},
    getValues: () => ({}),
    reset: () => {},
    customSetValue: () => {},
  };
};

export const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateFormSection: (section, data) => set((state) => {
        // Deep clone the current section state
        const currentSectionData = { ...(state.formState[section] || {}) };
        
        // Merge in the new data, ensuring boolean values are properly handled for all sections
        Object.entries(data).forEach(([key, value]) => {
          // Explicitly set boolean values for checkbox fields
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
      setColorImages: (images) => set({ colorImages: images }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setError: (error) => set({ error }),
      reset: () => set(initialState)
    }),
    {
      name: 'car-store',
    }
  )
);
