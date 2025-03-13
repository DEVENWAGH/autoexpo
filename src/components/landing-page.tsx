"use client";

import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import GlassContainer from "./glassContainer/GlassContainer";
import LogoCarousel from "./LogoCarousel";
import { useLogoStore } from "@/store/useLogoStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { activeCategory, carLogos, bikeLogos } = useLogoStore();
  const currentLogos = activeCategory === "cars" ? carLogos : bikeLogos;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />
        <LogoCarousel logos={currentLogos} />
        <GlassContainer />
      </main>
      <Footer />

      {/* Theme indicator for debugging (remove in production) */}
      {mounted && process.env.NODE_ENV === "development" && (
        <div className="fixed left-4 bottom-4 z-40 text-sm bg-white dark:bg-black border border-gray-300 dark:border-gray-700 px-2 py-1 rounded">
          Current theme: {theme || resolvedTheme || "loading..."}
        </div>
      )}
    </div>
  );
}
