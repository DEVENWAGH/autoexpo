"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useLoanStore } from "@/store/loanStore";
import { nanoid } from "nanoid";

export default function Calculator() {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    monthlyPayment,
    totalPayment,
    totalInterest,
    downPayment,
    isYearly,
    setLoanAmount,
    setInterestRate,
    setLoanTerm,
    setDownPayment,
    toggleIsYearly,
    calculateLoan,
  } = useLoanStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, downPayment, calculateLoan]);

  const pieData = [
    { name: "Principal", value: loanAmount - downPayment, id: nanoid() },
    { name: "Interest", value: totalInterest, id: nanoid() },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="min-h-screen w-full relative bg-gray-900 overflow-hidden">
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <div className="w-3/4 bg-slate-900 bg-opacity-80 p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Auto Loan Calculator
          </h1>

          <div className="grid grid-cols-2 gap-4">
            {/* Loan Details */}
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
                  <input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="bg-gray-700 text-white w-full p-2 rounded"
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
                  <input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="bg-gray-700 text-white w-full p-2 rounded"
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
                  <input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="bg-gray-700 text-white w-full p-2 rounded"
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
                    Loan Term ({isYearly ? "years" : "months"})
                  </label>
                  <input
                    id="loanTerm"
                    type="number"
                    value={isYearly ? loanTerm / 12 : loanTerm}
                    onChange={(e) =>
                      setLoanTerm(
                        isYearly
                          ? Number(e.target.value) * 12
                          : Number(e.target.value)
                      )
                    }
                    className="bg-gray-700 text-white w-full p-2 rounded"
                  />
                  <input
                    type="range"
                    min={isYearly ? "1" : "12"}
                    max={isYearly ? "7" : "84"}
                    step={isYearly ? "1" : "12"}
                    value={isYearly ? loanTerm / 12 : loanTerm}
                    onChange={(e) =>
                      setLoanTerm(
                        isYearly
                          ? Number(e.target.value) * 12
                          : Number(e.target.value)
                      )
                    }
                    className="w-full mt-2"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => toggleIsYearly()}
                      className="bg-purple-500 text-white px-4 py-2 rounded"
                    >
                      {isYearly ? "Switch to Months" : "Switch to Years"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 shadow-xl relative">
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

                {isClient && (
                  <div className="absolute top-8 right-[8rem]">
                    <PieChart width={200} height={200}>
                      <Pie
                        data={pieData}
                        cx={100}
                        cy={100}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.id}
                            fill={entry.name === "Principal" ? COLORS[0] : COLORS[1]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="absolute inset-0 top-21 right-[-.5rem] text-center text-purple-500">
                      <div className="text-sm">Principal</div>
                      <div className="font-semibold">
                        {totalPayment === 0
                          ? "0%"
                          : (
                              ((loanAmount - downPayment) / totalPayment) *
                              100
                            ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {pieData.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: entry.name === "Principal" ? COLORS[0] : COLORS[1]
                        }}
                      />
                      <span className="text-sm text-white">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
