"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Props {
  readonly logos: readonly string[];
}

export default function LogoCarousel({ logos }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

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

    if (distance === 0) return 1; // Center (100% size)
    if (distance === 1) return 0.85; // Adjacent (85% size)
    if (distance === 2) return 0.7; // Second position (70% size)
    return 0.55; // Rest (55% size)
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

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    logoPath: string
  ) => {
    console.error(`Failed to load image: ${logoPath}`);
  };

  // Add auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % logos.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div
      ref={containerRef}
      className="relative h-40 overflow-hidden my-10 touch-none select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="flex items-center justify-center relative h-full">
        {logos.map((logo, index) => (
          <div
            key={`logo-${logo.replace(/[^a-zA-Z0-9]/g, "-")}`}
            className="absolute transition-all duration-500 ease-out" // Increased duration
            style={{
              transform: `translateX(-50%) scale(${getScale(index)})`,
              left: `${50 + (index - activeIndex) * 20}%`, // Adjusted spacing
              opacity: getOpacity(index),
              zIndex: 1000 - Math.abs(index - activeIndex),
            }}
          >
            <div className="w-24 h-24 flex items-center justify-center bg-white rounded-lg">
              <Image
                src={logo}
                alt={`Brand logo ${index + 1}`}
                width={60}
                height={60}
                className="object-contain p-2"
                draggable={false}
                onError={(e) => handleImageError(e, logo)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
