"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useLogoStore } from "@/store/useLogoStore";
import { getBrandNameFromLogo } from "@/utils/brandNameMapping";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
  readonly logos?: readonly string[];
  readonly showTitle?: boolean;
}

export default function LogoCarousel({ logos, showTitle = true }: Props) {
  const logoStore = useLogoStore();
  // Use provided logos or all logos from the store
  const allLogos = logos || logoStore.allLogos;

  // Start from middle by setting initial active index to middle of array
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const activeCategory = useLogoStore((state) => state.activeCategory);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userInteracting, setUserInteracting] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(0);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Process logo paths only once when allLogos changes
  const processedLogos = useMemo(() => {
    return allLogos.map((logo) => {
      // Make sure path starts with / for Next.js public directory
      // Also ensure that file names are lowercase for consistency in production (Linux) environments
      if (!logo.startsWith("/")) {
        return `/${logo}`.toLowerCase();
      }
      return logo.toLowerCase(); // Convert to lowercase for consistency across environments
    });
  }, [allLogos]);

  // Update active index when logos change
  useEffect(() => {
    if (processedLogos.length > 0) {
      setActiveIndex(Math.floor(processedLogos.length / 2));
    }
  }, [processedLogos.length]);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    // Set loading false after a delay to ensure proper rendering
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Add theme-aware styling
  const logoBackgroundColor =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-white" // White logos in dark mode
      : "bg-zinc-100"; // Zinc logos in light mode

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
    return filename
      .replace(".svg", "")
      .replace(".png", "")
      .replace(".jpg", "")
      .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" ");
  };

  // Only continue with the rest of the component if we have logos
  if (processedLogos.length === 0 && !isLoading) {
    return (
      <section className="py-8">
        {showTitle && (
          <h2 className="text-2xl font-bold text-center mb-4">
            Explore Popular Brands
          </h2>
        )}
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No brand logos available</p>
        </div>
      </section>
    );
  }

  // Render logos inside our HydrationFix component to prevent hydration warnings
  const renderLogoButton = (logo: string, index: number) => {
    // Get brand display name for fallbacks
    const brandDisplayName = getBrandDisplayName(logo);

    const normalizedIndex =
      ((index % processedLogos.length) + processedLogos.length) %
      processedLogos.length;

    return (
      <button
        key={`${logo}-${index}`}
        className="absolute transition-all duration-500 ease-out"
        style={{
          transform: `translateX(-50%) scale(${getScale(normalizedIndex)})`,
          left: `${50 + (index - activeIndex) * 12.5}%`,
          opacity: getOpacity(normalizedIndex),
          zIndex: 1000 - Math.abs(normalizedIndex - activeIndex),
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
              unoptimized={true}
              onError={() => handleImageError(logo)}
              priority={
                index === activeIndex ||
                index === (activeIndex + 1) % processedLogos.length ||
                index ===
                  (activeIndex - 1 + processedLogos.length) %
                    processedLogos.length
              }
            />
            <div className="absolute bottom-2 text-xs text-gray-500">
              {brandDisplayName}
            </div>
          </div>
        </div>
      </button>
    );
  };

  // The rest of the component (handleDragStart, handleInfiniteScroll, etc.) remains unchanged
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setUserInteracting(true); // Mark that user is interacting
    setLastInteraction(Date.now());
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  // Enhanced infinite scroll behavior without animation resets
  const handleInfiniteScroll = (newIndex: number) => {
    const totalLength = processedLogos.length;

    if (newIndex >= 2 * totalLength) {
      // If we've gone beyond the second copy, silently reset to the middle copy
      return newIndex - totalLength;
    }

    if (newIndex < 0) {
      // If we've gone before the first copy, silently jump to the end of the first copy
      return newIndex + totalLength;
    }

    return newIndex;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    // Reset auto-scroll timer when user is scrolling
    setLastInteraction(Date.now());

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - clientX;

    // Make scrolling more sensitive but prevent accidental scrolls
    if (Math.abs(diff) > 20) {
      if (diff > 0) {
        setActiveIndex((prev) => handleInfiniteScroll(prev + 1));
      } else {
        setActiveIndex((prev) => handleInfiniteScroll(prev - 1));
      }
      setStartX(clientX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // Set a timeout to reset userInteracting after some inactivity
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    autoScrollTimeoutRef.current = setTimeout(() => {
      setUserInteracting(false);
    }, 3000); // Wait 3 seconds of inactivity before resuming auto-scroll
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

  // Auto-scroll animation that respects user interaction
  useEffect(() => {
    if (isLoading || processedLogos.length <= 1 || userInteracting) return;

    const interval = setInterval(() => {
      // Only auto-scroll if user hasn't interacted recently
      if (Date.now() - lastInteraction > 3000) {
        setActiveIndex((prev) => handleInfiniteScroll(prev + 1));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [processedLogos.length, isLoading, userInteracting, lastInteraction]);

  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle logo click to navigate to filter page
  const handleLogoClick = (logo: string) => {
    const brandName = getBrandNameFromLogo(logo);

    if (brandName) {
      // Navigate to cars or bikes page with brand filter
      const path = activeCategory === "cars" ? "/cars" : "/bikes";
      router.push(`${path}?brand=${encodeURIComponent(brandName)}`);
    }
  };

  // Update keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setActiveIndex((prev) => handleInfiniteScroll(prev - 1));
    } else if (e.key === "ArrowRight") {
      setActiveIndex((prev) => handleInfiniteScroll(prev + 1));
    }
  };

  // Add title based on the showTitle prop
  const carouselTitle = showTitle ? (
    <h2 className="text-2xl font-bold text-center mb-4">
      Explore Popular Brands
    </h2>
  ) : null;

  return (
    <section className="py-8">
      {carouselTitle}
      <div
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
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Navigation arrows */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[1100] bg-white/80 dark:bg-gray-800/80 rounded-full p-2.5 shadow-lg hover:bg-white dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 ease-out hover:scale-110 active:scale-95 backdrop-blur-sm"
          onClick={() => {
            setUserInteracting(true);
            setLastInteraction(Date.now());
            setActiveIndex((prev) => handleInfiniteScroll(prev - 1));
            handleDragEnd(); // Start the timer to reset userInteracting
          }}
          aria-label="Previous brand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[1100] bg-white/80 dark:bg-gray-800/80 rounded-full p-2.5 shadow-lg hover:bg-white dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 ease-out hover:scale-110 active:scale-95 backdrop-blur-sm"
          onClick={() => {
            setUserInteracting(true);
            setLastInteraction(Date.now());
            setActiveIndex((prev) => handleInfiniteScroll(prev + 1));
            handleDragEnd(); // Start the timer to reset userInteracting
          }}
          aria-label="Next brand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Visual indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pb-2">
          {processedLogos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserInteracting(true);
                setLastInteraction(Date.now());
                setActiveIndex(idx + processedLogos.length); // Position in the middle copy for smooth transitions
                handleDragEnd();
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex % processedLogos.length
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to logo ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center relative h-full mb-8">
          {isLoading ? (
            <div className="animate-pulse text-center">
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
              <LoadingSpinner />
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                Loading brands...
              </p>
            </div>
          ) : (
            <HydrationFix>
              {processedLogos.length > 0 &&
                [...processedLogos, ...processedLogos, ...processedLogos].map(
                  (logo, index) => renderLogoButton(logo, index)
                )}
            </HydrationFix>
          )}
        </div>
      </div>
    </section>
  );
}
