import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Add the formatIndianNumber function
export function formatIndianNumber(price: number | undefined): string {
  if (!price) return "₹ N/A";
  
  // Format to Indian currency format (lakhs and crores)
  if (price >= 10000000) {
    // 1 crore = 10000000
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    // 1 lakh = 100000
    return `₹ ${(price / 100000).toFixed(2)} Lakh`;
  } else {
    return `₹ ${price.toLocaleString("en-IN")}`;
  }
}
