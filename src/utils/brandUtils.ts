import { useLogoStore } from '@/store/useLogoStore';

/**
 * Maps URL parameter brand names to database brand names
 */
export function mapUrlBrandToDatabase(brandParam: string | null): string | null {
  if (!brandParam) return null;
  
  // Get mapping function from store
  const { getFilterBrandName } = useLogoStore.getState();
  return getFilterBrandName(brandParam);
}

/**
 * Hook for client components to apply URL parameter mapping
 */
export function useInitialBrandFromUrl(brandParam: string | null): string {
  if (!brandParam) return "";
  
  // Apply mapping
  return useLogoStore.getState().getFilterBrandName(brandParam);
}
