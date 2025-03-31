/**
 * Generate a slug from brand and model
 */
export function generateVehicleSlug(brand: string, model: string): string {
  // Special case for Tata Motors
  if (brand === "Tata Motors") {
    const brandSlug = "tata-motors";
    const modelSlug = model.toLowerCase().trim().replace(/\s+/g, '-');
    return `${brandSlug}/${modelSlug}`;
  }
  
  // Standard case
  const brandSlug = brand.toLowerCase().trim().replace(/\s+/g, '-');
  const modelSlug = model.toLowerCase().trim().replace(/\s+/g, '-');
  
  return `${brandSlug}/${modelSlug}`;
}

/**
 * Parse a vehicle URL to extract brand and model
 */
export function parseVehicleSlug(slug: string): {brand: string, model: string} | null {
  if (!slug) return null;
  
  const parts = slug.split('/');
  if (parts.length < 2) return null;
  
  return {
    brand: parts[0].replace(/-/g, ' '),
    model: parts[1].replace(/-/g, ' ')
  };
}

/**
 * Tries different combinations to create a proper vehicle slug
 */
export function normalizeVehicleSlug(brand: string, model: string): string {
  // Special handling for Tata Motors
  if (brand.toLowerCase().includes('tata')) {
    return `tata-motors/${model.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  return generateVehicleSlug(brand, model);
}
