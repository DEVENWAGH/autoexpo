'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Bike, Plus } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'CNG',
  'LPG'
] as const;

const TRANSMISSION_TYPES = [
  'Manual',
  'Automatic',
  'CVT',
  'DCT',
  'AMT',
  'DSG'
] as const;

type VehicleType = 'cars' | 'bikes';

interface VehicleFormData {
  name: string;
  brand: string;
  price: {
    starting: number;
    ending: number;
  };
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    fuelType: string;
    mileage: string;
    topSpeed: string;
    acceleration: string;
    seatingCapacity?: number;
  };
  images: {
    main: string;
    mainFileId: string;
    gallery: Array<{ url: string, fileId: string }>;
  };
  description: string;
}

export default function NewVehicle() {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState<VehicleType>('cars');
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState({ url: '', fileId: '' });
  const [gallery, setGallery] = useState<Array<{ url: string, fileId: string }>>([]);
  const [error, setError] = useState<string>('');

  const handleMainImageUpload = (url: string, fileId: string) => {
    setMainImage({ url, fileId });
  };

  const handleGalleryImageUpload = (url: string, fileId: string) => {
    setGallery(prev => [...prev, { url, fileId }]);
  };

  const removeGalleryImage = (fileId: string) => {
    setGallery(prev => prev.filter(img => img.fileId !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      if (!mainImage.url) {
        throw new Error('Main image is required');
      }

      if (!formData.get('name') || !formData.get('brand')) {
        throw new Error('Name and brand are required');
      }

      const data: VehicleFormData = {
        name: formData.get('name') as string,
        brand: formData.get('brand') as string,
        price: {
          starting: Number(formData.get('priceStart')),
          ending: Number(formData.get('priceEnd'))
        },
        specs: {
          engine: formData.get('engine') as string,
          power: formData.get('power') as string,
          torque: formData.get('torque') as string,
          transmission: formData.get('transmission') as string,
          fuelType: formData.get('fuelType') as string,
          mileage: formData.get('mileage') as string,
          topSpeed: formData.get('topSpeed') as string,
          acceleration: formData.get('acceleration') as string,
          ...(vehicleType === 'cars' && {
            seatingCapacity: Number(formData.get('seatingCapacity'))
          })
        },
        images: {
          main: mainImage.url,
          mainFileId: mainImage.fileId,
          gallery: gallery
        },
        description: formData.get('description') as string
      };

      const res = await fetch(`/api/brands/vehicles?type=${vehicleType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create vehicle');
      }

      router.push('/brands/dashboard');
      router.refresh();

    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-6">Add New Vehicle</h1>

          {/* Vehicle Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setVehicleType('cars')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                vehicleType === 'cars' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Car className="w-5 h-5" />
              Car
            </button>
            <button
              type="button"
              onClick={() => setVehicleType('bikes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                vehicleType === 'bikes' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <Bike className="w-5 h-5" />
              Bike
            </button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Vehicle Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="e.g., Civic Type R"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                required
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="e.g., Honda"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Starting Price (₹)
              </label>
              <input
                type="number"
                name="priceStart"
                required
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Maximum Price (₹)
              </label>
              <input
                type="number"
                name="priceEnd"
                required
                className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Engine</label>
              <input
                type="text"
                name="engine"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Power</label>
              <input
                type="text"
                name="power"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Torque</label>
              <input
                type="text"
                name="torque"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Transmission</label>
              <select
                name="transmission"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="">Select Transmission</option>
                {TRANSMISSION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fuel Type</label>
              <select
                name="fuelType"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="">Select Fuel Type</option>
                {FUEL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Mileage</label>
              <input
                type="text"
                name="mileage"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Top Speed</label>
              <input
                type="text"
                name="topSpeed"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Acceleration (0-100)</label>
              <input
                type="text"
                name="acceleration"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
              />
            </div>
            {vehicleType === 'cars' && (
              <div>
                <label className="block text-sm font-medium text-gray-300">Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  required
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Main Image
              </label>
              <ImageUpload
                onUploadSuccess={handleMainImageUpload}
                onUploadError={(error) => setError(error.message)}
                label="Upload Main Image"
              />
              {mainImage.url && (
                <div className="mt-2">
                  <img
                    src={mainImage.url}
                    alt="Main vehicle image"
                    className="w-40 h-40 object-cover rounded"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gallery Images
              </label>
              <ImageUpload
                onUploadSuccess={handleGalleryImageUpload}
                onUploadError={(error) => setError(error.message)}
                isMultiple
                label="Upload Gallery Images"
              />
              {gallery.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map((img) => (
                    <div key={img.fileId} className="relative">
                      <img
                        src={img.url}
                        alt="Gallery image"
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(img.fileId)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                      >
                        <Plus className="w-4 h-4 text-white transform rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg bg-blue-600 text-white font-medium ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Vehicle'}
        </button>
      </form>
    </div>
  );
}
