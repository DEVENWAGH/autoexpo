/**
 * Maps the filename from logo SVG to actual brand name
 */
export const getBrandNameFromLogo = (logoPath: string): string => {
  if (!logoPath.includes('/')) {
    return '';
  }
  
  // Extract filename from path
  const parts = logoPath.split('/');
  const filename = parts[parts.length - 1];
  let brandName = filename.replace('.svg', '');
  
  // First letter uppercase, rest lowercase
  brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase();
  
  // Special case mappings for car brands
  const carBrandMappings: Record<string, string> = {
    'Tata': 'Tata Motors',
    'Mg': 'MG Motor',
    'Landrover': 'Land Rover',
    'Astonmartin': 'Aston Martin',
    'Rollsroyce': 'Rolls Royce',
    'Mercedesbenz': 'Mercedes-Benz',
    'Bmw': 'BMW',
    'Byd': 'BYD',
    'Kia': 'Kia',
    'Tvs': 'TVS',
    'Mgmotor': 'MG Motor',
    'Mini': 'MINI'
  };
  
  // Special case mappings for bike brands
  const bikeBrandMappings: Record<string, string> = {
    'Harleydavidson': 'Harley Davidson',
    'RoyalEnfield': 'Royal Enfield',
    'Ktm': 'KTM',
    'Bmw': 'BMW',
    'Tvs': 'TVS',
    'Hero': 'Hero MotoCorp',
    'Java': 'Jawa'
  };
  
  // Check if this is a car or bike brand path
  const isBikePath = logoPath.toLowerCase().includes('bike/');
  
  // Apply the appropriate mapping
  if (isBikePath && bikeBrandMappings[brandName]) {
    return bikeBrandMappings[brandName];
  } else if (!isBikePath && carBrandMappings[brandName]) {
    return carBrandMappings[brandName];
  }
  
  return brandName;
};
