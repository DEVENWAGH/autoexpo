"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoanStore {
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  
  setLoanAmount: (amount: number) => void;
  setDownPayment: (amount: number) => void;
  setInterestRate: (rate: number) => void;
  setLoanTerm: (term: number) => void;
  reset: () => void;
}

const initialState = {
  loanAmount: 1000000,
  downPayment: 200000,
  interestRate: 8.5,
  loanTerm: 60, // 5 years in months
};

export const useLoanStore = create<LoanStore>()(
  persist(
    (set) => ({
      ...initialState,
      setLoanAmount: (amount) => set({ loanAmount: amount }),
      setDownPayment: (amount) => set({ downPayment: amount }),
      setInterestRate: (rate) => set({ interestRate: rate }),
      setLoanTerm: (term) => set({ loanTerm: term }),
      reset: () => set(initialState)
    }),
    {
      name: 'loan-calculator',
      partialize: (state) => ({
        loanAmount: state.loanAmount,
        downPayment: state.downPayment,
        interestRate: state.interestRate,
        loanTerm: state.loanTerm
      }),
      // Enable hydration
      skipHydration: false
    }
  )
);
