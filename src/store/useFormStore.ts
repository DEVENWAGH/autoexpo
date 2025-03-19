"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormState {
  errors: {
    email?: string;
    password?: string;
    general?: string;
    [key: string]: string | undefined;
  };
  formData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: any;
  };
  setError: (field: string, message: string) => void;
  setFormData: (data: Record<string, any>) => void;
  clearErrors: () => void;
  clearFormData: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      errors: {},
      formData: {},
      setError: (field, message) => 
        set((state) => ({
          errors: { ...state.errors, [field]: message }
        })),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      clearErrors: () => set({ errors: {} }),
      clearFormData: () => set({ formData: {} }),
    }),
    {
      name: 'form-store',
      partialize: (state) => ({
        formData: state.formData,
      }),
      // Enable hydration
      skipHydration: false
    }
  )
);
