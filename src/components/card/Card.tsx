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
  priceRange?: string;
  image: string;
  onFavoriteClick: () => void;
  isBookmarked?: boolean;
}

export default function Card({
  id,
  title,
  category,
  price,
  priceRange,
  image,
  onFavoriteClick,
  isBookmarked = false,
}: CardProps) {
  const [isFavourite, setIsFavourite] = useState(false);

  // Create SEO-friendly URL
  const generateSlug = () => {
    // Split the title (which should be "Brand Model")
    const titleParts = title.split(" ");

    // Handle multi-word brands (like "Tata Motors")
    // If the title has more than 2 words, we need to determine which is brand vs model
    let brandSlug, modelSlug;

    if (titleParts.length <= 2) {
      // Simple case: "Brand Model"
      brandSlug = titleParts[0].toLowerCase();
      modelSlug = titleParts.slice(1).join("-").toLowerCase();
    } else {
      // Complex case like "Tata Motors Nexon"
      // For Tata Motors vehicles, hardcode the brand as "tata-motors"
      if (title.startsWith("Tata Motors")) {
        brandSlug = "tata-motors";
        modelSlug = title
          .replace("Tata Motors ", "")
          .toLowerCase()
          .replace(/\s+/g, "-");
      } else {
        // General approach for other brands
        // Assume first word is brand, rest is model
        brandSlug = titleParts[0].toLowerCase();
        modelSlug = titleParts.slice(1).join("-").toLowerCase();
      }
    }

    return `/${brandSlug}/${modelSlug}`;
  };

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

  const cardLink = generateSlug();

  return (
    <div className="group relative bg-card rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {/* Favorite button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
        onClick={(e) => {
          e.preventDefault();
          handleFavoriteClick();
        }}
      >
        <Heart
          size={18}
          className={isBookmarked ? "fill-red-500 text-red-500" : "text-gray-600"}
        />
      </Button>

      {/* Image */}
      <Link href={cardLink} className="block h-44 relative">
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
        <Link href={cardLink}>
          <h3 className="text-lg font-semibold mb-1 line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-sm font-medium">
            {priceRange || formatPrice(price)}
          </span>
        </div>
      </div>
    </div>
  );
}
