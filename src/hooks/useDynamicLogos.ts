import { useState, useEffect } from 'react';
import { useLogoStore } from '@/store/useLogoStore';

/**
 * Hook for loading all brand logos dynamically
 */
export function useDynamicLogos() {
  const { addLogos, addBikeLogos, carLogos, bikeLogos } = useLogoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadAllLogos() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch car logos from the API
        const carResponse = await fetch('/api/logos?category=cars');
        
        if (carResponse.ok) {
          const carData = await carResponse.json();
          if (carData.status === 'success' && carData.logos?.length > 0) {
            // Make sure all paths are lowercase
            const lowercaseLogos = carData.logos.map((logo: string) => logo.toLowerCase());
            addLogos(lowercaseLogos);
          }
        }
        
        // Fetch bike logos from the API
        const bikeResponse = await fetch('/api/logos?category=bikes');
        
        if (bikeResponse.ok) {
          const bikeData = await bikeResponse.json();
          if (bikeData.status === 'success' && bikeData.logos?.length > 0) {
            // Make sure all paths are lowercase
            const lowercaseLogos = bikeData.logos.map((logo: string) => logo.toLowerCase());
            addBikeLogos(lowercaseLogos);
          }
        }
        
        if (!carResponse.ok && !bikeResponse.ok) {
          throw new Error('Failed to fetch logos');
        }
      } catch (err) {
        console.error('Error loading logos:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading logos');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Only fetch if we need to
    if (carLogos.length === 0 || bikeLogos.length === 0) {
      loadAllLogos();
    }
  }, [addLogos, addBikeLogos, carLogos.length, bikeLogos.length]);
  
  return { isLoading, error };
}
