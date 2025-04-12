/**
 * Utility function to extract brand name from logo path
 */
export const getBrandNameFromLogo = (logoPath: string): string | null => {
  if (!logoPath) return null;
  
  // Normalize path for consistent handling
  const normalized = logoPath.toLowerCase().trim();
  
  // Map of partial paths to brand names
  const brandMappings: Record<string, string> = {
    'tata': 'Tata',
    'bmw': 'BMW',
    'toyota': 'Toyota',
    'honda': 'Honda',
    'mercedes': 'Mercedes-Benz',
    'audi': 'Audi',
    'lexus': 'Lexus',
    'kia': 'Kia',
    'hyundai': 'Hyundai',
    'tesla': 'Tesla',
    'volkswagen': 'Volkswagen',
    'vw': 'Volkswagen',
    'ford': 'Ford',
    'chevrolet': 'Chevrolet',
    'nissan': 'Nissan',
    'mazda': 'Mazda',
    'porsche': 'Porsche',
    'ferrari': 'Ferrari',
    'lamborghini': 'Lamborghini',
    'jeep': 'Jeep',
    'skoda': 'Skoda',
    'mg': 'MG',
    'volvo': 'Volvo',
    'bugatti': 'Bugatti',
    'bentley': 'Bentley',
    'astonmartin': 'Aston Martin',
    'aston': 'Aston Martin',
    'landrover': 'Land Rover',
    'land rover': 'Land Rover',
    'mini': 'Mini',
    'peugeot': 'Peugeot',
    'rollsroyce': 'Rolls Royce',
    'rolls': 'Rolls Royce',
    'suzuki': 'Suzuki',
    'vector': 'Vector',
    'mclaren': 'McLaren',
    'hero': 'Hero',
    'kawasaki': 'Kawasaki',
    'bajaj': 'Bajaj',
    'yamaha': 'Yamaha',
    'ducati': 'Ducati',
    'harley': 'Harley Davidson',
    'davidson': 'Harley Davidson',
    'royal': 'Royal Enfield',
    'enfield': 'Royal Enfield',
    'ktm': 'KTM',
    'tvs': 'TVS',
    'bmw motorrad': 'BMW Motorrad',
    'motorrad': 'BMW Motorrad',
    'jawa': 'Jawa',
    'indian': 'Indian Motorcycle',
    'triumph': 'Triumph',
  };
  
  // Check if the path contains any of our known brand identifiers
  for (const [key, value] of Object.entries(brandMappings)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  // Extract brand name from filename as fallback
  try {
    const parts = logoPath.split('/');
    const filename = parts[parts.length - 1];
    // Remove file extension and capitalize
    const brandName = filename.replace(/\.(svg|png|jpg|jpeg|webp)$/i, '')
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .trim();
      
    return brandName.charAt(0).toUpperCase() + brandName.slice(1);
  } catch (e) {
    console.error("Error parsing brand name from logo path:", e);
    return null;
  }
};
