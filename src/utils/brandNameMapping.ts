/**
 * Extracts brand name from logo path
 */
export function getBrandNameFromLogo(logoPath: string): string | null {
  if (!logoPath) return null;
  
  // Remove path and extension
  const filename = logoPath.split('/').pop()?.split('.')[0] || '';
  
  // Special case mappings (for paths that don't match brand names exactly)
  const specialCases: Record<string, string> = {
    'astonmartin': 'Aston Martin',
    'harleyDavidson': 'Harley Davidson',
    'landrover': 'Land Rover',
    'rollsroyce': 'Rolls Royce',
    'royalEnfield': 'Royal Enfield',
    'java': 'Jawa', // Correcting if there's a typo in the file name
    'mg': 'MG',
    'bmw': 'BMW',
    'tvs': 'TVS',
    'ktm': 'KTM',
  };
  
  // Check if it's a special case
  if (specialCases[filename]) {
    return specialCases[filename];
  }
  
  // Otherwise capitalize first letter of each word
  return filename
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}
