"use client";

import { Bruno_Ace } from "next/font/google";
import Card from "@/components/card/Card";
import { useVehicleStore } from "@/store/useVehicleStore";

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});

export default function GlassContainer() {
  const { vehicles, toggleFavorite } = useVehicleStore();

  return (
    <section>
      <h2 className={`${brunoFont.className} text-white mt-4 text-6xl flex item items-center justify-center`}>
        Latest Launched Ev&apos;s
      </h2>
      <div className="mt-4 w-full rounded-[40px] bg-gradient-to-r from-gray-500/20 to-gray-900/20 backdrop-blur-xl border border-gray-500/30">
        <div className="h-full p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                {...vehicle}
                onFavoriteClick={toggleFavorite}
              />
            ))}
          </div>
          <h3 className="text-white mt-2 text-lg">View All Upcoming Cars</h3>
        </div>
      </div>
    </section>
  );
}
