"use client";

import { create } from "zustand";
import { FormState } from "@/types/vehicle";
import { persist } from "zustand/middleware";
import { useForm, UseFormReturn } from "react-hook-form";
import { vehicleService } from "@/services/vehicleService";

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

// Create the car store with persistence
export const useCarStore = create<CarStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateFormSection: (section, data) => set((state) => {
        // Preserve existing data by deep cloning the section
        const currentSectionData = { ...(state.formState[section] || {}) };
        
        // Merge new data into the existing data
        Object.entries(data).forEach(([key, value]) => {
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
      partialize: (state) => ({
        formState: state.formState,
        mainImages: state.mainImages,
        interiorImages: state.interiorImages,
        exteriorImages: state.exteriorImages,
        colorImages: state.colorImages
      }),
      skipHydration: false
    }
  )
);

// Hook to provide react-hook-form integration with the car store
export const useCarForm = (): UseFormReturn & {
  customSetValue: (section: string, field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
} => {
  const formState = useCarStore((state) => state.formState);
  const updateFormSection = useCarStore((state) => state.updateFormSection);
  const setIsSubmitting = useCarStore((state) => state.setIsSubmitting);
  const setError = useCarStore((state) => state.setError);
  const mainImages = useCarStore((state) => state.mainImages);
  const interiorImages = useCarStore((state) => state.interiorImages);
  const exteriorImages = useCarStore((state) => state.exteriorImages); 
  const colorImages = useCarStore((state) => state.colorImages);
  const reset = useCarStore((state) => state.reset);

  // Initialize react-hook-form with the store data
  const methods = useForm({
    defaultValues: formState,
  });

  // Custom setValue function to update both form and store
  const customSetValue = (section: string, field: string, value: any) => {
    methods.setValue(`${section}.${field}`, value);
    updateFormSection(section, { [field]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("vehicleType", "cars");

      // Add form state as JSON
      Object.entries(formState).forEach(([section, data]) => {
        formData.append(section, JSON.stringify(data));
      });

      // Add images
      mainImages.forEach((img) => formData.append("mainImages", img));
      interiorImages.forEach((img) => formData.append("interiorImages", img));
      exteriorImages.forEach((img) => formData.append("exteriorImages", img));
      colorImages.forEach((img) => formData.append("colorImages", img));

      // Submit data
      await vehicleService.createVehicle(formData);
      reset();
      window.location.href = "/brands/dashboard";
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...methods,
    customSetValue,
    handleSubmit,
  };
};
