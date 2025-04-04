"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar/Navbar";
import VehicleGlassContainer from "@/components/vehicle/VehicleGlassContainer";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, StarHalf, Trash2 } from "lucide-react";
import { SpecificationsTab } from "@/components/vehicle/preview-sections/SpecificationsTab";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  _id?: string; // Add support for MongoDB's native _id format
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  vehicleId?: string;
}

// Add this utility component near the top of your file
const SafeDiv = ({
  children,
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div suppressHydrationWarning className={className} {...props}>
      {children}
    </div>
  );
};

export default function VehicleDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [carData, setCarData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState<string | null>(null);
  const { data: session } = useSession();

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

          // Fetch reviews for this vehicle
          fetchVehicleReviews(data.vehicle._id);
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

  // Function to fetch reviews from the database
  const fetchVehicleReviews = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/reviews?vehicleId=${vehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Fallback to mock data if API fails
      const mockReviews: Review[] = [
        {
          id: "1",
          userId: "user1",
          userName: "John Doe",
          rating: 4.5,
          comment:
            "Great vehicle with excellent performance and comfort. Highly recommended for city driving.",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          vehicleId,
        },
        {
          id: "2",
          userId: "user2",
          userName: "Jane Smith",
          rating: 5,
          comment:
            "Absolutely love this car! The fuel efficiency is amazing and the features are top-notch.",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          vehicleId,
        },
      ];
      setReviews(mockReviews);
    }
  };

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
    if (!carData?._id) return;

    const isSaved = isBookmarked(carData._id);

    if (isSaved) {
      removeBookmark(carData._id);
    } else {
      addBookmark({
        id: carData._id,
        brand: carData.basicInfo?.brand || "",
        model: carData.basicInfo?.name || "",
        image: carData.images?.main?.[0] || "",
        price: carData.basicInfo?.priceExshowroom || 0,
      });
    }

    toast.custom({
      title: isSaved ? "Removed from favorites" : "Added to favorites",
      description: `${carData?.basicInfo?.brand || ""} ${
        carData?.basicInfo?.name || ""
      } has been ${isSaved ? "removed from" : "added to"} your favorites.`,
    });
  };

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setUserRating(rating);
  };

  // Handle review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }

    if (!carData?._id) {
      toast.error("Cannot identify vehicle for review");
      return;
    }

    setIsSubmitting(true);

    // Create review object
    const reviewData = {
      userId: session.user?.id || "unknown",
      userName: session.user?.name || "Anonymous",
      rating: userRating,
      comment: userReview,
      vehicleId: carData._id,
    };

    try {
      // Save review to database via API
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const data = await response.json();

        // Add the new review to the list
        setReviews([data.review, ...reviews]);

        // Reset form
        setUserRating(0);
        setUserReview("");

        // Show success message
        toast.success("Thank you for your feedback!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: string) => {
    if (!session?.user?.id) {
      toast.error("You must be signed in to delete a review");
      return;
    }

    setIsDeletingReview(reviewId);

    try {
      console.log("Attempting to delete review with ID:", reviewId);

      // Check for both id and _id property for MongoDB compatibility
      const idToDelete = reviewId;

      const response = await fetch(`/api/reviews/${idToDelete}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      console.log("API Response:", response.status, responseText);

      let errorData;
      try {
        errorData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        errorData = { message: "Failed to parse response" };
      }

      if (response.ok) {
        // Remove the deleted review from the state using either id or _id
        setReviews(
          reviews.filter(
            (review) => review.id !== idToDelete && review._id !== idToDelete
          )
        );
        toast.success("Review deleted successfully");
      } else {
        console.error("Failed to delete review:", errorData);
        toast.error(
          errorData.message || `Failed to delete review (${response.status})`
        );
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("An error occurred while deleting the review");
    } finally {
      setIsDeletingReview(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate average rating
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Check if user is the owner of a review
  const isReviewOwner = (review: Review) => {
    return session?.user?.id === review.userId;
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

        {/* Tabs for Reviews and Specifications */}
        <div className="mt-12">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Customer Reviews</h2>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold mr-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={`average-rating-star-${star}`}>
                          {star <= Math.floor(averageRating) ? (
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ) : star - 0.5 <= averageRating ? (
                            <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <Star className="w-5 h-5 text-gray-300" />
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>

                {/* Review Form */}
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Your Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={`user-rating-input-${rating}`}
                            type="button"
                            onClick={() => handleRatingSelect(rating)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= userRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <Textarea
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Share your experience with this vehicle..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                    {!session && (
                      <p className="mt-2 text-sm text-red-500">
                        Sign in to submit a review
                      </p>
                    )}
                  </form>
                </div>

                {/* Reviews List */}
                <SafeDiv className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={
                          review.id ||
                          `review-${Math.random().toString(36).substr(2, 9)}`
                        }
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">
                            {review.userName}
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-3">
                              {formatDate(review.createdAt)}
                            </span>
                            {isReviewOwner(review) && (
                              <button
                                onClick={() =>
                                  handleDeleteReview(
                                    review.id || review._id || ""
                                  )
                                }
                                disabled={isDeletingReview === review.id}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Delete review"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={`review-${review.id}-star-${star}`}>
                              {star <= Math.floor(review.rating) ? (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ) : star - 0.5 <= review.rating ? (
                                <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="w-4 h-4 text-gray-300" />
                              )}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </SafeDiv>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                {carData && (
                  <SpecificationsTab
                    data={carData}
                    type={carData.vehicleType === "cars" ? "car" : "bike"}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
