export function validateVehicleData(formData: FormData, vehicleType: 'cars' | 'bikes') {
  const errors: Record<string, string> = {};

  // Only validate essential fields, since we have defaults for others
  const essentialFields = ['name', 'brand'];
  essentialFields.forEach(field => {
    const value = formData.get(field)?.toString().trim();
    if (!value) {
      errors[field] = `${field} is required`;
    }
  });

  // Validate main image
  const mainImages = formData.getAll('mainImages');
  if (mainImages.length === 0) {
    errors.mainImages = 'At least one main image is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Update the isSectionValid function to better check completion status
export function isSectionValid(sectionData: any, section: string, vehicleType: 'cars' | 'bikes'): boolean {
  if (!sectionData) return false;
  
  switch (section) {
    case 'basicInfo':
      return !!(sectionData.name?.trim() && sectionData.brand?.trim());
    
    case 'images':
      // For images section, check various ways the data might be structured
      if (Array.isArray(sectionData.mainImages) && sectionData.mainImages.length > 0) {
        return true;
      }
      if (sectionData.images?.mainImages && sectionData.images.mainImages.length > 0) {
        return true;
      }
      // If sectionData itself is an array of images (unlikely but possible)
      if (Array.isArray(sectionData) && sectionData.length > 0) {
        return true;
      }
      return false;
    
    case 'engineTransmission':
      // Be more flexible with engine data validation
      const hasEngineData = !!(
        (sectionData.engineType || sectionData.engine) && 
        (sectionData.maxPower || sectionData.power) && 
        (sectionData.maxTorque || sectionData.torque)
      );
      return hasEngineData;
      
    // For other sections, we'll consider them valid if there's any data
    default:
      return Object.keys(sectionData).some(key => {
        const value = sectionData[key];
        if (typeof value === 'string') return value.trim() !== '';
        return value !== null && value !== undefined;
      });
  }
}

// Update getSectionCompletionStatus to handle both data formats
export function getSectionCompletionStatus(formData: any, vehicleType: 'cars' | 'bikes'): Record<string, boolean> {
  if (!formData) return {};
  
  const sections = vehicleType === 'cars' 
    ? ['basicInfo', 'images', 'engineTransmission', 'fuelPerformance', 'suspensionSteeringBrakes', 
       'dimensionsCapacity', 'comfortConvenience', 'interior', 'exterior', 'safety', 
       'adasFeatures', 'entertainment', 'internetFeatures']
    : ['basicInfo', 'images', 'engineTransmission', 'features', 'featuresAndSafety', 
       'mileageAndPerformance', 'chassisAndSuspension', 'dimensionsAndCapacity', 
       'electricals', 'tyresAndBrakes', 'motorAndBattery', 'underpinnings'];
  
  const status: Record<string, boolean> = {};
  
  sections.forEach(section => {
    // Check if section data exists directly in formData
    if (formData[section]) {
      status[section] = isSectionValid(formData[section], section, vehicleType);
    } else {
      // Check for alternate data structures
      switch(section) {
        case 'images':
          // Check if images exist at root level
          const hasMainImages = Array.isArray(formData.mainImages) && formData.mainImages.length > 0;
          const hasImagesInImages = formData.images?.mainImages && formData.images.mainImages.length > 0;
          status[section] = hasMainImages || hasImagesInImages;
          break;
        default:
          status[section] = false;
      }
    }
  });
  
  return status;
}
