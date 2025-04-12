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
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [processedLogos, setProcessedLogos] = useState<string[]>([]);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    // Set loading false after a delay to ensure proper rendering
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Process logo paths to ensure they work in production
  useEffect(() => {
    // Fix logo paths for production environment
    const processed = logos.map((logo) => {
      // Make sure path starts with / for Next.js public directory
      if (!logo.startsWith("/")) {
        return `/${logo}`;
      }
      return logo;
    });

    setProcessedLogos(processed);
    setFailedImages({});
    setIsLoading(true);

    // Reset loading state when logos change
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
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
        setActiveIndex((prev) => (prev + 1) % processedLogos.length);
      } else {
        setActiveIndex(
          (prev) => (prev - 1 + processedLogos.length) % processedLogos.length
        );
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
      Math.abs(index - activeIndex - processedLogos.length),
      Math.abs(index - activeIndex + processedLogos.length)
    );

    if (distance === 0) return 1.2; // Center (120% size)
    if (distance === 1) return 1; // Adjacent (100% size)
    if (distance === 2) return 0.8; // Second position (80% size)
    return 0.6; // Rest (60% size)
  };

  const getOpacity = (index: number) => {
    const distance = Math.min(
      Math.abs(index - activeIndex),
      Math.abs(index - activeIndex - processedLogos.length),
      Math.abs(index - activeIndex + processedLogos.length)
    );

    if (distance === 0) return 1;
    if (distance === 1) return 0.9;
    if (distance === 2) return 0.7;
    return 0.5;
  };

  // Add auto-scroll animation
  useEffect(() => {
    if (isLoading || processedLogos.length === 0) return; // Don't auto-scroll during loading
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % processedLogos.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [processedLogos.length, isLoading]);

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

  // Extract brand name for display in fallbacks
  const getBrandDisplayName = (logoPath: string) => {
    const brandName = getBrandNameFromLogo(logoPath);
    if (brandName) return brandName;

    // Fallback: try to extract name from the filename
    const parts = logoPath.split("/");
    const filename = parts[parts.length - 1];
    return filename.replace(".svg", "").replace(".png", "").replace(".jpg", "");
  };

  // Render logos inside our HydrationFix component to prevent hydration warnings
  const renderLogoButton = (logo: string, index: number) => {
    // Get brand display name for fallbacks
    const brandDisplayName = getBrandDisplayName(logo);

    if (failedImages[logo]) {
      // Create a placeholder when image fails to load
      return (
        <button
          key={`${logo}-${index}`}
          className="absolute transition-all duration-500 ease-out"
          style={{
            transform: `translateX(-50%) scale(${getScale(index % processedLogos.length)})`,
            left: `${50 + (index - activeIndex) * 12.5}%`,
            opacity: getOpacity(index % processedLogos.length),
            zIndex:
              1000 - Math.abs((index % processedLogos.length) - activeIndex),
          }}
        >
          <div
            className={`w-48 h-48 flex items-center justify-center ${logoBackgroundColor} rounded-lg shadow-lg mx-4`}
          >
            <div className="text-gray-600 dark:text-gray-400 text-center p-4">
              <div className="font-medium">{brandDisplayName}</div>
            </div>
          </div>
        </button>
      );
    }

    return (
      <button
        key={`${logo}-${index}`}
        className="absolute transition-all duration-500 ease-out"
        style={{
          transform: `translateX(-50%) scale(${getScale(index % processedLogos.length)})`,
          left: `${50 + (index - activeIndex) * 12.5}%`,
          opacity: getOpacity(index % processedLogos.length),
          zIndex:
            1000 - Math.abs((index % processedLogos.length) - activeIndex),
        }}
        aria-label={`Brand logo ${index + 1}`}
        onClick={() => handleLogoClick(logo)}
      >
        <div
          className={`w-48 h-48 flex items-center justify-center ${logoBackgroundColor} rounded-lg shadow-lg mx-4`}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={logo}
              alt={`${brandDisplayName} logo`}
              width={120}
              height={120}
              className="object-contain p-3 max-w-[80%] max-h-[80%]"
              draggable={false}
              onError={() => handleImageError(logo)}
              priority={
                index === activeIndex ||
                index === (activeIndex + 1) % processedLogos.length ||
                index ===
                  (activeIndex - 1 + processedLogos.length) %
                    processedLogos.length
              }
              unoptimized={true}
            />
            <div className="absolute bottom-2 text-xs text-gray-500">
              {brandDisplayName}
            </div>
          </div>
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
          setActiveIndex(
            (prev) => (prev - 1 + processedLogos.length) % processedLogos.length
          );
        } else if (e.key === "ArrowRight") {
          setActiveIndex((prev) => (prev + 1) % processedLogos.length);
        }
      }}
    >
      <div className="flex items-center justify-center relative h-full">
        {isLoading ? (
          <div className="animate-pulse text-center">
            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading logos...</p>
          </div>
        ) : (
          <HydrationFix>
            {processedLogos.length > 0 &&
              [...processedLogos, ...processedLogos].map((logo, index) =>
                renderLogoButton(logo, index)
              )}
          </HydrationFix>
        )}
      </div>
    </section>
  );
}
