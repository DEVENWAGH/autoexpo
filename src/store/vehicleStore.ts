import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types
type VehicleType = 'cars' | 'bikes';

export interface VehicleState {
  vehicleType: VehicleType;
  mainImages: string[];
  interiorImages: string[];
  exteriorImages: string[];
  colorImages: string[];
  galleryImages: string[];
  formState: FormState;
  error: string;
  
  setVehicleType: (type: VehicleType) => void;
  setMainImages: (images: string[]) => void;
  setInteriorImages: (images: string[]) => void;
  setExteriorImages: (images: string[]) => void;
  setColorImages: (images: string[]) => void;
  setGalleryImages: (images: string[]) => void;
  setFormState: (state: Record<string, any>) => void;
  updateFormSection: (section: string, data: any) => void;
  setError: (error: string) => void;
  reset: () => void;
  getDefaultData: () => Record<string, any>;
}

interface FormState {
  basicInfo?: Record<string, any>;
  specs?: Record<string, any>;
  features?: Record<string, any>;
  dimensions?: Record<string, any>;
  [key: string]: any;
}

export interface ExtendedVehicleState extends VehicleState {
  formState: FormState;
  updateFormSection: (section: string, data: Record<string, any>) => void;
  resetFormState: () => void;
}

export const DEFAULT_CAR_DATA = {
  basicInfo: {
    brand: "",
    name: "",
    variant: "Base",
    priceExshowroom: "",
    priceOnroad: "",
    pros: "",
    cons: ""
  },
  engineTransmission: {
    engineType: "",
    displacement: "",
    maxPower: "",
    maxTorque: "",
    cylinders: "",
    valvesPerCylinder: "",
    turboCharger: "",
    transmissionType: "",
    gearbox: "",
    driveType: ""
  },
  fuelPerformance: {
    fuelType: "",
    fuelTankCapacity: "",
    enginePosition: "",
    engineLocation: "",
    compressionRatio: "",
    fuelSupplySystem: "",
    mileage: "",
    // ...other fields
  },
  name: "New Model",
  brand: "Toyota",
  variant: "Base",
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "1000000",
  priceExshowroom: "850000",
  pros: "Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride",
  cons: "Average Performance\nBasic Infotainment System\nLimited Color Options",
  engineType: "mHawk 130 CRDe",
  displacement: "2184",
  maxPower: "130.07bhp@3750rpm",
  maxTorque: "300Nm@1600-2800rpm",
  cylinders: "4",
  valvesPerCylinder: "4",
  transmissionType: "Automatic",
  gearbox: "6-Speed AT",
  driveType: "4WD",
  fuelType: "Diesel",
  fuelTankCapacity: "57",
  mileage: "15.6 kmpl",
  length: "3985",
  width: "1820",
  height: "1855",
  seatingCapacity: "4",
  groundClearance: "226",
  wheelBase: "2450",
  features: {
    powerSteering: true,
    airConditioner: true,
    driverAirbag: true,
    passengerAirbag: true,
    powerWindows: true,
    bluetooth: true,
  },
  dimensions: {
    length: 3985,
    width: 1820,
    height: 1855,
  }
};

export const DEFAULT_BIKE_DATA = {
  name: "Street Fighter",
  brand: "Honda",
  variant: "Base",
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "150000",
  priceExshowroom: "120000",
  pros: "Excellent Mileage\nEasy Handling\nAffordable Maintenance\nSporty Look",
  cons: "Limited Power\nBasic Features\nAverage Build Quality",
  engineType: "Single Cylinder, Liquid Cooled, DOHC, FI Engine",
  displacement: "398.63",
  maxPower: "46 PS @ 8500 rpm",
  maxTorque: "39 Nm @ 6500 rpm",
  cylinders: "1",
  coolingSystem: "Liquid Cooled",
  starting: "Self Start Only",
  fuelSupply: "Fuel Injection",
  specs: {
    engineType: "Single Cylinder, DOHC",
    displacement: 398.63,
    maxPower: "46 PS @ 8500 rpm",
  },
  dimensions: {
    length: 2105,
    width: 793,
    height: 1114,
  },
  features: {
    usbCharger: true,
    bluetooth: true,
  }
};

// Define placeholder values (not defaults) for car form
export const CAR_PLACEHOLDERS = {
  name: "New Model",
  brand: "",
  variant: "Base",
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "1000000",
  priceExshowroom: "850000",
  pros: "Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride",
  cons: "Average Performance\nBasic Infotainment System\nLimited Color Options",
  turboCharger: "Yes",
  enginePosition: "Front",
  engineLocation: "Front Transverse",
  compressionRatio: "9.8:1",
  fuelSupplySystem: "Direct Injection",
  cityMileage: "13.2",
  highwayMileage: "17.6",
  topSpeed: "180",
  acceleration: "9.5",
};

// Define placeholder values (not defaults) for bike form
export const BIKE_PLACEHOLDERS = {
  name: "Street Fighter",
  brand: "",
  variant: "Base", 
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "150000",
  priceExshowroom: "120000",
  pros: "Excellent Mileage\nEasy Handling\nAffordable Maintenance\nSporty Look",
  cons: "Limited Power\nBasic Features\nAverage Build Quality",
};

// Helper function to handle input focus/blur with default values
export const handleInputWithDefault = (
  defaultValue: string | number,
  saveFn: (value: string | number) => void
) => {
  let currentValue = defaultValue;

  return {
    onFocus: () => {
      // Clear the field when focused
      saveFn('');
    },
    onBlur: (value: string | number) => {
      // If empty on blur, restore default
      if (!value && value !== 0) {
        saveFn(defaultValue);
      }
    },
    getValue: (focused: boolean, value: string | number) => {
      // Show empty when focused, show actual value or default when blurred
      return focused ? value : value || defaultValue;
    }
  };
};

// Use persist middleware to save form state between sessions
export const useVehicleStore = create<ExtendedVehicleState>()(
  persist(
    (set, get) => ({
      vehicleType: 'cars',
      mainImages: [],
      interiorImages: [],
      exteriorImages: [],
      colorImages: [],
      galleryImages: [],
      formState: { basicInfo: {} },
      error: '',
      
      setVehicleType: (type) => {
        set({ vehicleType: type });
        
        // Don't initialize with default data automatically
        // Let the placeholders in UI handle that
      },
      
      setMainImages: (images) => set({ mainImages: images }),
      setInteriorImages: (images) => set({ interiorImages: images }),
      setExteriorImages: (images) => set({ exteriorImages: images }),
      setColorImages: (images) => set({ colorImages: images }),
      setGalleryImages: (images) => set({ galleryImages: images }),
      
      setFormState: (state) => set({ formState: state }),
      
      updateFormSection: (section, data) => set((state) => ({
        formState: {
          ...state.formState,
          [section]: {
            ...(state.formState[section] || {}),
            ...data
          }
        }
      })),

      resetFormState: () => set((state) => ({
        formState: {
          basicInfo: state.vehicleType === 'cars' ? DEFAULT_CAR_DATA : DEFAULT_BIKE_DATA
        }
      })),
      
      setError: (error) => set({ error }),
      
      reset: () => set({
        mainImages: [],
        interiorImages: [],
        exteriorImages: [],
        colorImages: [],
        galleryImages: [],
        formState: { 
          basicInfo: get().vehicleType === 'cars' ? DEFAULT_CAR_DATA : DEFAULT_BIKE_DATA 
        },
        error: '',
      }),
      
      getDefaultData: () => {
        return get().vehicleType === 'cars' ? DEFAULT_CAR_DATA : DEFAULT_BIKE_DATA;
      },

      // Helper to get placeholder values based on vehicle type
      getPlaceholderData: () => {
        return get().vehicleType === 'cars' ? CAR_PLACEHOLDERS : BIKE_PLACEHOLDERS;
      },
    }),
    {
      name: 'vehicle-store',
      // Only persist these fields
      partialize: (state) => ({
        vehicleType: state.vehicleType,
        formState: state.formState,
        mainImages: state.mainImages,
        interiorImages: state.interiorImages,
        exteriorImages: state.exteriorImages, 
        colorImages: state.colorImages,
        galleryImages: state.galleryImages,
      }),
    }
  )
);
