import ImageKit from 'imagekit';

class VehicleService {
  // Remove the private imageKit property since image uploads are handled by the API

  constructor() {
    // No need to initialize ImageKit here as the backend will handle it
  }

  // Create a new vehicle
  async createVehicle(formData: FormData): Promise<any> {
    try {
      // Log form data keys for debugging (not values to avoid exposing sensitive data)
      console.log('Creating vehicle with form data keys:', 
        Array.from(formData.keys()).join(', '));
      
      // Add special handling for checkboxes in formData
      // Log the entertainment and internetFeatures data for debugging
      const entertainmentData = formData.get('entertainment');
      const internetFeaturesData = formData.get('internetFeatures');

      console.log('Entertainment data:', entertainmentData ? 
        JSON.parse(entertainmentData as string) : 'No entertainment data');
      console.log('Internet Features data:', internetFeaturesData ? 
        JSON.parse(internetFeaturesData as string) : 'No internet features data');
      
      // Add credentials for authentication
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include credentials for auth
      });
      
      // Log the response status for debugging
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        // Try to get detailed error message from response
        let errorMessage = 'Failed to create vehicle';
        
        // Check content type to avoid JSON parse errors
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
            console.error('API error details:', errorData);
          } catch (parseError) {
            console.error('Failed to parse error response as JSON');
          }
        } else {
          // Handle non-JSON responses like HTML error pages
          const text = await response.text();
          console.error('Non-JSON error response:', text.substring(0, 200) + '...');
          errorMessage = `Server error (${response.status}): The server returned an invalid response`;
        }
        
        throw new Error(errorMessage);
      }

      // Safely check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        console.log('Vehicle created successfully:', result.message || 'Success');
        return result;
      } else {
        // Handle unexpected non-JSON success response
        const text = await response.text();
        console.error('Unexpected non-JSON response:', text.substring(0, 200) + '...');
        throw new Error('Server returned an invalid response format');
      }
    } catch (error) {
      console.error('Vehicle creation error:', error);
      throw error;
    }
  }

  // Get all vehicles for the current user
  async getMyVehicles(): Promise<any> {
    try {
      const response = await fetch('/api/vehicles/my-vehicles');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vehicles');
      }

      return await response.json();
    } catch (error) {
      console.error('Get vehicles error:', error);
      throw error;
    }
  }

  // Get a specific vehicle by ID
  async getVehicle(id: string): Promise<any> {
    try {
      const response = await fetch(`/api/vehicles/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vehicle');
      }

      return await response.json();
    } catch (error) {
      console.error('Get vehicle error:', error);
      throw error;
    }
  }

  // Delete a vehicle
  async deleteVehicle(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Delete vehicle error:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const vehicleService = new VehicleService();
