import { imageKit, verifyImageKitConfig } from '@/lib/imageKit';
import axios from 'axios';

/**
 * Uploads a file to ImageKit
 * @param file The file to upload
 * @param fileName Optional custom file name
 * @param folder The folder to upload to (e.g., 'vehicles/cars', 'vehicles/bikes')
 * @returns Promise with the uploaded file URL
 */
export const uploadFile = async (file: File, fileName?: string, folder: string = 'vehicles'): Promise<string> => {
  try {
    verifyImageKitConfig();
    
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Generate a unique file name if not provided
    const uniqueFileName = fileName || `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload to ImageKit
    const response = await imageKit.upload({
      file: base64,
      fileName: uniqueFileName,
      folder: folder,
    });
    
    // Return the URL of the uploaded file
    return response.url;
  } catch (error) {
    console.error('Error uploading file to ImageKit:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Uploads multiple files to ImageKit
 * @param files Array of files to upload
 * @param folder The folder to upload to
 * @returns Promise with array of uploaded file URLs
 */
export const uploadMultipleFiles = async (files: File[], folder: string = 'vehicles'): Promise<string[]> => {
  if (!files.length) return [];
  
  const uploadPromises = files.map((file) => uploadFile(file, undefined, folder));
  return Promise.all(uploadPromises);
};

/**
 * Uploads multiple files to ImageKit through our API endpoint
 */
export async function uploadMultipleFilesThroughAPI(files: File[], folder: string = '/vehicles'): Promise<string[]> {
  const urls: string[] = [];
  
  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      const response = await axios.post('/api/imagekit/upload', formData);
      
      if (response.data.success && response.data.url) {
        urls.push(response.data.url);
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
    }
  }
  
  return urls;
}

/**
 * Converts a file to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
