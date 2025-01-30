"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Props {
  readonly logos: readonly string[];
}

export default function LogoCarousel({ logos }: Props) {
  // Start from middle by setting initial active index to middle of array
  const [activeIndex, setActiveIndex] = useState(Math.floor(logos.length / 2));
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

  const calculatePosition = (index: number) => {
    const totalLogos = logos.length;
    const middleIndex = Math.floor(totalLogos / 2);
    let relativeIndex = index - activeIndex;
    
    // Wrap around for infinite effect
    if (relativeIndex > middleIndex) {
      relativeIndex -= totalLogos;
    } else if (relativeIndex < -middleIndex) {
      relativeIndex += totalLogos;
    }

    return `${50 + (relativeIndex * 8)}%`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-56 overflow-hidden my-10 touch-none select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="flex items-center justify-center relative h-full">
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="absolute transition-all duration-500 ease-out"
            style={{
              transform: `translateX(-50%) scale(${getScale(index % logos.length)})`,
              left: `${50 + (index - activeIndex) * 12.5}%`, // Fixed equal spacing of 12.5%
              opacity: getOpacity(index % logos.length),
              zIndex: 1000 - Math.abs(index % logos.length - activeIndex)
            }}
          >
            <div className="w-48 h-48 flex items-center justify-center bg-white rounded-lg shadow-lg mx-4">
              <Image
                src={logo}
                alt={`Brand logo ${index + 1}`}
                width={120}
                height={120}
                className="object-contain p-3"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
