"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar/Navbar";
import VehicleGlassContainer from "@/components/vehicle/VehicleGlassContainer";
import { useBookmarkStore } from "@/store/useBookmarkStore";

export default function VehicleDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [carData, setCarData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { isBookmarked } = useBookmarkStore();

  const brand = params.brand as string;
  const model = params.model as string;

  useEffect(() => {
    async function fetchCarData() {
      setIsLoading(true);
      try {
        console.log(`Fetching vehicle: brand=${brand}, model=${model}`);

        const response = await fetch(
          `/api/vehicles/by-slug?brand=${brand}&model=${model}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.error(
              `Vehicle not found for brand="${brand}", model="${model}"`
            );
            return notFound();
          }
          throw new Error("Failed to fetch vehicle details");
        }

        const data = await response.json();
        if (data && data.vehicle) {
          console.log("Vehicle found:", data.vehicle.basicInfo);
          // Log the image structure to inspect color images
          console.log("Vehicle images structure:", data.vehicle.images);
          setCarData(data.vehicle);

          // Set the default active image when data loads
          if (data.vehicle.mainImages && data.vehicle.mainImages.length > 0) {
            setActiveImage(data.vehicle.mainImages[0]);
          }
        } else {
          console.error("No vehicle data in response");
          return notFound();
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        return notFound();
      } finally {
        setIsLoading(false);
      }
    }

    if (brand && model) {
      fetchCarData();
    }
  }, [brand, model]);

  // Function to handle thumbnail clicks
  const handleImageChange = (image: string) => {
    setActiveImage(image);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${carData?.basicInfo?.brand || ""} ${
            carData?.basicInfo?.name || ""
          }`,
          text: `Check out the ${carData?.basicInfo?.brand || ""} ${
            carData?.basicInfo?.name || ""
          }!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.custom({
        title: "Link copied to clipboard",
        description: "You can now share this car with others",
      });
    }
  };

  const handleSaveToFavorites = () => {
    const isSaved = carData?._id ? isBookmarked(carData._id) : false;

    toast.custom({
      title: isSaved ? "Removed from favorites" : "Added to favorites",
      description: `${carData?.basicInfo?.brand || ""} ${
        carData?.basicInfo?.name || ""
      } has been ${isSaved ? "removed from" : "added to"} your favorites.`,
    });
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Main vehicle display with glass container */}
        <VehicleGlassContainer
          vehicle={carData}
          activeImage={activeImage}
          onImageChange={handleImageChange}
          shareHandler={handleShare}
          favoriteHandler={handleSaveToFavorites}
        />
      </div>
    </div>
  );
}
