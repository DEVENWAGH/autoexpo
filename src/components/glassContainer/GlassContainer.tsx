"use client";

import { Bruno_Ace } from "next/font/google";
import Card from "@/components/card/Card";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});

export default function GlassContainer() {
  const { vehicles = [], toggleFavorite } = useVehicleStore();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware styles
  const titleTextClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white"
      : "text-black";

  const containerGradient =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-gradient-to-r from-gray-800/20 to-gray-900/20 border-gray-700/30"
      : "bg-gradient-to-r from-gray-200/60 to-gray-300/60 border-gray-300/50";

  const viewAllClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white hover:text-blue-300"
      : "text-gray-800 hover:text-blue-700";

  return (
    <section className="my-12">
      <h2
        className={`${brunoFont.className} ${titleTextClass} mt-4 text-4xl md:text-5xl lg:text-6xl text-center mb-8`}
      >
        Latest Launched Ev&apos;s
      </h2>
      <div
        className={`mt-4 w-full rounded-[40px] backdrop-blur-xl border ${containerGradient}`}
      >
        <div className="h-full p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles && vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  {...vehicle}
                  onFavoriteClick={toggleFavorite}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No vehicles available at the moment.
              </div>
            )}
          </div>
          <button
            className={`mt-6 font-medium ${viewAllClass} transition duration-200 flex items-center`}
          >
            View All Upcoming Cars
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
