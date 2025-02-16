'use client';

import { useRouter } from 'next/navigation';
import { Car, Bike } from 'lucide-react';
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useVehicleStore } from '@/store/useVehicleStore';

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

export default function NewVehicle() {
  const router = useRouter();
  const {
    vehicleType,
    mainImages,
    interiorImages,
    exteriorImages,
    colorImages,
    galleryImages,
    loading,
    error,
    setVehicleType,
    setMainImages,
    setInteriorImages,
    setExteriorImages,
    setColorImages,
    setGalleryImages,
    setLoading,
    setError,
    reset
  } = useVehicleStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      if (mainImages.length === 0) {
        throw new Error('At least one main image is required');
      }

      const commonData = {
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
        description: formData.get('description') as string
      };

      const data = vehicleType === 'cars' 
        ? {
            ...commonData,
            mainImages,
            interiorImages,
            exteriorImages,
            colorImages
          }
        : {
            ...commonData,
            mainImages,
            colorImages,
            galleryImages
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

      reset(); // Reset store after successful submission
      router.push('/brands/dashboard');
      router.refresh();

    } catch (error) {
      console.error('Submission error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  const renderSpecifications = () => (
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
  );

  const renderImageUploads = () => (
    vehicleType === 'cars' ? (
      <>
        <MultipleImageUpload
          images={mainImages}
          onChange={setMainImages}
          onRemove={(index) => {
            const newImages = [...mainImages];
            newImages.splice(index, 1);
            setMainImages(newImages);
          }}
          maxFiles={5}
          label="Main Images"
        />
        <MultipleImageUpload
          images={interiorImages}
          onChange={setInteriorImages}
          onRemove={(index) => {
            const newImages = [...interiorImages];
            newImages.splice(index, 1);
            setInteriorImages(newImages);
          }}
          maxFiles={8}
          label="Interior Images"
        />
        <MultipleImageUpload
          images={exteriorImages}
          onChange={setExteriorImages}
          onRemove={(index) => {
            const newImages = [...exteriorImages];
            newImages.splice(index, 1);
            setExteriorImages(newImages);
          }}
          maxFiles={8}
          label="Exterior Images"
        />
        <MultipleImageUpload
          images={colorImages}
          onChange={setColorImages}
          onRemove={(index) => {
            const newImages = [...colorImages];
            newImages.splice(index, 1);
            setColorImages(newImages);
          }}
          maxFiles={10}
          label="Color Variants"
        />
      </>
    ) : (
      <>
        <MultipleImageUpload
          images={mainImages}
          onChange={setMainImages}
          onRemove={(index) => {
            const newImages = [...mainImages];
            newImages.splice(index, 1);
            setMainImages(newImages);
          }}
          maxFiles={5}
          label="Main Images"
        />
        <MultipleImageUpload
          images={colorImages}
          onChange={setColorImages}
          onRemove={(index) => {
            const newImages = [...colorImages];
            newImages.splice(index, 1);
            setColorImages(newImages);
          }}
          maxFiles={10}
          label="Color Variants"
        />
        <MultipleImageUpload
          images={galleryImages}
          onChange={setGalleryImages}
          onRemove={(index) => {
            const newImages = [...galleryImages];
            newImages.splice(index, 1);
            setGalleryImages(newImages);
          }}
          maxFiles={15}
          label="Gallery Images"
        />
      </>
    )
  );

  return (
    <main className="min-h-screen bg-gray-950 p-8">
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
          {renderSpecifications()}

          {/* Image Uploads */}
          {renderImageUploads()}

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

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

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
    </main>
  );
}
