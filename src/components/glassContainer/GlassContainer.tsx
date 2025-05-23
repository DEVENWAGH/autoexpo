"use client";

import { Bruno_Ace } from "next/font/google";
import Card from "@/components/card/Card";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useBookmarkStore, BookmarkedVehicle } from "@/store/useBookmarkStore";
import { useCarDataStore } from "@/store/carDataStore";

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});

// Enhanced Car interface to include variant pricing
interface Car {
  _id: string;
  basicInfo: {
    brand: string;
    name: string;
    priceExshowroom: number;
    carType?: string;
    variant?: string;
  };
  variants?: {
    base?: {
      priceExshowroom?: number;
    };
    top?: {
      priceExshowroom?: number;
    };
  };
  images: {
    main: string[];
  };
  fuelPerformance?: {
    fuelType: string;
  };
}

// Interface for grouped car models with price ranges
interface GroupedCar {
  _id: string;
  basicInfo: {
    brand: string;
    name: string;
    priceExshowroom: number;
    carType?: string;
  };
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  topPrice: number;
  images: {
    main: string[];
  };
  fuelPerformance?: {
    fuelType: string;
  };
}

export default function GlassContainer() {
  const [cars, setCars] = useState<GroupedCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const {
    fetchCars,
    cars: storeCars,
    isLoading: storeLoading,
    error: storeError,
  } = useCarDataStore();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format price to display in Indian format (lakhs/crores)
  const formatPrice = (price: number | undefined) => {
    if (!price) return "N/A";

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString("en-IN")}`;
    }
  };

  // Get price range for a car - prioritize base to top variant range
  const getPriceRange = (
    minPrice: number,
    maxPrice: number,
    basePrice: number,
    topPrice: number
  ) => {
    if (basePrice > 0 && topPrice > 0 && basePrice !== topPrice) {
      return `${formatPrice(basePrice)} - ${formatPrice(topPrice)}`;
    } else if (maxPrice > minPrice) {
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
    return formatPrice(minPrice);
  };

  // Process cars from store into grouped format
  useEffect(() => {
    if (!storeCars.length) {
      fetchCars();
      return;
    }

    setIsLoading(storeLoading);
    setError(storeError || "");

    const processStoreCars = () => {
      try {
        const carGroups: Record<
          string,
          {
            baseModel?: Car;
            minPrice: number;
            maxPrice: number;
            basePrice: number;
            topPrice: number;
            hasBaseVariant: boolean;
            hasTopVariant: boolean;
          }
        > = {};

        // Group cars and find min/max prices
        storeCars.forEach((car) => {
          const modelKey = `${car.basicInfo.brand}-${car.basicInfo.name}`;
          const price = car.basicInfo.priceExshowroom;
          const variant = car.basicInfo.variant?.toLowerCase() || "";

          if (!carGroups[modelKey]) {
            carGroups[modelKey] = {
              minPrice: price,
              maxPrice: price,
              basePrice: variant === "base" ? price : 0,
              topPrice: variant === "top" ? price : 0,
              hasBaseVariant: variant === "base",
              hasTopVariant: variant === "top",
            };
          } else {
            carGroups[modelKey].minPrice = Math.min(
              carGroups[modelKey].minPrice,
              price
            );
            carGroups[modelKey].maxPrice = Math.max(
              carGroups[modelKey].maxPrice,
              price
            );

            if (variant === "base") {
              carGroups[modelKey].basePrice = price;
              carGroups[modelKey].hasBaseVariant = true;
            }
            if (variant === "top") {
              carGroups[modelKey].topPrice = price;
              carGroups[modelKey].hasTopVariant = true;
            }
          }

          if (variant === "base" || !carGroups[modelKey].baseModel) {
            carGroups[modelKey].baseModel = car;
          }
        });

        const baseModelCars: GroupedCar[] = [];

        Object.entries(carGroups).forEach(([modelKey, group]) => {
          if (group.baseModel) {
            const car = group.baseModel;
            baseModelCars.push({
              _id: car._id,
              basicInfo: {
                brand: car.basicInfo.brand,
                name: car.basicInfo.name,
                priceExshowroom: car.basicInfo.priceExshowroom,
                carType: car.basicInfo.carType,
              },
              minPrice: group.minPrice,
              maxPrice: group.maxPrice,
              basePrice: group.basePrice,
              topPrice: group.topPrice,
              images: car.images,
              fuelPerformance: car.fuelPerformance,
            });
          }
        });

        setCars(baseModelCars.slice(0, 4));
      } catch (err) {
        console.error("Error processing cars:", err);
        setError("Failed to process car data.");
      } finally {
        setIsLoading(false);
      }
    };

    processStoreCars();
  }, [storeCars, storeLoading, storeError, fetchCars]);

  // Theme-aware styles
  const titleTextClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white"
      : "text-black";

  const containerGradient =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-gradient-to-r from-gray-800/20 to-gray-900/20 border-gray-700/30"
      : "bg-gradient-to-r from-gray-200/60 to-gray-300/60 border-gray-300/50";

  const viewAllClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white hover:text-blue-300"
      : "text-gray-800 hover:text-blue-700";

  // Add bookmark toggle handler
  const handleBookmarkToggle = (car: GroupedCar) => {
    if (!car) return;

    const isCurrentlyBookmarked = isBookmarked(car._id);

    if (isCurrentlyBookmarked) {
      removeBookmark(car._id);
    } else {
      const bookmarkedVehicle: BookmarkedVehicle = {
        id: car._id,
        brand: car.basicInfo?.brand || "Unknown",
        name: car.basicInfo?.name || "Vehicle",
        image: car.images?.main?.[0] || "/placeholder.svg",
        price: car.basicInfo?.priceExshowroom || 0,
        slug: `${car.basicInfo?.brand?.toLowerCase() || "brand"}/${
          car.basicInfo?.name?.toLowerCase() || "model"
        }`,
      };

      addBookmark(bookmarkedVehicle);
    }
  };

  return (
    <section className="my-12">
      <h2
        className={`${brunoFont.className} ${titleTextClass} mt-4 text-4xl md:text-5xl lg:text-6xl text-center mb-8`}
      >
        Latest Car Launches
      </h2>
      <div
        className={`mt-4 w-full rounded-[40px] backdrop-blur-xl border ${containerGradient} p-8`}
        suppressHydrationWarning
      >
        {isLoading ? (
          <div
            className="flex justify-center items-center h-64"
            suppressHydrationWarning
          >
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
              suppressHydrationWarning
            ></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {cars.length > 0 ? (
                cars.map((car) => (
                  <Card
                    key={car._id}
                    id={car._id}
                    title={`${car.basicInfo.brand} ${car.basicInfo.name}`}
                    category={
                      car.fuelPerformance?.fuelType === "Electric"
                        ? "Electric"
                        : car.basicInfo.carType || "Car"
                    }
                    price={car.basicInfo.priceExshowroom}
                    priceRange={getPriceRange(
                      car.minPrice,
                      car.maxPrice,
                      car.basePrice,
                      car.topPrice
                    )}
                    image={car.images?.main?.[0] || "/placeholder.svg"}
                    onFavoriteClick={() => handleBookmarkToggle(car)}
                    isBookmarked={isBookmarked(car._id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No cars available at the moment.
                </div>
              )}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/cars" passHref>
                <button
                  className={`font-medium ${viewAllClass} transition duration-200 flex items-center`}
                >
                  View All Upcoming Cars
                  <svg
                    xmlns="http://www0.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
