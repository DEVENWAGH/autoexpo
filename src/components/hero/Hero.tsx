"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Bruno_Ace, Squada_One } from "next/font/google";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import localFont from "next/font/local";
import { useLogoStore } from "@/store/useLogoStore";
import { useTheme } from "next-themes";

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});
const squadaFont = Squada_One({
  subsets: ["latin"],
  weight: "400",
});
const Monument_Extended = localFont({
  src: "../../app/fonts/MonumentExtended-Regular.ttf",
  weight: "400",
});

export default function Hero() {
  const [activeTab, setActiveTab] = useState("cars");
  const [selectedFilter, setSelectedFilter] = useState<"brands" | "budget">(
    "brands"
  );
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const setActiveCategory = useLogoStore((state) => state.setActiveCategory);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const carBudgetRanges = [
    "Under ₹5 Lakh",
    "₹5-10 Lakh",
    "₹10-20 Lakh",
    "₹20-50 Lakh",
    "Above ₹50 Lakh",
  ];

  const bikeBudgetRanges = [
    "Under ₹1 Lakh",
    "₹1-2 Lakh",
    "₹2-5 Lakh",
    "Above ₹5 Lakh",
  ];

  const carTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Luxury",
    "Sports",
    "Electric",
  ];

  const bikeTypes = [
    "Sport",
    "Cruiser",
    "Adventure",
    "Commuter",
    "Electric",
    "Scooter",
  ];

  const carBrands = ["Audi", "BMW", "Mercedes", "Tesla"];
  const bikeBrands = ["Harley-Davidson", "Ducati", "Yamaha", "Kawasaki"];

  const carModels: Record<string, string[]> = {
    Audi: ["A4", "A6", "Q7"],
    BMW: ["X1", "X3", "X5"],
    Mercedes: ["C-Class", "E-Class", "S-Class"],
    Tesla: ["Model S", "Model 3", "Model X"],
  };

  const bikeModels: Record<string, string[]> = {
    "Harley-Davidson": ["Street 750", "Iron 883", "Forty-Eight"],
    Ducati: ["Panigale V4", "Monster 821", "Scrambler"],
    Yamaha: ["YZF-R1", "MT-09", "FZ-07"],
    Kawasaki: ["Ninja 300", "Z650", "Versys 650"],
  };

  const brands = activeTab === "cars" ? carBrands : bikeBrands;
  const models =
    activeTab === "cars"
      ? carModels[selectedBrand] || []
      : bikeModels[selectedBrand] || [];

  // Reset selections when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveCategory(value as "cars" | "bikes");
    // Reset all selections
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedBudget("");
    setSelectedVehicleType("");
  };

  // Determine appropriate colors based on theme - maintain purple
  const bgColor =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-[#4F378A]" // Dark purple for dark mode
      : "bg-[#D0BCFF]"; // Light purple for light mode

  const textColor =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white"
      : "text-black";

  const accentTextColor =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-[#E9D5FF]" // Light purple text for dark mode
      : "text-[#4F378A]"; // Dark purple text for light mode

  return (
    <section
      className={`w-full max-w-[1440px] h-[860px] mx-auto mt-8 ${bgColor} rounded-[50px] border ${
        mounted && (theme === "dark" || resolvedTheme === "dark")
          ? "border-gray-700"
          : "border-black"
      } relative`}
    >
      <div className="absolute right-0 top-0 w-[1009px] h-[621px]">
        <Image
          src="./Audi.svg"
          alt="Audi"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex my-12 ml-5 justify-start bg-gradient-to-br from-[#1a0533] to-[#0C041F] w-[22rem] rounded-2xl items-center h-[30rem] shadow-xl">
        <div className="w-auto h-auto absolute px-4 md:px-6">
          <Tabs
            defaultValue="cars"
            className="h-auto mx-auto"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid h-auto grid-cols-2 bg-[#000000] text-white [&>*[data-state=active]]:bg-gradient-to-r [&>*[data-state=active]]:from-[#7129a1] [&>*[data-state=active]]:to-[#9747FF] [&>*]:text-white">
              <TabsTrigger
                value="cars"
                className={`h-16 text-lg ${Monument_Extended.className}`}
              >
                Cars
              </TabsTrigger>
              <TabsTrigger
                value="bikes"
                className={`h-16 text-lg ${Monument_Extended.className}`}
              >
                Bikes
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* Filter Toggles */}
          <div className="my-8 flex justify-center gap-4">
            <button
              onClick={() => setSelectedFilter("brands")}
              className={cn(
                "rounded-l-full rounded-r-none px-8 py-2 text-lg text-white transition-all duration-300",
                selectedFilter === "brands"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#9747FF] shadow-lg"
                  : "bg-[#000000] hover:bg-[#2a2438]"
              )}
            >
              By Brands
            </button>
            <button
              onClick={() => setSelectedFilter("budget")}
              className={cn(
                "rounded-r-full rounded-l-none px-8 py-2 text-lg text-white transition-all duration-300",
                selectedFilter === "budget"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#9747FF] shadow-lg"
                  : "bg-[#000000] hover:bg-[#2a2438]"
              )}
            >
              By Budget
            </button>
          </div>

          {/* Search Button */}
          <button
            className={`mb-8 w-full rounded-full bg-gradient-to-r from-[#7129a1] to-[#9747FF] py-4 text-lg text-white shadow-lg transition-all hover:shadow-xl active:scale-95 ${Monument_Extended.className}`}
          >
            Search
          </button>

          {selectedFilter === "budget" ? (
            <>
              {/* Budget Select */}
              <div className="space-y-2 rounded-t-lg bg-[#E5D8F6] p-4">
                <Select
                  value={selectedBudget}
                  onValueChange={setSelectedBudget}
                >
                  <SelectTrigger className="w-full text-xl bg-[#E5D8F6] text-black border-[#7129a1]">
                    <SelectValue placeholder="Set Budget" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#E5D8F6] border-[#7129a1] text-black">
                    {(activeTab === "cars"
                      ? carBudgetRanges
                      : bikeBudgetRanges
                    ).map((budget) => (
                      <SelectItem
                        key={budget}
                        value={budget}
                        className="hover:bg-[#7129a1] focus:bg-[#7129a1]"
                      >
                        {budget}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Types Select */}
              <div className="space-y-2 rounded-b-lg bg-[#E5D8F6] p-4">
                <Select
                  value={selectedVehicleType}
                  onValueChange={setSelectedVehicleType}
                >
                  <SelectTrigger className="w-full text-xl bg-[#E5D8F6] text-black border-[#7129a1]">
                    <SelectValue
                      placeholder={`Select ${
                        activeTab === "cars" ? "Car" : "Bike"
                      } Type`}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#E5D8F6] border-[#7129a1] text-black">
                    {(activeTab === "cars" ? carTypes : bikeTypes).map(
                      (type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="hover:bg-[#7129a1] focus:bg-[#7129a1]"
                        >
                          {type}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Brand Select */}
              <div className="space-y-2 rounded-t-lg bg-[#E5D8F6] p-4">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full text-xl bg-[#E5D8F6] text-black border-[#7129a1]">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#E5D8F6] text-black">
                    {brands.map((brand) => (
                      <SelectItem
                        key={brand}
                        value={brand}
                        className="hover:bg-[#7129a1] focus:bg-[#7129a1]"
                      >
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Select */}
              <div className="space-y-2 rounded-b-lg bg-[#E5D8F6] p-4">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full text-xl bg-[#E5D8F6] text-black border-[#7129a1]">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#E5D8F6] text-black">
                    {models.map((model) => (
                      <SelectItem
                        key={model}
                        value={model}
                        className="hover:bg-[#7129a1] focus:bg-[#7129a1]"
                      >
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="absolute left-8 top-[621px] w-[616px]">
        <h1
          className={`${brunoFont.className} mt-6 text-5xl font-bruno ${textColor} leading-[120%]`}
        >
          Explore Your Dream Ride, Before You Drive!
        </h1>
      </div>
      <div className="absolute left-[650px] ml-6 top-[633px] w-[634px]">
        <p
          className={`${squadaFont.className} font-squada text-4xl leading-[150%] ${accentTextColor}`}
        >
          Your One-Stop Destination for All Things Automotive – Discover the
          Best Cars and Bikes Before You Hit the Road!
        </p>
      </div>
    </section>
  );
}
