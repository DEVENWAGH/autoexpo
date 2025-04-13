/**
 * Helper functions for working with logo files across different environments
 */

// Map of fixed file paths for brands with known case-sensitivity issues
export const BRAND_FILE_PATHS: Record<string, string[]> = {
  // Each brand can have multiple possible filenames to try
  "lexus": [
    "/brands/lexus.svg",
    "/brands/Lexus.svg", 
    "/brands/LEXUS.svg"
  ],
  "tata": [
    "/brands/tata.svg",
    "/brands/Tata.svg",
    "/brands/TATA.svg"
  ],
  // Add more problematic brands as needed
};

/**
 * Gets alternative file paths to try for a given logo path
 */
export function getAlternativeLogoPaths(logoPath: string): string[] {
  if (!logoPath) return [];
  
  // Extract the brand name from the path
  const parts = logoPath.toLowerCase().split('/');
  const filename = parts[parts.length - 1];
  const brandName = filename.replace(/\.(svg|png|jpe?g)$/i, '');
  
  // Return known alternatives for this brand
  if (BRAND_FILE_PATHS[brandName]) {
    return BRAND_FILE_PATHS[brandName];
  }
  
  // If no specific alternatives, try basic case variations
  const baseName = parts.slice(0, -1).join('/');
  return [
    logoPath.toLowerCase(),
    `${baseName}/${brandName.charAt(0).toUpperCase() + brandName.slice(1)}.svg`,
    `${baseName}/${brandName.toUpperCase()}.svg`
  ];
}

/**
 * Creates an image element to proactively check if a logo exists
 */
export function preloadLogoImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * Attempts to find a working logo path by trying alternatives
 */
export async function findWorkingLogoPath(logoPath: string): Promise<string> {
  // First try the original path
  if (await preloadLogoImage(logoPath)) {
    return logoPath;
  }

  // Then try alternatives
  const alternatives = getAlternativeLogoPaths(logoPath);
  for (const alt of alternatives) {
    if (await preloadLogoImage(alt)) {
      return alt;
    }
  }

  // If all fail, return placeholder
  return '/placeholder.svg';
}
