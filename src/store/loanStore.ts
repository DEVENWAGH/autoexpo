import { create } from 'zustand';

interface LoanState {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  downPayment: number;
  isYearly: boolean;
  setLoanAmount: (amount: number) => void;
  setInterestRate: (rate: number) => void;
  setLoanTerm: (term: number) => void;
  setDownPayment: (amount: number) => void;
  toggleIsYearly: () => void;
  calculateLoan: () => void;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  loanAmount: 50000,
  interestRate: 8.5,
  loanTerm: 36,
  monthlyPayment: 0,
  totalPayment: 0,
  totalInterest: 0,
  downPayment: 10000,
  isYearly: true,

  setLoanAmount: (amount) => set({ loanAmount: amount }),
  setInterestRate: (rate) => set({ interestRate: rate }),
  setLoanTerm: (term) => set({ loanTerm: term }),
  setDownPayment: (amount) => set({ downPayment: amount }),
  toggleIsYearly: () => set((state) => ({ isYearly: !state.isYearly })),

  calculateLoan: () => {
    const { loanAmount, interestRate, loanTerm, downPayment } = get();
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm;

    const monthlyAmount =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalAmount = monthlyAmount * numberOfPayments;
    const interestAmount = totalAmount - principal;

    set({
      monthlyPayment: monthlyAmount,
      totalPayment: totalAmount + downPayment,
      totalInterest: interestAmount,
    });
  },
}));
