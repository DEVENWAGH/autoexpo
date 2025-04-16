"use client";

import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import GlassContainer from "./glassContainer/GlassContainer";
import LogoCarousel from "./LogoCarousel";
import ThreeDLogoScroller from "./3DLogoScroller";
import { useLogoStore } from "@/store/useLogoStore";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";

export default function LandingPage() {
  const { allLogos, setActiveCategory, activeCategory } = useLogoStore();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [isHighEndDevice, setIsHighEndDevice] = useState(false);

  // Process logo paths only once when allLogos or activeCategory changes
  const processedLogos = useMemo(() => {
    if (!allLogos || allLogos.length === 0) return [];

    // Simply ensure consistent casing and path format for SVG files
    return allLogos.map((logo) => {
      // Make sure path starts with / for Next.js public directory
      if (!logo.startsWith("/")) {
        return `/${logo}`;
      }
      // Convert old /brands/ paths to /logos/
      if (logo.startsWith("/brands/")) {
        return logo.replace("/brands/", activeCategory === "cars" ? "/logos/" : "/bike-logos/");
      }
      return logo;
    });
  }, [allLogos, activeCategory]);

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

  // Handle category change
  const handleCategoryChange = (category: "cars" | "bikes") => {
    console.log("Changing category to:", category);
    setActiveCategory(category);
  };

  // Pass logos directly to LogoCarousel (don't pass processedLogos)
  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />

        {/* Category switching tabs */}
        <div className="flex justify-center mt-8 mb-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "cars"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryChange("cars")}
            >
              Cars
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === "bikes"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryChange("bikes")}
            >
              Bikes
            </button>
          </div>
        </div>

        {/* Pass null for logos to force LogoCarousel to use the store directly */}
        <LogoCarousel
          logos={null}
          showTitle={true}
        />

        {/* Only show 3D version if enabled and user has opted in */}
        {mounted && use3D && isHighEndDevice && (
          <div className="mt-12">
            <ThreeDLogoScroller
              logos={processedLogos.length > 0 ? processedLogos : allLogos}
              showTitle={true}
            />
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
