"use client";

import { useState, useEffect, Suspense } from "react"; // Import Suspense
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Card from "@/components/card/Card";
import { useTheme } from "next-themes";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useCarDataStore } from "@/store/carDataStore";
import { Filter, SlidersHorizontal, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useInitialBrandFromUrl } from "@/utils/brandUtils"; // Import the new utility

// Define a loading component for the Suspense fallback
function LoadingFallback() {
  return (
    <div className="container mx-auto p-4 max-w-[1440px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Car Finder</h1>
      </div>
      <div className="flex gap-6">
        <div className="w-64 shrink-0">
          <Skeleton className="h-[500px] w-full" />
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function CarsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CarsPageContent />
    </Suspense>
  );
}

// Component containing the logic that uses useSearchParams
function CarsPageContent() {
  const searchParams = useSearchParams();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Get the raw URL parameters
  const rawBrand = searchParams.get("brand");
  const initialModel = searchParams.get("model") || "";
  const initialType = searchParams.get("type") || "";
  const initialBudget = searchParams.get("budget") || "";

  // Apply brand name mapping to convert "Tata" to "Tata Motors"
  const initialBrand = useInitialBrandFromUrl(rawBrand);

  // Use our store for car data
  const {
    cars,
    brands,
    carTypes,
    isLoading,
    error,
    fetchCars,
    fetchBrands,
    filterCars,
  } = useCarDataStore();

  // Initialize filter state with URL parameters - make sure to use initialBrand here
  const [filters, setFilters] = useState({
    brand: initialBrand || "",
    model: initialModel,
    type: initialType,
    budget: initialBudget,
    fuelType: "",
    minPrice: 0,
    maxPrice: 10000000,
  });

  // Available models for selected brand
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Filtered cars
  const [filteredCars, setFilteredCars] = useState(cars);

  useEffect(() => {
    setMounted(true);

    // If cars aren't loaded yet, fetch them
    if (cars.length === 0) {
      fetchCars();
    }

    // If brands aren't loaded yet, fetch them
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [fetchCars, fetchBrands, cars.length, brands.length]);

  // Update available models when brand changes
  useEffect(() => {
    if (!filters.brand) {
      setAvailableModels([]);
      return;
    }

    async function fetchModels() {
      try {
        const response = await fetch(
          `/api/models?brand=${encodeURIComponent(filters.brand)}&type=cars`
        );

        if (response.ok) {
          const data = await response.json();
          setAvailableModels(data.models || []);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    }

    fetchModels();
  }, [filters.brand]);

  // Apply filters when they change
  useEffect(() => {
    // If no filters are applied, show all cars
    if (!filters.brand && !filters.model && !filters.type && !filters.budget && !filters.fuelType) {
      setFilteredCars(cars);
    } else {
      // Apply filters based on what's selected
      const filtered = filterCars(filters);
      setFilteredCars(filtered);
    }
  }, [filters, cars, filterCars]);

  // Handle bookmark toggle
  const handleBookmarkToggle = (car: any) => {
    if (!car) return;

    const isCurrentlyBookmarked = isBookmarked(car._id);

    if (isCurrentlyBookmarked) {
      removeBookmark(car._id);
    } else {
      addBookmark({
        id: car._id,
        brand: car.basicInfo?.brand || "Unknown",
        name: car.basicInfo?.name || "Vehicle",
        image: car.images?.main?.[0] || "/placeholder.svg",
        price: car.basicInfo?.priceExshowroom || 0,
        slug: `${car.basicInfo?.brand
          ?.toLowerCase()
          .replace(/\s+/g, "-")}/${car.basicInfo?.name
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`,
        type: "car",
      });
    }
  };

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  const isDark = theme === "dark" || resolvedTheme === "dark";

  // Loading states
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-[1440px]">
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h2 className="text-xl font-medium text-red-800 dark:text-red-200 mb-2">
              Failed to load cars
            </h2>
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-[1440px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Car Finder</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`md:hidden flex items-center gap-1 px-3 py-2 rounded ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-64 shrink-0`}
        >
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-gray-900" : "bg-white"
            } border ${isDark ? "border-gray-800" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() =>
                  setFilters({
                    brand: "",
                    model: "",
                    type: "",
                    budget: "",
                    fuelType: "",
                    minPrice: 0,
                    maxPrice: 10000000,
                  })
                }
                className="text-xs text-blue-500 hover:underline"
              >
                Reset All
              </button>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["brand", "price", "type", "fuel"]}
            >
              {/* Brand Filter */}
              <AccordionItem value="brand" className="border-b">
                <AccordionTrigger className="py-3">Brand</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {brands.map((brand) => (
                      <label
                        key={brand.name}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <div className="pt-0.5">
                          <input
                            type="radio"
                            name="brand"
                            checked={filters.brand === brand.name}
                            onChange={() => {
                              setFilters({
                                ...filters,
                                brand: brand.name,
                                model: "", // Reset model when brand changes
                              });
                            }}
                            className="rounded-full text-primary border-gray-300 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            {brand.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 block">
                            {
                              cars.filter(
                                (car) => car.basicInfo.brand === brand.name
                              ).length
                            }{" "}
                            models
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Model Filter - Only show if a brand is selected */}
              {filters.brand && (
                <AccordionItem value="model" className="border-b">
                  <AccordionTrigger className="py-3">Model</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {availableModels.map((model) => (
                        <label
                          key={model}
                          className="flex items-start gap-2 cursor-pointer"
                        >
                          <div className="pt-0.5">
                            <input
                              type="radio"
                              name="model"
                              checked={filters.model === model}
                              onChange={() => {
                                setFilters({
                                  ...filters,
                                  model: model,
                                });
                              }}
                              className="rounded-full text-primary border-gray-300 focus:ring-primary"
                            />
                          </div>
                          <span className="text-sm font-medium">{model}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Budget Filter */}
              <AccordionItem value="price" className="border-b">
                <AccordionTrigger className="py-3">Budget</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[
                      "Under ₹5 Lakh",
                      "₹5-10 Lakh",
                      "₹10-20 Lakh",
                      "₹20-50 Lakh",
                      "Above ₹50 Lakh",
                    ].map((budget) => (
                      <label
                        key={budget}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="budget"
                          checked={filters.budget === budget}
                          onChange={() => {
                            setFilters({
                              ...filters,
                              budget: budget,
                            });
                          }}
                          className="rounded-full text-primary border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm">{budget}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Vehicle Type Filter */}
              <AccordionItem value="type" className="border-b">
                <AccordionTrigger className="py-3">
                  Vehicle Type
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {carTypes.map(({ type, count }) => (
                      <label
                        key={type}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="vehicleType"
                            checked={filters.type === type}
                            onChange={() => {
                              setFilters({
                                ...filters,
                                type: type,
                              });
                            }}
                            className="rounded-full text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm">{type}</span>
                        </div>
                        <span className="text-xs text-gray-400">({count})</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fuel Type Filter */}
              <AccordionItem value="fuel" className="border-b-0">
                <AccordionTrigger className="py-3">Fuel Type</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map(
                      (fuel) => (
                        <label
                          key={fuel}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="fuelType"
                            checked={filters.fuelType === fuel}
                            onChange={() => {
                              setFilters({
                                ...filters,
                                fuelType: fuel,
                              });
                            }}
                            className="rounded-full text-primary border-gray-300 focus:ring-primary"
                          />
                          <span className="text-sm">{fuel}</span>
                        </label>
                      )
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Car Results */}
        <div className="flex-1">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.brand && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.brand}
                <button
                  onClick={() =>
                    setFilters({ ...filters, brand: "", model: "" })
                  }
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.model && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.model}
                <button
                  onClick={() => setFilters({ ...filters, model: "" })}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.type}
                <button
                  onClick={() => setFilters({ ...filters, type: "" })}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.budget && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.budget}
                <button
                  onClick={() => setFilters({ ...filters, budget: "" })}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.fuelType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.fuelType}
                <button
                  onClick={() => setFilters({ ...filters, fuelType: "" })}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>

          {/* Results count */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredCars.length} cars found
            </p>
          </div>

          {/* Cars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
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
                  image={car.images?.main?.[0] || "/placeholder.svg"}
                  isBookmarked={isBookmarked(car._id)}
                  onFavoriteClick={() => handleBookmarkToggle(car)}
                />
              ))
            ) : (
              <div className="col-span-full py-10 text-center">
                <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Image
                    src="/sad-car.svg"
                    alt="No cars found"
                    width={60}
                    height={60}
                    className="opacity-60"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">No cars found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
