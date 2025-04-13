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
    '/logos/Mercedes.svg',
    '/logos/Lexus.svg',     // Updated path
    '/logos/Toyota.svg',
    '/logos/Honda.svg',
    '/logos/Volkswagen.svg',
    '/logos/Ford.svg',
    '/logos/Chevrolet.svg',
    '/logos/Hyundai.svg',
    '/logos/Kia.svg',
    '/logos/Nissan.svg',
    '/logos/Porsche.svg',
    '/logos/Ferrari.svg',
    '/logos/Lamborghini.svg',
    '/logos/Tesla.svg',
    '/logos/Jeep.svg',
    '/logos/Skoda.svg',
    '/logos/MG.svg',
    '/logos/Volvo.svg',
    '/logos/Bugatti.svg',
    '/logos/Bentley.svg',
    '/logos/AstonMartin.svg',
    '/logos/LandRover.svg',
    '/logos/Mini.svg',
    '/logos/Peugeot.svg',
    '/logos/RollsRoyce.svg',
    '/logos/Suzuki.svg',
    '/logos/Tata.svg',       // Updated path
    '/logos/Mahindra.svg',
  ],
  
  // Updated to include only logos that are likely to exist
  bikeLogos: [
    '/logos/BMW.svg',
    '/logos/Honda.svg',
    '/logos/Suzuki.svg'
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
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  // Helper function to get logo by brand name
  getBrandLogo: (brand) => {
    if (!brand) return undefined;
    
    const normalizedBrand = get().getNormalizedBrandName(brand);
    const allLogos = [...get().carLogos, ...get().bikeLogos];
    
    return allLogos.find(logo => logo.toLowerCase().includes(normalizedBrand.toLowerCase()));
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
  
  getFilterBrandName: (brand) => {
    if (!brand) return '';
    return brand.toLowerCase().replace(/[-\s]+/g, '-');
  }
}));
