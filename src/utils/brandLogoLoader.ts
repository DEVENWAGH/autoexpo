/**
 * Utility to dynamically handle brand logos
 */

/**
 * Checks if a logo file exists in the public directory
 * Note: This runs on client-side only
 */
export const checkLogoExists = async (logoPath: string): Promise<boolean> => {
  try {
    const response = await fetch(logoPath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking logo existence: ${logoPath}`, error);
    return false;
  }
};

/**
 * Common brand names that might be in the public/logos directory
 * This serves as a fallback if directory reading isn't available
 */
export const COMMON_CAR_BRANDS = [
  'Mercedes', 'BMW', 'Audi', 'Toyota', 'Honda', 'Volkswagen', 'Ford',
  'Chevrolet', 'Hyundai', 'Kia', 'Nissan', 'Porsche', 'Ferrari', 'Lamborghini',
  'Tesla', 'Jeep', 'Skoda', 'MG', 'Volvo', 'Bugatti', 'Bentley', 'AstonMartin',
  'LandRover', 'Mini', 'Peugeot', 'RollsRoyce', 'Suzuki', 'Tata', 'Mahindra',
  'Jaguar', 'Lexus', 'Mazda', 'Renault', 'Fiat', 'Dacia', 'Citroen', 'Peugeot',
  'Seat', 'Mitsubishi', 'Subaru', 'Acura', 'Cadillac', 'Chrysler', 'Dodge',
  'GMC', 'Infiniti', 'Lincoln', 'Maserati', 'McLaren', 'Buick', 'Genesis'
];

export const COMMON_BIKE_BRANDS = [
  'BMW', 'Honda', 'Suzuki', 'Kawasaki', 'Yamaha', 'Ducati', 'KTM', 
  'Triumph', 'Harley-Davidson', 'RoyalEnfield', 'Bajaj', 'TVS',
  'Hero', 'Aprilia', 'Benelli', 'Husqvarna', 'MV-Agusta'
];

/**
 * Creates logo paths for provided brand names
 */
export const generateLogoPaths = (brands: string[], prefix: string = '/logos/', extension: string = '.svg'): string[] => {
  return brands.map(brand => `${prefix}${brand}${extension}`);
};

/**
 * Attempts different file extensions for a logo path
 */
export const tryAlternativeExtensions = async (basePath: string): Promise<string | null> => {
  // Try common image extensions
  const extensions = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
  
  for (const ext of extensions) {
    const pathToTry = basePath.replace(/\.[^/.]+$/, '') + ext;
    if (await checkLogoExists(pathToTry)) {
      return pathToTry;
    }
  }
  
  return null;
};

/**
 * Verifies logo paths and returns only those that exist
 */
export const getVerifiedLogos = async (paths: string[]): Promise<string[]> => {
  const verifiedLogos: string[] = [];
  
  for (const path of paths) {
    if (await checkLogoExists(path)) {
      verifiedLogos.push(path);
    } else {
      // Try alternative extensions
      const alternativePath = await tryAlternativeExtensions(path);
      if (alternativePath) {
        verifiedLogos.push(alternativePath);
      }
    }
  }
  
  return verifiedLogos;
};
