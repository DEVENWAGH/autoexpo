"use client";

import { create } from "zustand";
import { FormState } from "@/types/vehicle";
import { persist } from "zustand/middleware";
import { useForm, UseFormReturn } from "react-hook-form";
import { vehicleService } from "@/services/vehicleService";

interface BikeStore {
  formState: FormState;
  mainImages: string[];
  galleryImages: string[];
  colorImages: string[];
  isSubmitting: boolean;
  error: string;
  
  updateFormSection: (section: string, data: any) => void;
  setMainImages: (images: string[]) => void;
  setGalleryImages: (images: string[]) => void;
  setColorImages: (images: string[]) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  formState: {},
  mainImages: [],
  galleryImages: [],
  colorImages: [],
  isSubmitting: false,
  error: '',
};

// Create the bike store with persistence
export const useBikeStore = create<BikeStore>()(
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
      setGalleryImages: (images) => set({ galleryImages: images }),
      setColorImages: (images) => set({ colorImages: images }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setError: (error) => set({ error }),
      reset: () => set(initialState)
    }),
    {
      name: 'bike-store',
      partialize: (state) => ({
        formState: state.formState,
        mainImages: state.mainImages,
        galleryImages: state.galleryImages,
        colorImages: state.colorImages
      }),
      skipHydration: false
    }
  )
);

// Hook to provide react-hook-form integration with the bike store
export const useBikeForm = (): UseFormReturn & {
  customSetValue: (section: string, field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
} => {
  const formState = useBikeStore((state) => state.formState);
  const updateFormSection = useBikeStore((state) => state.updateFormSection);
  const setIsSubmitting = useBikeStore((state) => state.setIsSubmitting);
  const setError = useBikeStore((state) => state.setError);
  const mainImages = useBikeStore((state) => state.mainImages);
  const galleryImages = useBikeStore((state) => state.galleryImages); 
  const colorImages = useBikeStore((state) => state.colorImages);
  const reset = useBikeStore((state) => state.reset);

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
      formData.append("vehicleType", "bikes");

      // Add form state as JSON
      Object.entries(formState).forEach(([section, data]) => {
        formData.append(section, JSON.stringify(data));
      });

      // Add images
      mainImages.forEach((img) => formData.append("mainImages", img));
      galleryImages.forEach((img) => formData.append("galleryImages", img));
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
