"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  priceRange?: string; // New prop for price range
  image: string;
  onFavoriteClick: () => void;
}

export default function Card({
  id,
  title,
  category,
  price,
  priceRange,
  image,
  onFavoriteClick,
}: CardProps) {
  const [isFavourite, setIsFavourite] = useState(false);

  // Format price for display if no priceRange is provided
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString("en-IN")}`;
    }
  };

  const handleFavoriteClick = () => {
    setIsFavourite(!isFavourite);
    onFavoriteClick();
  };

  return (
    <div className="group relative bg-card rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {/* Favorite button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
        onClick={handleFavoriteClick}
      >
        <Heart
          size={18}
          className={
            isFavourite ? "fill-red-500 text-red-500" : "text-gray-600"
          }
        />
      </Button>

      {/* Image */}
      <Link href={`/vehicle/${id}`} className="block h-44 relative">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/vehicle/${id}`}>
          <h3 className="text-lg font-semibold mb-1 line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-sm font-medium">
            {/* Use priceRange if provided, otherwise format the price */}
            {priceRange || formatPrice(price)}
          </span>
        </div>
      </div>
    </div>
  );
}
