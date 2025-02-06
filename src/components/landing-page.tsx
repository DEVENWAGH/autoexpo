'use client';

import Navbar from "./navbar/Navbar";
import Hero from "./hero/Hero";
import Footer from "./footer/Footer";
import GlassContainer from "./glassContainer/GlassContainer";
import LogoCarousel from './LogoCarousel';
import { useLogoStore } from '@/store/useLogoStore';

export default function LandingPage() {
  const { activeCategory, carLogos, bikeLogos } = useLogoStore();
  const currentLogos = activeCategory === 'cars' ? carLogos : bikeLogos;

  return (
    <div className="w-full min-h-screen bg-black overflow-x-hidden">
      <main className="container mx-auto px-4 max-w-[1440px]">
        <Hero />
        <LogoCarousel logos={currentLogos} />
        <GlassContainer />
      </main>
      <Footer />
    </div>
  );
}
