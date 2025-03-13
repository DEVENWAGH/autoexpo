"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { useLoanStore } from "@/store/loanStore";
import { nanoid } from "nanoid";
import { useTheme } from "next-themes";

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

  // Theme handling
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);

  // Theme-aware styles
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const pageBackgroundClass = isDark ? "bg-black/95" : "bg-gray-100";

  const containerClass = isDark
    ? "bg-gray-900/80 border-gray-800"
    : "bg-white/90 border-gray-200";

  const cardClass = isDark
    ? "bg-gray-900 border-gray-800"
    : "bg-gray-50 border-gray-200";

  const headingClass = isDark ? "text-white" : "text-gray-900";

  const subHeadingClass = isDark ? "text-gray-300" : "text-gray-700";

  const labelClass = isDark ? "text-gray-300" : "text-gray-700";

  const inputClass = isDark
    ? "bg-gray-800 text-white border-gray-700"
    : "bg-white text-gray-800 border-gray-300";

  const buttonClass = isDark
    ? "bg-purple-700 hover:bg-purple-600 text-white"
    : "bg-purple-600 hover:bg-purple-700 text-white";

  const accentTextClass = isDark ? "text-purple-400" : "text-purple-600";

  const breakdownSectionClass = isDark ? "bg-purple-900/20" : "bg-purple-100";

  const secondaryTextClass = isDark ? "text-gray-400" : "text-gray-600";

  // Chart colors
  const COLORS = isDark
    ? ["#9333ea", "#fb923c"] // Dark theme colors
    : ["#8b5cf6", "#f97316"]; // Light theme colors

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

  return (
    <div
      className={`min-h-screen w-full relative ${pageBackgroundClass} overflow-hidden transition-colors duration-300`}
    >
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <div
          className={`w-full max-w-6xl ${containerClass} p-6 md:p-8 rounded-lg shadow-xl border transition-colors duration-300`}
        >
          <h1
            className={`text-2xl md:text-3xl font-bold ${headingClass} mb-6 text-center transition-colors duration-300`}
          >
            Auto Loan Calculator
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Loan Details */}
            <div
              className={`${cardClass} p-4 rounded-lg border shadow-md transition-colors duration-300`}
            >
              <h2
                className={`text-xl font-semibold ${headingClass} mb-4 transition-colors duration-300`}
              >
                Loan Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="loanAmount"
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
                  >
                    Loan Amount (₹)
                  </label>
                  <input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className={`${inputClass} w-full p-2 rounded transition-colors duration-300`}
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
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
                  >
                    Down Payment (₹)
                  </label>
                  <input
                    id="downPayment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className={`${inputClass} w-full p-2 rounded transition-colors duration-300`}
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
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
                  >
                    Interest Rate (%)
                  </label>
                  <input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className={`${inputClass} w-full p-2 rounded transition-colors duration-300`}
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
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
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
                    className={`${inputClass} w-full p-2 rounded transition-colors duration-300`}
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
                      className={`${buttonClass} px-4 py-2 rounded transition-all duration-300`}
                    >
                      {isYearly ? "Switch to Months" : "Switch to Years"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Summary */}
            <div
              className={`${cardClass} p-4 rounded-lg border shadow-md relative transition-colors duration-300`}
            >
              <h2
                className={`text-xl font-semibold ${headingClass} mb-4 transition-colors duration-300`}
              >
                Loan Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="monthlyPayment"
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
                  >
                    Monthly Payment
                  </label>
                  <div
                    id="monthlyPayment"
                    className={`text-2xl md:text-3xl font-bold ${accentTextClass} transition-colors duration-300`}
                  >
                    {formatIndianNumber(monthlyPayment)}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="totalPayment"
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
                  >
                    Total Payment
                  </label>
                  <div
                    id="totalPayment"
                    className={`text-xl md:text-2xl font-semibold ${accentTextClass} transition-colors duration-300`}
                  >
                    {formatIndianNumber(totalPayment)}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="totalInterest"
                    className={`block text-sm font-medium ${labelClass} mb-2 transition-colors duration-300`}
                  >
                    Total Interest
                  </label>
                  <div
                    id="totalInterest"
                    className={`text-xl md:text-2xl font-semibold ${accentTextClass} transition-colors duration-300`}
                  >
                    {formatIndianNumber(totalInterest)}
                  </div>
                </div>

                <div
                  className={`mt-6 p-4 ${breakdownSectionClass} rounded-lg transition-colors duration-300`}
                >
                  <h3
                    className={`text-lg font-medium ${subHeadingClass} mb-2 transition-colors duration-300`}
                  >
                    Payment Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p
                        className={`text-sm ${secondaryTextClass} transition-colors duration-300`}
                      >
                        Down Payment
                      </p>
                      <p
                        className={`text-lg font-medium ${headingClass} transition-colors duration-300`}
                      >
                        {formatIndianNumber(downPayment)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${secondaryTextClass} transition-colors duration-300`}
                      >
                        Principal
                      </p>
                      <p
                        className={`text-lg font-medium ${headingClass} transition-colors duration-300`}
                      >
                        {formatIndianNumber(loanAmount - downPayment)}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${secondaryTextClass} transition-colors duration-300`}
                      >
                        Interest
                      </p>
                      <p
                        className={`text-lg font-medium ${headingClass} transition-colors duration-300`}
                      >
                        {formatIndianNumber(totalInterest)}
                      </p>
                    </div>
                  </div>
                </div>

                {isClient && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative">
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
                              fill={
                                entry.name === "Principal"
                                  ? COLORS[0]
                                  : COLORS[1]
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className={`text-sm ${accentTextClass} transition-colors duration-300`}
                        >
                          Principal
                        </div>
                        <div
                          className={`font-semibold ${accentTextClass} transition-colors duration-300`}
                        >
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
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {pieData.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            entry.name === "Principal" ? COLORS[0] : COLORS[1],
                        }}
                      />
                      <span
                        className={`text-sm ${headingClass} transition-colors duration-300`}
                      >
                        {entry.name}
                      </span>
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
