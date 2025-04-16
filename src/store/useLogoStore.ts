import { create } from 'zustand';

interface LogoStoreState {
  activeCategory: 'cars' | 'bikes';
  carLogos: string[];
  bikeLogos: string[];
  allLogos: string[];
  setActiveCategory: (category: 'cars' | 'bikes') => void;
  addLogos: (logos: string[]) => void;
  addBikeLogos: (logos: string[]) => void;
}

export const useLogoStore = create<LogoStoreState>((set, get) => ({
  activeCategory: 'cars',
  
  // List all logos that should be shown in the carousel
  carLogos: [
    '/logos/mercedes.svg',
    '/logos/lexus.svg',
    '/logos/toyota.svg',
    '/logos/honda.svg',
    '/logos/volkswagen.svg',
    '/logos/ford.svg',
    '/logos/chevrolet.svg',
    '/logos/hyundai.svg',
    '/logos/kia.svg',
    '/logos/nissan.svg',
    '/logos/porsche.svg',
    '/logos/ferrari.svg',
    '/logos/lamborghini.svg',
    '/logos/tesla.svg',
    '/logos/jeep.svg',
    '/logos/skoda.svg',
    '/logos/mg.svg',
    '/logos/volvo.svg',
    '/logos/bugatti.svg',
    '/logos/bentley.svg',
    '/logos/astonmartin.svg',
    '/logos/landrover.svg',
    '/logos/mini.svg',
    '/logos/peugeot.svg',
    '/logos/rollsroyce.svg',
    '/logos/suzuki.svg',
    '/logos/tata.svg',
    '/logos/mahindra.svg',
  ],
  
  // Simplify bike logo paths - just use brand names without extensions
  // The component will try multiple paths/extensions to find the right file
  bikeLogos: [
    'yamaha',
    'honda',
    'suzuki',
    'kawasaki',
    'ducati',
    'harley-davidson',
    'triumph',
    'bmw',
    'ktm',
    'royal-enfield',
    'tvs',
    'bajaj',
    'hero',
    'benelli',
    'aprilia',
  ],
  
  // Dynamically select logos based on active category
  get allLogos() {
    return get().activeCategory === 'cars' ? get().carLogos : get().bikeLogos;
  },
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  addLogos: (logos) => set((state) => ({ carLogos: [...logos] })),
  
  addBikeLogos: (logos) => set((state) => ({ bikeLogos: [...logos] })),
}));
