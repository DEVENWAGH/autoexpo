/**
 * Normalizes image paths to ensure they work consistently across 
 * development and production environments
 */
export const getImagePath = (path: string): string => {
  if (!path) return '/placeholder.svg';
  
  // Remove any leading slashes to prevent double slashes
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For brand logos specifically
  if (normalizedPath.includes('brands/')) {
    // Ensure lowercase for brands
    const parts = normalizedPath.split('/');
    if (parts.length >= 2) {
      const brandPart = parts[parts.length - 1];
      parts[parts.length - 1] = brandPart.toLowerCase();
      return `/${parts.join('/')}`;
    }
  }
  
  return `/${normalizedPath}`;
};

/**
 * Gets the URL for a brand's logo image
 * @param brandName The name of the brand
 * @returns The URL path to the brand's logo
 */
export const getBrandLogoUrl = (brandName: string): string => {
  if (!brandName) return '/placeholder.svg';
  return `/brands/${brandName.toLowerCase().trim()}.svg`;
};

/**
 * Properly formats a logo path to prevent duplication issues
 * @param logo The logo path or name
 * @returns A properly formatted logo path
 */
export const formatLogoPath = (logo: string): string => {
  // If it's already a full path with /brands/ prefix
  if (logo.startsWith('/brands/')) {
    return logo;
  }
  
  // If it already has .svg extension
  if (logo.endsWith('.svg')) {
    return `/brands/${logo}`;
  }
  
  // Otherwise add both prefix and extension
  return `/brands/${logo}.svg`;
};
