"use client";

import Image from 'next/image';
import { Heart } from 'lucide-react';

interface CardProps {
  id: number;
  image: string;
  name: string;
  priceRange: string;
  isFavorite?: boolean;
  onFavoriteClick: (id: number) => void;
}

export default function Card({ id, image, name, priceRange, isFavorite, onFavoriteClick }: Readonly<CardProps>) {
  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/50">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
        <button 
          onClick={() => onFavoriteClick(id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
        <p className="text-gray-400 mb-4">Price Range: {priceRange}</p>
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Explore
        </button>
      </div>
    </div>
  );
}
