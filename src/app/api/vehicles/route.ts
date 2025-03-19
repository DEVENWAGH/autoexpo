import { NextRequest, NextResponse } from 'next/server';
import { Car } from '@/models/Car';
import { Bike } from '@/models/Bike';
import { auth } from "@/auth";
import { dbConnect } from '@/lib/dbConnect';
import { imageKit } from '@/lib/imageKit';

// Updated upload helper function for ImageKit with improved data URL support
const uploadImage = async (file: File | string): Promise<string> => {
  // If it's already a string URL that's not a data URL, return it
  if (typeof file === 'string') {
    if ((file.startsWith('http') || file.startsWith('/')) && !file.startsWith('data:')) {
      return file;
    }
    
    // Handle data URL
    if (file.startsWith('data:')) {
      console.log('Processing data URL for upload');
      try {
        
        // Upload to ImageKit
        const upload = await imageKit.upload({
          file: file, // ImageKit SDK handles data URLs directly
          fileName: `vehicle-${Date.now()}.jpg`,
          folder: "/vehicles",
          useUniqueFileName: true,
        });
        
        // Format the URL to match the desired format
        const baseUrl = upload.url.split('?')[0];
        console.log(`Data URL uploaded, using URL format: ${baseUrl}`);
        return baseUrl;
      } catch (error) {
        console.error('Error uploading data URL to ImageKit:', error);
        throw new Error('Failed to upload data URL image');
      }
    }
  }

  try {
    // Handle File object
    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString('base64');
    
    // Upload to ImageKit
    const upload = await imageKit.upload({
      file: base64,
      fileName: `vehicle-${Date.now()}.jpg`,
      folder: "/vehicles",
      useUniqueFileName: true,
    });
    
    // Format the URL to match the desired format
    const baseUrl = upload.url.split('?')[0];
    
    console.log(`Image uploaded, using URL format: ${baseUrl}`);
    return baseUrl;
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper to process form data
const processFormData = async (formData: FormData) => {
  const vehicleType = formData.get('vehicleType') as string;
  
  // Process form sections
  const processedData: Record<string, any> = {};
  
  // Process JSON sections
  for (const [key, value] of formData.entries()) {
    if (key !== 'vehicleType' && 
        !key.includes('Images') && 
        typeof value === 'string') {
      try {
        processedData[key] = JSON.parse(value);
      } catch (e) {
        processedData[key] = value;
      }
    }
  }
  
  // Add default values for required fields if missing
  if (processedData.basicInfo) {
    if (!processedData.basicInfo.variant) {
      processedData.basicInfo.variant = "Base";
      console.log("Added default 'Base' variant value");
    }
  }
  
  // Process image uploads
  const mainImages = formData.getAll('mainImages');
  const interiorImages = formData.getAll('interiorImages');
  const exteriorImages = formData.getAll('exteriorImages');
  const colorImages = formData.getAll('colorImages');
  const galleryImages = formData.getAll('galleryImages');
  
  // Upload all images to Cloudinary or your preferred storage
  const uploadedMainImages = await Promise.all(
    Array.from(mainImages).map(async (file) => {
      if (typeof file === 'string') return file;
      return await uploadImage(file);
    })
  );
  
  const uploadedInteriorImages = await Promise.all(
    Array.from(interiorImages).map(async (file) => {
      if (typeof file === 'string') return file;
      return await uploadImage(file);
    })
  );
  
  const uploadedExteriorImages = await Promise.all(
    Array.from(exteriorImages).map(async (file) => {
      if (typeof file === 'string') return file;
      return await uploadImage(file);
    })
  );
  
  const uploadedColorImages = await Promise.all(
    Array.from(colorImages).map(async (file) => {
      if (typeof file === 'string') return file;
      return await uploadImage(file);
    })
  );
  
  const uploadedGalleryImages = await Promise.all(
    Array.from(galleryImages).map(async (file) => {
      if (typeof file === 'string') return file;
      return await uploadImage(file);
    })
  );
  
  // Process special fields
  if (processedData.basicInfo) {
    // Process pros and cons as arrays
    if (processedData.basicInfo.pros) {
      processedData.basicInfo.pros = processedData.basicInfo.pros
        .split('\n')
        .filter((item: string) => item.trim() !== '');
    }
    
    if (processedData.basicInfo.cons) {
      processedData.basicInfo.cons = processedData.basicInfo.cons
        .split('\n')
        .filter((item: string) => item.trim() !== '');
    }
    
    // Convert price strings to numbers
    if (processedData.basicInfo.priceExshowroom) {
      processedData.basicInfo.priceExshowroom = Number(processedData.basicInfo.priceExshowroom);
    }
    
    if (processedData.basicInfo.priceOnroad) {
      processedData.basicInfo.priceOnroad = Number(processedData.basicInfo.priceOnroad);
    }
  }
  
  // Add images to the object
  const images = {
    main: uploadedMainImages,
    interior: uploadedInteriorImages,
    exterior: uploadedExteriorImages,
    color: uploadedColorImages
  };
  
  if (vehicleType === 'bikes') {
    images.gallery = uploadedGalleryImages;
  }
  
  return {
    ...processedData,
    images,
    vehicleType
  };
};

// POST /api/vehicles - Create a new vehicle
export async function POST(req: NextRequest) {
  try {
    // Update to use auth() from Next Auth v5
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Connect to the database
    await dbConnect();
    
    // Get form data
    const formData = await req.formData();
    const vehicleType = formData.get('vehicleType') as string;
    
    if (!vehicleType || !['cars', 'bikes'].includes(vehicleType)) {
      return NextResponse.json({ error: 'Invalid vehicle type' }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Log for debugging
    console.log(`Processing ${vehicleType} creation request`);
    
    try {
      // Process the form data
      const processedData = await processFormData(formData);
      
      // Add the user ID
      processedData.createdBy = (session.user as any).id;
      
      let newVehicle;
      
      if (vehicleType === 'cars') {
        newVehicle = await Car.create(processedData);
      } else {
        newVehicle = await Bike.create(processedData);
      }
      
      console.log(`${vehicleType.slice(0, -1)} created with ID: ${newVehicle._id}`);
      
      return NextResponse.json({ 
        message: 'Vehicle created successfully',
        vehicle: newVehicle
      }, { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (processingError) {
      console.error('Error processing form data:', processingError);
      return NextResponse.json({ 
        error: processingError instanceof Error ? processingError.message : 'Error processing form data' 
      }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
  } catch (error) {
    console.error('API Error creating vehicle:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create vehicle' }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// GET /api/vehicles - Get all vehicles (admin only)
export async function GET(req: NextRequest) {
  try {
    // Update to use auth() from Next Auth v5
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Check if admin (add your admin check logic)
    if (!(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    
    await dbConnect();
    
    const cars = await Car.find().sort({ createdAt: -1 });
    const bikes = await Bike.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      cars,
      bikes
    });
    
  } catch (error) {
    console.error('API Error getting vehicles:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get vehicles' },
      { status: 500 }
    );
  }
}
