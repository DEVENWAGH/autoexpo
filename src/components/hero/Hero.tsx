'use client';
import { useState } from "react";
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image";
import { Bruno_Ace, Squada_One } from "next/font/google";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});
const squadaFont = Squada_One({
  subsets: ["latin"],
  weight: "400",
});
export default function Hero() {
  const [activeTab, setActiveTab] = useState("cars");
  const [selectedFilter, setSelectedFilter] = useState<"brands" | "budget">("brands");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  const carBudgetRanges = [
    "Under ₹5 Lakh",
    "₹5-10 Lakh",
    "₹10-20 Lakh",
    "₹20-50 Lakh",
    "Above ₹50 Lakh"
  ];

  const bikeBudgetRanges = [
    "Under ₹1 Lakh",
    "₹1-2 Lakh",
    "₹2-5 Lakh",
    "Above ₹5 Lakh"
  ];

  const carTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Luxury",
    "Sports",
    "Electric"
  ];

  const bikeTypes = [
    "Sport",
    "Cruiser",
    "Adventure",
    "Commuter",
    "Electric",
    "Scooter"
  ];

  return (
    <section className="w-full max-w-[1440px] h-[860px] mx-auto mt-8 bg-[#D0BCFF] rounded-[50px] border border-black relative">
      <div className="absolute right-0 top-0 w-[1009px] h-[621px]">
        <Image
          src="./Audi.svg"
          alt="Audi"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex my-12 ml-5 justify-start bg-[#0C041F] w-[22rem] rounded-2xl items-center h-[30rem]">
        <div className="w-46 h-auto absolute px-4 md:px-6">
          <Tabs defaultValue="cars" className="h-auto mx-auto" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid h-auto grid-cols-2 [&>*[data-state=active]]:bg-[#7129a1]">
              <TabsTrigger value="cars" className="h-16">
                Cars
              </TabsTrigger>
              <TabsTrigger value="bikes" className="h-16">
                Bikes
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* Filter Toggles */}
            <div className="my-8 flex justify-center gap-4">
            <button
              onClick={() => setSelectedFilter("brands")}
              className={cn(
              "rounded-t-full rounded-r-none px-8 py-2 text-lg text-white transition-colors",
              selectedFilter === "brands" ? "bg-[#7C3AED]" : "bg-[#1F1B2A]"
              )}
            >
              By Brands
            </button>
            <button
              onClick={() => setSelectedFilter("budget")}
              className={cn(
              "rounded-b-full rounded-l-none px-8 py-2 text-lg text-white transition-colors",
              selectedFilter === "budget" ? "bg-[#7C3AED]" : "bg-[#1F1B2A]"
              )}
            >
              BY Budget
            </button>
          </div>

          {/* Search Button */}
          <button className="mb-8 w-full rounded-full bg-[#7129a1] py-4 text-lg text-white">
            Search
          </button>

          {/* Budget Select */}
          <div className="space-y-2 rounded-t-lg bg-[#E5D8F6] p-4">
            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger className="w-full text-xl">
                <SelectValue placeholder="Set Budget" />
              </SelectTrigger>
              <SelectContent>
                {(activeTab === "cars" ? carBudgetRanges : bikeBudgetRanges).map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Types Select */}
          <div className="space-y-2 rounded-b-lg bg-[#E5D8F6] p-4">
            <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
              <SelectTrigger className="w-full text-xl">
                <SelectValue placeholder={`Select ${activeTab === "cars" ? "Car" : "Bike"} Type`} />
              </SelectTrigger>
              <SelectContent>
                {(activeTab === "cars" ? carTypes : bikeTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="absolute left-8 top-[621px] w-[616px]">
        <h1
          className={`${brunoFont.className} mt-6 text-5xl font-bruno text-black leading-[120%]`}
        >
          Explore Your Dream Ride, Before You Drive!
        </h1>
      </div>
      <div className="absolute left-[650px] ml-6 top-[633px] w-[634px]">
        <p
          className={`${squadaFont.className} font-squada text-4xl leading-[150%] text-[#4F378A]`}
        >
          Your One-Stop Destination for All Things Automotive – Discover the
          Best Cars and Bikes Before You Hit the Road!
        </p>
      </div>
    </section>
  );
}
