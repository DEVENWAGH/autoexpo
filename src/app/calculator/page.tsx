"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function Calculator() {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(36);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(10000);

  const formatIndianNumber = (num: number) => {
    const formatted = num.toFixed(2);
    const [wholePart, decimalPart] = formatted.split(".");
    const lastThree = wholePart.slice(-3);
    const otherNumbers = wholePart.slice(0, -3);
    const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return (
      "₹" +
      (withCommas ? withCommas + "," + lastThree : lastThree) +
      "." +
      decimalPart
    );
  };

  useEffect(() => {
    const calculateLoan = () => {
      const principal = loanAmount - downPayment;
      const monthlyRate = interestRate / 12 / 100;
      const numberOfPayments = loanTerm;

      const monthlyAmount =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      const totalAmount = monthlyAmount * numberOfPayments;
      const interestAmount = totalAmount - principal;

      setMonthlyPayment(monthlyAmount);
      setTotalPayment(totalAmount + downPayment);
      setTotalInterest(interestAmount);
    };

    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, downPayment]);

  return (
    <div className="min-h-screen w-full relative">
      <Image
        src="/loan.svg"
        alt="Background"
        fill
        priority
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center",
          width: "100%",
          height: "100%",
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-1/2 min-h-screen flex items-center">
        <div className="w-full ml-4">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">
            Auto Loan Calculator
          </h1>

          <div className="grid grid-cols-2 gap-4">
            {/* Loan Details - more compact */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">
                Loan Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="loanAmount"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Loan Amount (₹)
                  </label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="downPayment"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Down Payment (₹)
                  </label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="interestRate"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Interest Rate (%)
                  </label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="bg-gray-700 text-white"
                    step="0.1"
                  />
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="loanTerm"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Loan Term (months)
                  </label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="bg-gray-700 text-white"
                  />
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="12"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Loan Summary - more compact */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">
                Loan Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="monthlyPayment"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Monthly Payment
                  </label>
                  <div
                    id="monthlyPayment"
                    className="text-3xl font-bold text-purple-500"
                  >
                    {formatIndianNumber(monthlyPayment)}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="totalPayment"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Total Payment
                  </label>
                  <div
                    id="totalPayment"
                    className="text-2xl font-semibold text-purple-400"
                  >
                    {formatIndianNumber(totalPayment)}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="totalInterest"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Total Interest
                  </label>
                  <div
                    id="totalInterest"
                    className="text-2xl font-semibold text-purple-400"
                  >
                    {formatIndianNumber(totalInterest)}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-purple-900/20 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-300 mb-2">
                    Payment Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Down Payment</p>
                      <p className="text-lg font-medium text-white">
                        {formatIndianNumber(downPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Principal</p>
                      <p className="text-lg font-medium text-white">
                        {formatIndianNumber(loanAmount - downPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Interest</p>
                      <p className="text-lg font-medium text-white">
                        {formatIndianNumber(totalInterest)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
