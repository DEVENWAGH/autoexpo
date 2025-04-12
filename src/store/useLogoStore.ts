import { create } from 'zustand';

// Add this interface to better define our brand mapping structure
interface BrandMappings {
  // Logo mappings (what appears in SVG filenames)
  logoToDisplay: Record<string, string>;
  // Filter mappings (what appears in database/URL params)
  displayToDatabase: Record<string, string>;
  // Reverse mappings (database to display names)
  databaseToDisplay: Record<string, string>;
}

type LogoState = {
  activeCategory: 'cars' | 'bikes';
  carLogos: string[];
  bikeLogos: string[];
  brandMappings: BrandMappings;
  setActiveCategory: (category: 'cars' | 'bikes') => void;
  getBrandLogo: (brand: string) => string | undefined;
  getNormalizedBrandName: (brand: string) => string;
  getFilterBrandName: (brand: string) => string;
  getDatabaseBrandName: (brand: string) => string;
};

export const useLogoStore = create<LogoState>((set, get) => ({
  activeCategory: 'cars',
  carLogos: [
    '/brands/Audi.svg',
    '/brands/Jaguar.svg',
    '/brands/Force.svg',
    '/brands/Mahindra.svg',
    '/brands/Tata.svg',
    '/brands/BMW.svg',
    '/brands/Mercedes.svg',
    '/brands/Lexus.svg',
    '/brands/Toyota.svg',
    '/brands/Honda.svg',
    '/brands/Volkswagen.svg',
    '/brands/Ford.svg',
    '/brands/Chevrolet.svg',
    '/brands/Hyundai.svg',
    '/brands/Kia.svg',
    '/brands/Nissan.svg',
    '/brands/Porsche.svg',
    '/brands/Ferrari.svg',
    '/brands/Lamborghini.svg',
    '/brands/Tesla.svg',
    '/brands/Jeep.svg',
    '/brands/Skoda.svg',
    '/brands/MG.svg',
    '/brands/Volvo.svg',
    '/brands/Bugatti.svg',
    '/brands/Bentley.svg',
    '/brands/AstonMartin.svg',
    '/brands/LandRover.svg',
    '/brands/Mini.svg',
    '/brands/Peugeot.svg',
    '/brands/RollsRoyce.svg',
    '/brands/Suzuki.svg',
    '/brands/Vector.svg',
    '/brands/McLaren.svg',
    '/brands/Fiat.svg'
  ],
  bikeLogos: [
    '/bike/Bajaj.svg',
    '/bike/Benelli.svg',
    '/bike/Ducati.svg',
    '/bike/HarleyDavidson.svg',
    '/bike/Honda.svg',
    '/bike/Husqvarna.svg',
    '/bike/Java.svg',
    '/bike/Kawasaki.svg',
    '/bike/KTM.svg',
    '/bike/RoyalEnfield.svg',
    '/bike/Suzuki.svg',
    '/bike/TVS.svg',
    '/bike/Yamaha.svg',
    '/bike/Aprilia.svg',
    '/bike/Ather.svg',
    '/bike/Yezdi.svg',
    '/bike/Hero.svg'
  ],
  
  // Comprehensive brand mappings
  brandMappings: {
    // Logo to display name mappings
    logoToDisplay: {
      'tata': 'Tata',
      'tata motors': 'Tata',
      'land rover': 'LandRover',
      'mercedes-benz': 'Mercedes',
      'mercedes benz': 'Mercedes',
      'mg motor': 'MG',
      'royal enfield': 'RoyalEnfield',
      'harley davidson': 'HarleyDavidson',
      'rolls royce': 'RollsRoyce',
      'aston martin': 'AstonMartin'
    },
    
    // Display name to database name mappings
    displayToDatabase: {
      'tata': 'Tata Motors',
      'land rover': 'Land Rover',
      'mercedes': 'Mercedes-Benz',
      'mercedes-benz': 'Mercedes-Benz', 
      'mg': 'MG Motor',
      'harley': 'Harley Davidson',
      'royal enfield': 'Royal Enfield',
      'rolls royce': 'Rolls Royce',
      'aston martin': 'Aston Martin'
    },
    
    // Database name to display name mappings (reverse of above)
    databaseToDisplay: {
      'tata motors': 'Tata',
      'land rover': 'Land Rover',
      'mercedes-benz': 'Mercedes',
      'mg motor': 'MG',
      'harley davidson': 'Harley Davidson',
      'royal enfield': 'Royal Enfield',
      'rolls royce': 'Rolls Royce',
      'aston martin': 'Aston Martin'
    }
  },
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  // Helper function to get logo by brand name
  getBrandLogo: (brand) => {
    const state = get();
    const normalizedBrand = state.getNormalizedBrandName(brand);
    
    const brandLogo = state.activeCategory === 'cars' 
      ? state.carLogos.find(logo => logo.toLowerCase().includes(normalizedBrand.toLowerCase()))
      : state.bikeLogos.find(logo => logo.toLowerCase().includes(normalizedBrand.toLowerCase()));
      
    return brandLogo;
  },
  
  // Helper function to normalize brand names for logos - used by getBrandLogo
  getNormalizedBrandName: (brand) => {
    const state = get();
    const lowercaseBrand = brand.toLowerCase();
    return state.brandMappings.logoToDisplay[lowercaseBrand] || brand;
  },
  
  // Helper function for filtering/search that maps URL parameter names to database names
  getFilterBrandName: (brand) => {
    const state = get();
    const lowercaseBrand = brand.toLowerCase();
    
    // First, check direct mappings
    if (state.brandMappings.displayToDatabase[lowercaseBrand]) {
      return state.brandMappings.displayToDatabase[lowercaseBrand];
    }
    
    // Special case for Tata → Tata Motors
    if (lowercaseBrand === 'tata') {
      return 'Tata Motors';
    }
    
    // For other brands, return the original with proper capitalization
    return brand;
  },
  
  // Additional helper to convert database names back to display names
  getDatabaseBrandName: (brand) => {
    const state = get();
    const lowercaseBrand = brand.toLowerCase();
    return state.brandMappings.databaseToDisplay[lowercaseBrand] || brand;
  }
}));
