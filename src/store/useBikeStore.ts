"use client";

import { create } from "zustand";
import { FormState } from "@/types/vehicle";
import { persist } from "zustand/middleware";

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

export const useBikeStore = create<BikeStore>()(
  persist(
    (set) => ({
      ...initialState,
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
      setGalleryImages: (images) => set({ galleryImages: images }),
      setColorImages: (images) => set({ colorImages: images }),
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setError: (error) => set({ error }),
      reset: () => set(initialState)
    }),
    {
      name: 'bike-store',
    }
  )
);
