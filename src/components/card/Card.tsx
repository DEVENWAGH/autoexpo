"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface CardProps {
  id: number;
  image: string;
  name: string;
  priceRange: string;
  isFavorite?: boolean;
  onFavoriteClick: (id: number) => void;
}

export default function Card({
  id,
  image,
  name,
  priceRange,
  isFavorite,
  onFavoriteClick,
}: Readonly<CardProps>) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware styles
  const cardBg =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50"
      : "bg-gradient-to-r from-gray-100/90 to-gray-200/90 border-gray-300/50";

  const titleTextClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white"
      : "text-gray-900";

  const descTextClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-gray-400"
      : "text-gray-600";

  const buttonClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white";

  return (
    <div
      className={`rounded-xl overflow-hidden backdrop-blur-sm border transition-all duration-300 hover:shadow-lg ${cardBg}`}
    >
      <div className="relative h-48 w-full">
        <Image src={image} alt={name} fill className="object-cover" />
        <button
          onClick={() => onFavoriteClick(id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className={`text-xl font-semibold mb-2 ${titleTextClass}`}>
          {name}
        </h3>
        <p className={`mb-4 ${descTextClass}`}>Price Range: {priceRange}</p>

        <button
          className={`w-full font-semibold py-2 px-4 rounded transition-colors ${buttonClass}`}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
