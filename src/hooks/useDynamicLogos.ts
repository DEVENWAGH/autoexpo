import { useState, useEffect } from 'react';
import { useLogoStore } from '@/store/useLogoStore';

/**
 * Hook for loading all brand logos dynamically
 */
export function useDynamicLogos() {
  const { addLogos, allLogos } = useLogoStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadAllLogos() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all logos from the API
        const response = await fetch('/api/logos');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch logos: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.logos?.length > 0) {
          // Add the logos to the store
          addLogos(data.logos);
        }
      } catch (err) {
        console.error('Error loading logos:', err);
        setError(err instanceof Error ? err.message : 'Unknown error loading logos');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Only fetch if we need to
    if (allLogos.length === 0) {
      loadAllLogos();
    }
  }, [addLogos, allLogos.length]);
  
  return { isLoading, error };
}
