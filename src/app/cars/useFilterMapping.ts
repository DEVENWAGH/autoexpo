import { useLogoStore } from "@/store/useLogoStore";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function useFilterMapping() {
  const searchParams = useSearchParams();
  const { getFilterBrandName } = useLogoStore.getState();
  
  // Get params from URL
  const rawBrand = searchParams.get("brand") ?? "";
  const initialModel = searchParams.get("model") ?? "";
  const initialType = searchParams.get("type") ?? "";
  const initialBudget = searchParams.get("budget") ?? "";

  // Apply brand name mapping to convert "Tata" to "Tata Motors" etc.
  const initialBrand = rawBrand ? getFilterBrandName(rawBrand) : "";
  
  const [filters, setFilters] = useState({
    brand: initialBrand,
    model: initialModel,
    type: initialType,
    budget: initialBudget,
    fuelType: "",
    minPrice: 0,
    maxPrice: 10000000,
  });

  return { filters, setFilters };
}
