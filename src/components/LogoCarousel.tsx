"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

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

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <section
      ref={containerRef}
      aria-label="Logo carousel"
      className="relative h-56 overflow-hidden my-10 touch-none select-none cursor-grab active:cursor-grabbing"
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
        {[...logos, ...logos].map((logo, index) => (
          <button
            key={`${logo}-${index}`}
            className="absolute transition-all duration-500 ease-out"
            style={{
              transform: `translateX(-50%) scale(${getScale(
                index % logos.length
              )})`,
              left: `${50 + (index - activeIndex) * 12.5}%`, // Fixed equal spacing of 12.5%
              opacity: getOpacity(index % logos.length),
              zIndex: 1000 - Math.abs((index % logos.length) - activeIndex),
            }}
            aria-label={`Brand logo ${index + 1}`}
            onClick={() => setActiveIndex(index % logos.length)}
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
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
