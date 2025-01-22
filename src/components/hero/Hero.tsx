'use client';
import { useState } from "react";
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image";
import { Bruno_Ace, Squada_One } from "next/font/google";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});
const squadaFont = Squada_One({
  subsets: ["latin"],
  weight: "400",
});
export default function Hero() {
  const [selectedFilter, setSelectedFilter] = useState<"brands" | "budget">(
    "brands"
  );
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [isCarTypesOpen, setIsCarTypesOpen] = useState(false);

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
          <Tabs defaultValue="cars" className="h-auto mx-auto">
            <TabsList className="grid h-auto grid-cols-2">
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
          <button className="mb-8 w-full rounded-full bg-black py-4 text-lg text-white">
            Search
          </button>

          {/* Collapsible Sections */}
            <div className="space-y-2 rounded-t-lg bg-[#E5D8F6] p-4">
            <button
              onClick={() => setIsSetBudgetOpen(!isSetBudgetOpen)}
              className="flex w-full items-center gap-2 text-2xl font-bold"
            >
              <ChevronDown
              className={cn(
                "transition-transform",
                isSetBudgetOpen ? "rotate-180" : ""
              )}
              />
              Set Budget
            </button>
            {isSetBudgetOpen && (
              <div className="pt-2">
              {/* Add budget setting content here */}
              </div>
            )}
            </div>

            <div className="space-y-2 rounded-b-lg bg-[#E5D8F6] p-4">
            <button
              onClick={() => setIsCarTypesOpen(!isCarTypesOpen)}
              className="flex w-full items-center gap-2 text-2xl font-bold"
            >
              <ChevronDown
              className={cn(
                "transition-transform",
                isCarTypesOpen ? "rotate-180" : ""
              )}
              />
              All Car Types
            </button>
            {isCarTypesOpen && (
              <div className="pt-2">{/* Add car types content here */}</div>
            )}
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
