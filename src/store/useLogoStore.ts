import { create } from 'zustand';

type LogoState = {
  activeCategory: 'cars' | 'bikes';
  carLogos: string[];
  bikeLogos: string[];
  setActiveCategory: (category: 'cars' | 'bikes') => void;
};

export const useLogoStore = create<LogoState>((set) => ({
  activeCategory: 'cars',
  carLogos: [
  '/brands/audi.svg',
  '/brands/jaguar.svg',
  '/brands/force.svg',
  '/brands/mahindra.svg',
  '/brands/tata.svg',
  '/brands/bmw.svg',
  '/brands/mercedes.svg',
  '/brands/lexus.svg',
  '/brands/toyota.svg',
  '/brands/honda.svg',
  '/brands/volkswagen.svg',
  '/brands/ford.svg',
  '/brands/chevrolet.svg',
  '/brands/hyundai.svg',
  '/brands/kia.svg',
  '/brands/nissan.svg',
  '/brands/porsche.svg',
  '/brands/ferrari.svg',
  '/brands/lamborghini.svg',
  '/brands/tesla.svg',
  '/brands/jeep.svg',
  '/brands/skoda.svg',
  '/brands/mg.svg',
  '/brands/volvo.svg',
  '/brands/bugatti.svg',
  '/brands/bentley.svg',
  '/brands/astonmartin.svg',
  '/brands/landrover.svg',
  '/brands/mini.svg',
  '/brands/peugeot.svg',
  '/brands/rollsroyce.svg',
  '/brands/suzuki.svg',
  '/brands/vector.svg',
  '/brands/mclaren.svg',
  '/brands/fiat.svg'
  ],
  bikeLogos: [
    'bike/bajaj.svg',
    'bike/benelli.svg',
    'bike/ducati.svg',
    'bike/harleyDavidson.svg',
    'bike/honda.svg',
    'bike/husqvarna.svg',
    'bike/java.svg',
    'bike/kawasaki.svg',
    'bike/ktm.svg',
    'bike/royalEnfield.svg',
    'bike/suzuki.svg',
    'bike/tvs.svg',
    'bike/yamaha.svg',
    'bike/aprilia.svg',
    'bike/ather.svg',
    'bike/yezdi.svg',
    'bike/hero.svg'
  ],
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
