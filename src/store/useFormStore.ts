import { create } from 'zustand';

interface FormState {
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  formData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  setError: (field: keyof FormState['errors'], message: string) => void;
  setFormData: (data: Partial<FormState['formData']>) => void;
  clearErrors: () => void;
  clearFormData: () => void;
}

export const useFormStore = create<FormState>((set) => ({
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
}));
