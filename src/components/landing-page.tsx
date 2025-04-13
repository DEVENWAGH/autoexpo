"use client";

import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import GlassContainer from "./glassContainer/GlassContainer";
import LogoCarousel from "./LogoCarousel";
import ThreeDLogoScroller from "./3DLogoScroller";
import { useLogoStore } from "@/store/useLogoStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LandingPage() {
  
  const { allLogos, carLogos } = useLogoStore();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [isHighEndDevice, setIsHighEndDevice] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only enable 3D on devices likely to handle it well
    const checkDeviceCapability = () => {
      // Check if device is likely high-end
      const highEnd =
        window.devicePixelRatio >= 2 && // High pixel density display
        navigator.hardwareConcurrency >= 4 && // At least 4 CPU cores
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ); // Not mobile

      setIsHighEndDevice(highEnd);
      // Default to 2D for most devices for now
      setUse3D(false);
    };

    checkDeviceCapability();
  }, []);

  // Pass ALL logos to the carousel - don't filter or limit them
  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />
        {/* Pass all logos directly without filtering */}
        <LogoCarousel logos={allLogos} showTitle={true} />

        {/* Only show 3D version if enabled and user has opted in */}
        {mounted && use3D && isHighEndDevice && (
          <div className="mt-12">
            <ThreeDLogoScroller logos={allLogos} showTitle={true} />
          </div>
        )}

        <GlassContainer />
      </main>
      <Footer />

      {/* Theme indicator for debugging (remove in production) */}
      {mounted && process.env.NODE_ENV === "development" && (
        <div className="fixed left-4 bottom-4 z-40 text-sm bg-white dark:bg-black border border-gray-300 dark:border-gray-700 px-2 py-1 rounded">
          Current theme: {theme || resolvedTheme || "loading..."}
        </div>
      )}

      {/* Performance controls - only in development */}
      {mounted && isHighEndDevice && process.env.NODE_ENV === "development" && (
        <div className="fixed right-4 bottom-4 z-40">
          <button
            onClick={() => setUse3D(!use3D)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            {use3D ? "Switch to 2D" : "Try 3D View"}
          </button>
        </div>
      )}
    </div>
  );
}
