import axios from 'axios';
import type { ICar } from '@/models/Car';
import type { IBike } from '@/models/Bike';
import { uploadMultipleFiles } from './imageKitService';

interface VehicleFormData {
  vehicleType: 'cars' | 'bikes';
  mainImages: File[];
  interiorImages?: File[];
  exteriorImages?: File[];
  galleryImages?: File[];
  colorImages: File[];
  [key: string]: any;
}

export const vehicleService = {
  createVehicle: async (formData: FormData) => {
    try {
      const vehicleType = formData.get('vehicleType') as 'cars' | 'bikes';
      const folder = `vehicles/${vehicleType}`;
      
      // Extract image URLs from form data (they should already be uploaded)
      const mainImages = extractURLsFromFormData(formData, 'mainImages');
      const colorImages = extractURLsFromFormData(formData, 'colorImages');
      
      // Create JSON data for submission
      const jsonData: Record<string, any> = {
        // Basic details from form
        name: formData.get('name'),
        brand: formData.get('brand'),
        variant: formData.get('variant'),
        launchYear: Number(formData.get('launchYear') || new Date().getFullYear()),
        price: {
          onroad: Number(formData.get('priceOnroad') || 0),
          offroad: Number(formData.get('priceOffroad') || 0)
        },
        description: formData.get('description') || '',
        
        // Add uploaded image URLs
        mainImages,
        colorImages,
      };
      
      // Handle vehicle-specific images
      if (vehicleType === 'cars') {
        const interiorImages = extractURLsFromFormData(formData, 'interiorImages');
        const exteriorImages = extractURLsFromFormData(formData, 'exteriorImages');
        
        jsonData.interiorImages = interiorImages;
        jsonData.exteriorImages = exteriorImages;
      } else {
        const galleryImages = extractURLsFromFormData(formData, 'galleryImages');
        jsonData.galleryImages = galleryImages;
      }
      
      // Now that we have all image URLs, add all other form fields
      // Convert FormData to JSON object, excluding images
      for (const [key, value] of formData.entries()) {
        if (!key.includes('Images') && value instanceof File === false) {
          // Handle nested keys like specs.engineType
          if (key.includes('.')) {
            const [parent, child] = key.split('.');
            if (!jsonData[parent]) jsonData[parent] = {};
            jsonData[parent][child] = value;
          } else if (key !== 'vehicleType') { // Skip vehicleType as it's used for routing
            jsonData[key] = value;
          }
        }
      }

      // Organize data into proper structures as expected by models
      if (vehicleType === 'cars') {
        // Structure car data according to model
        organizeCarsData(jsonData);
      } else {
        // Structure bike data according to model
        organizeBikesData(jsonData);
      }

      // Send the data to the API
      const response = await fetch(`/api/brands/vehicles?type=${vehicleType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create vehicle');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  // Update the validateSection method to handle different section requirements
  validateSection(formData: FormData, section: string, vehicleType: 'cars' | 'bikes'): Record<string, string> {
    const errors: Record<string, string> = {};
    
    // Helper to get value from formData
    const getValue = (key: string) => formData.get(key)?.toString().trim();
    
    switch (section) {
      case 'basicInfo':
        if (!getValue('name')) {
          errors.name = 'Vehicle name is required';
        }
        if (!getValue('brand')) {
          errors.brand = 'Brand is required';
        }
        break;
        
      case 'images':
        const mainImagesCount = formData.getAll('mainImages').length;
        if (mainImagesCount === 0) {
          errors.mainImages = 'At least one main image is required';
        }
        break;
        
      case 'engineTransmission':
        if (!getValue('engineType')) {
          errors.engineType = 'Engine type is required';
        }
        if (!getValue('maxPower')) {
          errors.maxPower = 'Max power is required';
        }
        if (!getValue('maxTorque')) {
          errors.maxTorque = 'Max torque is required';
        }
        break;
        
      // For remaining sections, we're using default values so they're optional
      default:
        // No validation needed
        break;
    }
    
    return errors;
  },

  // Add a method to save form progress
  async saveFormProgress(vehicleType: 'cars' | 'bikes', formState: any) {
    try {
      const response = await axios.post('/api/brands/vehicles/save-state', {
        vehicleType,
        formState
      });
      return response.data;
    } catch (error) {
      console.error('Error saving form progress:', error);
      throw error;
    }
  },

  // Add a method to load saved form progress
  async loadFormProgress(vehicleType: 'cars' | 'bikes') {
    try {
      const response = await axios.get(`/api/brands/vehicles/save-state?vehicleType=${vehicleType}`);
      return response.data;
    } catch (error) {
      console.error('Error loading form progress:', error);
      throw error;
    }
  },

  // Add methods to get form data for a section
  getFormDataForSection(sectionData: any, section: string, vehicleType: 'cars' | 'bikes'): any {
    switch (section) {
      case 'basicInfo':
        return {
          name: sectionData.name || '',
          brand: sectionData.brand || '',
          variant: sectionData.variant || 'Base',
          launchYear: sectionData.launchYear || new Date().getFullYear(),
        };
        
      case 'images':
        return vehicleType === 'cars' ? {
          mainImages: sectionData.mainImages || [],
          interiorImages: sectionData.interiorImages || [],
          exteriorImages: sectionData.exteriorImages || [],
          colorImages: sectionData.colorImages || [],
        } : {
          mainImages: sectionData.mainImages || [],
          colorImages: sectionData.colorImages || [],
          galleryImages: sectionData.galleryImages || [],
        };
        
      // Add more section data extractors
      default:
        return {};
    }
  }
};

function processImages(formData: FormData) {
  const images = {
    mainImages: formData.getAll('mainImages'),
    colorImages: formData.getAll('colorImages')
  };

  const vehicleType = formData.get('vehicleType');

  if (vehicleType === 'cars') {
    return {
      ...images,
      interiorImages: formData.getAll('interiorImages'),
      exteriorImages: formData.getAll('exteriorImages')
    };
  }

  return {
    ...images,
    galleryImages: formData.getAll('galleryImages')
  };
}

// Helper function to extract files from FormData
function extractFilesFromFormData(formData: FormData, key: string): File[] {
  const files: File[] = [];
  formData.getAll(key).forEach((value) => {
    if (value instanceof File && value.size > 0) {
      files.push(value);
    }
  });
  return files;
}

// Helper function to extract URLs from FormData
function extractURLsFromFormData(formData: FormData, key: string): string[] {
  const urls: string[] = [];
  
  // Check if the values are already string URLs
  formData.getAll(key).forEach(value => {
    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'))) {
      urls.push(value);
    }
  });
  
  return urls;
}

// Helper function to organize car data according to model structure
function organizeCarsData(data: Record<string, any>) {
  // Setup specs object
  if (!data.specs) data.specs = {};
  
  // Map common fields to their proper locations
  if (data.engineType) data.specs.engineType = data.engineType;
  if (data.displacement) data.specs.displacement = Number(data.displacement);
  if (data.maxPower) data.specs.maxPower = data.maxPower;
  if (data.maxTorque) data.specs.maxTorque = data.maxTorque;
  if (data.cylinders) data.specs.cylinders = Number(data.cylinders);
  if (data.valvesPerCylinder) data.specs.valvesPerCylinder = Number(data.valvesPerCylinder);
  if (data.gearbox) data.specs.gearbox = data.gearbox;
  if (data.driveType) data.specs.driveType = data.driveType;
  if (data.fuelType) data.specs.fuelType = data.fuelType;
  if (data.turboCharger) data.specs.turboCharger = data.turboCharger === 'Yes' || data.turboCharger === true;
  
  // Setup dimensions
  if (!data.dimensions) data.dimensions = {};
  
  // Map dimension fields
  if (data.length) data.dimensions.length = Number(data.length);
  if (data.width) data.dimensions.width = Number(data.width);
  if (data.height) data.dimensions.height = Number(data.height);
  if (data.wheelBase) data.dimensions.wheelBase = Number(data.wheelBase);
  if (data.groundClearance) data.dimensions.groundClearance = Number(data.groundClearance);
  if (data.seatingCapacity) data.dimensions.seatingCapacity = Number(data.seatingCapacity);
  if (data.bootSpace) data.dimensions.bootSpace = Number(data.bootSpace);
  if (data.fuelTankCapacity) data.dimensions.fuelTankCapacity = Number(data.fuelTankCapacity);
  
  // Clean up copied fields
  const fieldsToRemove = [
    'engineType', 'displacement', 'maxPower', 'maxTorque', 'cylinders', 
    'valvesPerCylinder', 'gearbox', 'driveType', 'fuelType', 'turboCharger',
    'length', 'width', 'height', 'wheelBase', 'groundClearance', 
    'seatingCapacity', 'bootSpace', 'fuelTankCapacity'
  ];
  
  fieldsToRemove.forEach(field => {
    delete data[field];
  });
  
  return data;
}

// Helper function to organize bike data according to model structure
function organizeBikesData(data: Record<string, any>) {
  // Setup specs object
  if (!data.specs) data.specs = {};
  
  // Map common fields to their proper locations
  if (data.engineType) data.specs.engineType = data.engineType;
  if (data.displacement) data.specs.displacement = Number(data.displacement);
  if (data.maxPower) data.specs.maxPower = data.maxPower;
  if (data.maxTorque) data.specs.maxTorque = data.maxTorque;
  if (data.cylinders) data.specs.cylinders = Number(data.cylinders);
  if (data.coolingSystem) data.specs.coolingSystem = data.coolingSystem;
  if (data.startingType) data.specs.starting = data.startingType;
  if (data.fuelSupply) data.specs.fuelSupply = data.fuelSupply;
  if (data.clutchType) data.specs.clutchType = data.clutchType;
  if (data.gearBox) data.specs.gearBox = data.gearBox;
  if (data.driveTypeBike) data.specs.driveType = data.driveTypeBike;
  
  // Setup dimensions
  if (!data.dimensions) data.dimensions = {};
  
  // Map dimension fields
  if (data.length) data.dimensions.length = Number(data.length);
  if (data.width) data.dimensions.width = Number(data.width);
  if (data.height) data.dimensions.height = Number(data.height);
  if (data.saddleHeight) data.dimensions.saddleHeight = Number(data.saddleHeight);
  if (data.wheelbase) data.dimensions.wheelBase = Number(data.wheelbase);
  if (data.groundClearance) data.dimensions.groundClearance = Number(data.groundClearance);
  if (data.kerbWeight) data.dimensions.kerbWeight = Number(data.kerbWeight);
  if (data.fuelCapacity) data.dimensions.fuelCapacity = Number(data.fuelCapacity);
  
  // Clean up copied fields
  const fieldsToRemove = [
    'engineType', 'displacement', 'maxPower', 'maxTorque', 'cylinders',
    'coolingSystem', 'startingType', 'fuelSupply', 'clutchType', 'gearBox', 'driveTypeBike',
    'length', 'width', 'height', 'saddleHeight', 'wheelbase', 
    'groundClearance', 'kerbWeight', 'fuelCapacity'
  ];
  
  fieldsToRemove.forEach(field => {
    delete data[field];
  });
  
  return data;
}
