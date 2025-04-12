"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useLogoStore } from "@/store/useLogoStore";
import { getBrandNameFromLogo } from "@/utils/brandNameMapping";

// Add the missing HydrationFix component
const HydrationFix = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return empty div with same dimensions during SSR to prevent layout shift
    return <div style={{ height: "100%", width: "100%" }} />;
  }

  return <>{children}</>;
};

interface Props {
  readonly logos: readonly string[];
}

export default function LogoCarousel({ logos }: Props) {
  // Start from middle by setting initial active index to middle of array
  const [activeIndex, setActiveIndex] = useState(Math.floor(logos.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const activeCategory = useLogoStore((state) => state.activeCategory);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset failed images when logos change
  useEffect(() => {
    setFailedImages({});
  }, [logos]);

  // Add theme-aware styling
  const logoBackgroundColor =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-white" // White logos in dark mode
      : "bg-zinc-100"; // Zinc logos in light mode

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - clientX;

    // Make scrolling more sensitive
    if (Math.abs(diff) > 20) {
      // Reduced threshold from 50 to 20
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % logos.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + logos.length) % logos.length);
      }
      setStartX(clientX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getScale = (index: number) => {
    const distance = Math.min(
      Math.abs(index - activeIndex),
      Math.abs(index - activeIndex - logos.length),
      Math.abs(index - activeIndex + logos.length)
    );

    if (distance === 0) return 1.2; // Center (120% size)
    if (distance === 1) return 1; // Adjacent (100% size)
    if (distance === 2) return 0.8; // Second position (80% size)
    return 0.6; // Rest (60% size)
  };

  const getOpacity = (index: number) => {
    const distance = Math.min(
      Math.abs(index - activeIndex),
      Math.abs(index - activeIndex - logos.length),
      Math.abs(index - activeIndex + logos.length)
    );

    if (distance === 0) return 1;
    if (distance === 1) return 0.9;
    if (distance === 2) return 0.7;
    return 0.5;
  };

  // Add auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % logos.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [logos.length]);

  // Handle logo click to navigate to filter page
  const handleLogoClick = (logo: string) => {
    const brandName = getBrandNameFromLogo(logo);

    if (brandName) {
      // Navigate to cars or bikes page with brand filter
      const path = activeCategory === "cars" ? "/cars" : "/bikes";
      router.push(`${path}?brand=${encodeURIComponent(brandName)}`);
    }
  };

  // Handle image error
  const handleImageError = (logo: string) => {
    console.error(`Failed to load logo image: ${logo}`);
    setFailedImages((prev) => ({ ...prev, [logo]: true }));
  };

  // Render logos inside our HydrationFix component to prevent hydration warnings
  const renderLogoButton = (logo: string, index: number) => {
    if (failedImages[logo]) {
      return null; // Skip rendering failed images
    }

    return (
      <button
        key={`${logo}-${index}`}
        className="absolute transition-all duration-500 ease-out"
        style={{
          transform: `translateX(-50%) scale(${getScale(
            index % logos.length
          )})`,
          left: `${50 + (index - activeIndex) * 12.5}%`,
          opacity: getOpacity(index % logos.length),
          zIndex: 1000 - Math.abs((index % logos.length) - activeIndex),
        }}
        aria-label={`Brand logo ${index + 1}`}
        onClick={() => handleLogoClick(logo)}
      >
        <div
          className={`w-48 h-48 flex items-center justify-center ${logoBackgroundColor} rounded-lg shadow-lg mx-4`}
        >
          <Image
            src={logo}
            alt={`Brand logo ${index + 1}`}
            width={logo.includes("kawasaki") ? 150 : 120}
            height={logo.includes("kawasaki") ? 150 : 120}
            className="object-contain p-3"
            draggable={false}
            onError={() => handleImageError(logo)}
            priority={
              index === activeIndex ||
              index === (activeIndex + 1) % logos.length ||
              index === (activeIndex - 1 + logos.length) % logos.length
            }
          />
        </div>
      </button>
    );
  };

  return (
    <section
      ref={containerRef}
      aria-label="Logo carousel"
      className="relative h-64 my-8 touch-pan-y"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          setActiveIndex((prev) => (prev - 1 + logos.length) % logos.length);
        } else if (e.key === "ArrowRight") {
          setActiveIndex((prev) => (prev + 1) % logos.length);
        }
      }}
    >
      <div className="flex items-center justify-center relative h-full">
        <HydrationFix>
          {logos.length > 0 &&
            [...logos, ...logos].map((logo, index) =>
              renderLogoButton(logo, index)
            )}
        </HydrationFix>
      </div>
    </section>
  );
}
