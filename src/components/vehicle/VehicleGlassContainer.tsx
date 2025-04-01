"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { formatIndianNumber } from "@/lib/utils";
import { useBookmarkStore, BookmarkedVehicle } from "@/store/useBookmarkStore";
import { motion, useAnimation, PanInfo } from "framer-motion";

interface VehicleGlassContainerProps {
  vehicle: any;
  activeImage?: string | null;
  onImageChange?: (image: string) => void;
  shareHandler?: () => void;
  favoriteHandler?: () => void;
}

export default function VehicleGlassContainer({
  vehicle,
  activeImage,
  onImageChange,
  shareHandler,
  favoriteHandler,
}: VehicleGlassContainerProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [internalActiveImage, setInternalActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"exterior" | "interior" | "colors">("exterior");
  const [imageIndex, setImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();
  
  // Add bookmark functionality
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  // Get all available images
  const exteriorImages = vehicle?.images?.exterior || [];
  const interiorImages = vehicle?.images?.interior || [];
  const colorImages = vehicle?.images?.colors || vehicle?.images?.color || [];
  const mainImages = vehicle?.mainImages || vehicle?.images?.main || [];

  // Initial bookmark check
  useEffect(() => {
    if (vehicle?._id) {
      setIsBookmarkedState(isBookmarked(vehicle._id));
    }
  }, [vehicle, isBookmarked]);

  // Get current display images based on active tab
  const getCurrentTabImages = () => {
    switch (activeTab) {
      case "exterior":
        return exteriorImages.length > 0 ? exteriorImages : mainImages;
      case "interior":
        return interiorImages;
      case "colors":
        return colorImages;
      default:
        return mainImages;
    }
  };

  // Get the current active tab's images
  const currentTabImages = getCurrentTabImages();

  // Use either the prop or internal state
  const currentActiveImage = activeImage || internalActiveImage;

  // Handler for thumbnail clicks
  const handleImageClick = (image: string, index: number) => {
    console.log("Image clicked:", image);
    setImageIndex(index);
    if (onImageChange) {
      // If we have an external handler, use it
      onImageChange(image);
    } else {
      // Otherwise use internal state
      setInternalActiveImage(image);
    }
  };

  // Initialize with first image when vehicle data is loaded (prioritizing main images)
  useEffect(() => {
    if (vehicle) {
      // First try to set the main image
      if (mainImages.length > 0) {
        if (onImageChange) {
          onImageChange(mainImages[0]);
        } else {
          setInternalActiveImage(mainImages[0]);
        }
        // Then set the active tab that would show this image
        setActiveTab("exterior");
        return;
      }
      
      // Otherwise set any available image from the current tab
      const tabImages = getCurrentTabImages();
      if (tabImages.length > 0) {
        if (onImageChange) {
          onImageChange(tabImages[0]);
        } else {
          setInternalActiveImage(tabImages[0]);
        }
      }
    }
  }, [vehicle]);

  // Update active image when tab changes
  useEffect(() => {
    const tabImages = getCurrentTabImages();
    if (tabImages.length > 0) {
      setImageIndex(0);
      handleImageClick(tabImages[0], 0);
    }
  }, [activeTab]);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation functions for swiping
  const nextImage = () => {
    if (isAnimating || currentTabImages.length <= 1) return;
    
    const newIndex = (imageIndex + 1) % currentTabImages.length;
    animateImageChange(-100, newIndex);
  };

  const prevImage = () => {
    if (isAnimating || currentTabImages.length <= 1) return;
    
    const newIndex = (imageIndex - 1 + currentTabImages.length) % currentTabImages.length;
    animateImageChange(100, newIndex);
  };

  // Animate the image change
  const animateImageChange = async (direction: number, newIndex: number) => {
    setIsAnimating(true);
    
    // Animate slide out
    await controls.start({ 
      x: direction,
      opacity: 0,
      transition: { duration: 0.2 }
    });
    
    // Update image
    setImageIndex(newIndex);
    handleImageClick(currentTabImages[newIndex], newIndex);
    
    // Reset position but keep invisible
    await controls.start({ 
      x: -direction,
      opacity: 0,
      transition: { duration: 0 }
    });
    
    // Animate slide in
    await controls.start({ 
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 }
    });
    
    setIsAnimating(false);
  };

  // Handle drag gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    
    // If dragged more than 50px horizontally
    if (Math.abs(offset.x) > 50) {
      if (offset.x > 0) {
        prevImage();
      } else {
        nextImage();
      }
    } else {
      // Reset position if not dragged enough
      controls.start({ 
        x: 0,
        transition: { duration: 0.2 }
      });
    }
  };

  if (!mounted) return null;

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (!vehicle) return;

    const isCurrentlyBookmarked = isBookmarked(vehicle._id);

    if (isCurrentlyBookmarked) {
      removeBookmark(vehicle._id);
    } else {
      // Create the bookmarked vehicle object
      const bookmarkedVehicle: BookmarkedVehicle = {
        id: vehicle._id,
        brand: vehicle.basicInfo?.brand || "Unknown",
        name: vehicle.basicInfo?.name || "Vehicle",
        image: mainImages[0] || exteriorImages[0] || "/placeholder.svg",
        price: vehicle.basicInfo?.priceExshowroom || 0,
        slug: `${vehicle.basicInfo?.brand?.toLowerCase() || "brand"}/${
          vehicle.basicInfo?.name?.toLowerCase() || "model"
        }`,
      };

      addBookmark(bookmarkedVehicle);
    }

    // Update local state
    setIsBookmarkedState(!isCurrentlyBookmarked);

    // Also call the external handler if provided
    if (favoriteHandler) {
      favoriteHandler();
    }
  };

  // Theme-aware styles
  const containerGradient =
    theme === "dark" || resolvedTheme === "dark"
      ? "bg-gradient-to-r from-gray-800/20 to-gray-900/20 border-gray-700/30"
      : "bg-gradient-to-r from-gray-200/60 to-gray-300/60 border-gray-300/50";

  const headingClass =
    theme === "dark" || resolvedTheme === "dark"
      ? "text-white"
      : "text-gray-900";

  const subHeadingClass =
    theme === "dark" || resolvedTheme === "dark"
      ? "text-gray-300"
      : "text-gray-700";

  const thumbnailActiveClass =
    theme === "dark" || resolvedTheme === "dark"
      ? "border-blue-500"
      : "border-blue-600";

  // Get the default image to display if no active image is set
  const defaultImage =
    currentActiveImage ||
    getCurrentTabImages()[0] ||
    mainImages[0] ||
    "/placeholder.svg";

  return (
    <div
      className={`w-full rounded-xl backdrop-blur-xl border ${containerGradient} p-6 lg:p-8`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left side - Image section */}
        <div className="space-y-4">
          {/* Main image display with swipe gestures */}
          <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={controls}
              initial={{ opacity: 1, x: 0 }}
              className="w-full h-full"
            >
              <Image
                src={defaultImage}
                alt={`${vehicle?.basicInfo?.brand || ""} ${
                  vehicle?.basicInfo?.name || ""
                }`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            
            {/* Navigation buttons - only show if there are multiple images */}
            {currentTabImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-10"
                  disabled={isAnimating}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-10"
                  disabled={isAnimating}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* Tabs for different image categories */}
          <Tabs
            defaultValue="exterior"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="exterior">Exterior</TabsTrigger>
              <TabsTrigger value="interior">Interior</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Image thumbnails */}
          <div className="flex overflow-x-auto space-x-2 pb-2">
            {getCurrentTabImages().map((image: string, index: number) => (
              <button
                key={`${activeTab}-${index}`}
                onClick={() => handleImageClick(image, index)}
                className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                  imageIndex === index
                    ? thumbnailActiveClass
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {getCurrentTabImages().length === 0 && (
              <div className="w-full py-8 text-center text-gray-500">
                No images available
              </div>
            )}
          </div>
        </div>

        {/* Right side - Car details */}
        <div className="space-y-4">
          {/* Share and favorite buttons */}
          <div className="flex justify-end gap-2 mb-2">
            {shareHandler && (
              <Button variant="outline" size="sm" onClick={shareHandler}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmarkToggle}
              className={
                isBookmarkedState
                  ? "bg-red-100 dark:bg-red-900/20 text-red-600"
                  : ""
              }
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isBookmarkedState ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isBookmarkedState ? "Saved" : "Save"}
            </Button>
          </div>

          <h1 className={`text-3xl font-bold ${headingClass}`}>
            {vehicle?.basicInfo?.brand} {vehicle?.basicInfo?.name}
          </h1>

          {vehicle?.basicInfo?.variantName && (
            <h2 className={`text-xl ${subHeadingClass}`}>
              {vehicle?.basicInfo?.variantName}
            </h2>
          )}

          {/* Price section */}
          <Card className="bg-black/5 dark:bg-white/5 border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ex-Showroom Price
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatIndianNumber(vehicle?.basicInfo?.priceExshowroom)}
                  </p>
                </div>
                <Button>Get Offers</Button>
              </div>
            </CardContent>
          </Card>

          {/* Key specs highlights */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {vehicle?.engineTransmission?.engineType && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Engine
                </p>
                <p className={`font-medium ${headingClass}`}>
                  {vehicle?.engineTransmission?.engineType}
                </p>
              </div>
            )}

            {vehicle?.engineTransmission?.maxPower && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Power
                </p>
                <p className={`font-medium ${headingClass}`}>
                  {vehicle?.engineTransmission?.maxPower}
                </p>
              </div>
            )}

            {vehicle?.fuelPerformance?.fuelType && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fuel Type
                </p>
                <p className={`font-medium ${headingClass}`}>
                  {vehicle?.fuelPerformance?.fuelType}
                </p>
              </div>
            )}

            {vehicle?.fuelPerformance?.mileage && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mileage
                </p>
                <p className={`font-medium ${headingClass}`}>
                  {vehicle?.fuelPerformance?.mileage} kmpl
                </p>
              </div>
            )}

            {vehicle?.engineTransmission?.transmissionType && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Transmission
                </p>
                <p className={`font-medium ${headingClass}`}>
                  {vehicle?.engineTransmission?.transmissionType}
                </p>
              </div>
            )}

            {vehicle?.dimensionsCapacity?.seatingCapacity && (
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Seating
                </p>
                <p className={`font-medium ${headingClass}`}>
                  {vehicle?.dimensionsCapacity?.seatingCapacity} People
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
