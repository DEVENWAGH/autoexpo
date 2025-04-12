import { create } from 'zustand';

interface LogoStoreState {
  activeCategory: string;
  carLogos: string[];
  bikeLogos: string[];
  allLogos: string[]; // Added all logos array
  setActiveCategory: (category: string) => void;
  getBrandLogo: (brand: string) => string | undefined;
  getNormalizedBrandName: (brand: string) => string;
  getFilterBrandName: (brand: string) => string; // Add the missing function
}

export const useLogoStore = create<LogoStoreState>((set, get) => ({
  activeCategory: 'cars',
  
  // List all logos that should be shown in the carousel
  carLogos: [
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
    '/brands/Tata.svg',
    '/brands/Mahindra.svg',
  ],
  
  // Updated to include only logos that are likely to exist
  bikeLogos: [
    '/brands/BMW.svg',
    '/brands/Honda.svg',
    '/brands/Suzuki.svg'
  ],
  
  // Combined array of all unique logos
  get allLogos() {
    const carSet = new Set(get().carLogos);
    const combined = [...get().carLogos];
    
    // Add bike logos that aren't already in the car logos
    get().bikeLogos.forEach(bikeLogo => {
      if (!carSet.has(bikeLogo)) {
        combined.push(bikeLogo);
      }
    });
    
    return combined;
  },
  
  getNormalizedBrandName: (brand) => {
    if (!brand) return '';
    
    // Handle special cases and normalize brand names
    const normalizedMap: Record<string, string> = {
      'mercedes-benz': 'Mercedes',
      'mercedes': 'Mercedes',
      'tata motors': 'Tata',
      'land rover': 'Land Rover',
      'mg motor': 'MG',
      'harley davidson': 'Harley Davidson',
      'royal enfield': 'Royal Enfield',
      'rolls royce': 'Rolls Royce',
      'aston martin': 'Aston Martin'
    }
    
    const normalized = brand.toLowerCase().trim();
    return normalizedMap[normalized] || normalized;
  },
  
  // Add the missing function that was causing the error
  getFilterBrandName: (brand) => {
    // Reuse the existing normalization function for consistency
    return get().getNormalizedBrandName(brand);
  },
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  // Helper function to get logo by brand name
  getBrandLogo: (brand) => {
    const state = get();
    const normalizedBrand = state.getNormalizedBrandName(brand);
    
    // First try category-specific logos
    const categoryLogos = state.activeCategory === 'cars' ? state.carLogos : state.bikeLogos;
    const brandLogo = categoryLogos.find(logo => 
      logo.toLowerCase().includes(normalizedBrand.toLowerCase())
    );
    
    // If not found in category, try all logos
    if (!brandLogo) {
      return state.allLogos.find(logo => 
        logo.toLowerCase().includes(normalizedBrand.toLowerCase())
      );
    }
    
    return brandLogo;
  },
}));
