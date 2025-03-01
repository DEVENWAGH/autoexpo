'use client';

import { useRouter } from 'next/navigation';
import { Car, Bike } from 'lucide-react';
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useVehicleStore } from '@/store/useVehicleStore';
import { useState } from 'react';

const CAR_FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'CNG',
  'LPG'
] as const;

const BIKE_FUEL_TYPES = [
  'Petrol',
  'Electric',
  'Hybrid',
  'CNG'
] as const;

const VARIANT_TYPES = [
  'Base',
  'Top'
] as const;

const TRANSMISSION_TYPES = [
  'Manual',
  'Automatic',
  'CVT',
  'DCT',
  'AMT',
  'DSG'
] as const;

const DRIVE_TYPES = ['2WD', '4WD'] as const;
const STEERING_TYPES = ['Hydraulic', 'Electric'] as const;
const STEERING_COLUMNS = ['Tilt', 'Telescopic'] as const;
const BRAKE_TYPES = ['Disc', 'Drum'] as const;
const PARKING_SENSOR_TYPES = ['Front', 'Rear', 'Both', 'None'] as const;
const USB_LOCATIONS = ['Front', 'Rear', 'Both'] as const;
const UPHOLSTERY_TYPES = ['Fabric', 'Leatherette', 'Leather'] as const;
const FOG_LIGHT_POSITIONS = ['Front', 'Rear', 'Both', 'None'] as const;
const SPEAKER_LOCATIONS = ['Front', 'Rear', 'Both'] as const;

const SPEC_SECTIONS = [
  { id: 'basicInfo', label: 'Basic Information' },
  { id: 'images', label: 'Images' },
  { id: 'engineTransmission', label: 'Engine & Transmission' },
  { id: 'fuelPerformance', label: 'Fuel & Performance' },
  { id: 'suspensionSteeringBrakes', label: 'Suspension, Steering & Brakes' },
  { id: 'dimensionsCapacity', label: 'Dimensions & Capacity' },
  { id: 'comfortConvenience', label: 'Comfort & Convenience' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'safety', label: 'Safety' },
  { id: 'entertainment', label: 'Entertainment & Communication' },
  { id: 'internetFeatures', label: 'Advance Internet Feature' }
] as const;

const BIKE_SECTIONS = [
  { id: 'basicInfo', label: 'Basic Information' },
  { id: 'images', label: 'Images' },
  { id: 'engineTransmission', label: 'Engine & Transmission' },
  { id: 'features', label: 'Features' },
  { id: 'featuresAndSafety', label: 'Features & Safety' },
  { id: 'mileageAndPerformance', label: 'Mileage & Performance' },
  { id: 'chassisAndSuspension', label: 'Chassis & Suspension' },
  { id: 'dimensionsAndCapacity', label: 'Dimensions & Capacity' },
  { id: 'electricals', label: 'Electricals' },
  { id: 'tyresAndBrakes', label: 'Tyres & Brakes' },
  { id: 'motorAndBattery', label: 'Motor & Battery' },
  { id: 'underpinnings', label: 'Underpinnings' }
] as const;

const COOLING_SYSTEMS = ['Liquid Cooled', 'Air Cooled'] as const;
const STARTING_TYPES = ['Self Start Only', 'Kick and Self Start'] as const;
const FUEL_SUPPLY_TYPES = ['Fuel Injection', 'Carburetor'] as const;
const CONSOLE_TYPES = ['Digital', 'Analog', 'Digital-Analog'] as const;
const SEAT_TYPES = ['Split', 'Single', 'Step-up'] as const;
const LIGHT_TYPES = ['LED', 'Halogen', 'Projector', 'Bulb'] as const;
const ABS_TYPES = ['Single Channel', 'Dual Channel', 'None'] as const;
const DRIVE_TYPES_BIKE = ['Chain Drive', 'Belt Drive'] as const;

const CAR_BRANDS = [
  'Audi', 'Tata', 'Jaguar', 'Force', 'Mahindra', 'Lexus', 'BMW', 'Mercedes', 
  'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 
  'Nissan', 'Porsche', 'Ferrari', 'Lamborghini', 'Tesla', 'Jeep', 'Skoda',
  'MG', 'Volvo', 'Bugatti', 'Bentley', 'Aston Martin', 'Land Rover', 'Mini',
  'Peugeot', 'Rolls Royce', 'Suzuki', 'Vector', 'McLaren', 'Fiat'
] as const;

const BIKE_BRANDS = [
  'Bajaj', 'Benelli', 'Ducati', 'Harley Davidson', 'Honda', 'Husqvarna',
  'Java', 'Kawasaki', 'KTM', 'Royal Enfield', 'Suzuki', 'TVS', 'Yamaha',
  'Aprilia', 'Ather', 'Yezdi', 'Hero'
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
  
  const activeSections = vehicleType === 'cars' ? SPEC_SECTIONS : BIKE_SECTIONS;
  
  const [activeSection, setActiveSection] = useState<string>(activeSections[0].id);

  const handleNextSection = () => {
    const currentIndex = activeSections.findIndex(section => section.id === activeSection);
    if (currentIndex < activeSections.length - 1) {
      setActiveSection(activeSections[currentIndex + 1].id);
    }
  };

  const handlePreviousSection = () => {
    const currentIndex = activeSections.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(activeSections[currentIndex - 1].id);
    }
  };

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
        variant: formData.get('variant') as string,
        price: {
          onroad: Number(formData.get('priceOnroad')),
          offroad: Number(formData.get('priceOffroad'))
        },
        specs: {
          engine: formData.get('engine') as string,
          power: formData.get('power') as string,
          torque: formData.get('torque') as string,
          mileage: formData.get('mileage') as string,
          topSpeed: formData.get('topSpeed') as string,
          fuelType: formData.get('fuelType') as string,
          ...(vehicleType === 'cars' && {
            transmission: formData.get('transmission') as string,
            seatingCapacity: Number(formData.get('seatingCapacity'))
          })
        },
        description: formData.get('description') as string
      };

      const specifications = {
        engineTransmission: {
          engineType: formData.get('engineType'),
          displacement: Number(formData.get('displacement')),
          maxPower: formData.get('maxPower'),
          maxTorque: formData.get('maxTorque'),
          cylinders: Number(formData.get('cylinders')),
          valvesPerCylinder: Number(formData.get('valvesPerCylinder')),
          turboCharger: formData.get('turboCharger') === 'true',
          transmissionType: formData.get('transmissionType'),
          gearbox: formData.get('gearbox'),
          driveType: formData.get('driveType')
        },
        fuelPerformance: {
          fuelType: formData.get('fuelType'),
          fuelTankCapacity: Number(formData.get('fuelTankCapacity')),
          highwayMileage: formData.get('highwayMileage'),
          emissionNorm: formData.get('emissionNorm')
        },
        suspensionSteeringBrakes: {
          frontSuspension: formData.get('frontSuspension'),
          rearSuspension: formData.get('rearSuspension'),
          steeringType: formData.get('steeringType'),
          steeringColumn: formData.get('steeringColumn'),
          steeringGearType: formData.get('steeringGearType'),
          frontBrakeType: formData.get('frontBrakeType'),
          rearBrakeType: formData.get('rearBrakeType'),
          frontWheelSize: Number(formData.get('frontWheelSize')),
          rearWheelSize: Number(formData.get('rearWheelSize'))
        },
        dimensionsCapacity: {
          length: Number(formData.get('length')),
          width: Number(formData.get('width')),
          height: Number(formData.get('height')),
          seatingCapacity: Number(formData.get('seatingCapacity')),
          groundClearance: Number(formData.get('groundClearance')),
          wheelBase: Number(formData.get('wheelBase')),
          approachAngle: Number(formData.get('approachAngle')),
          breakoverAngle: Number(formData.get('breakoverAngle')),
          departureAngle: Number(formData.get('departureAngle')),
          doors: Number(formData.get('doors'))
        },
        comfortConvenience: {
          powerSteering: formData.get('powerSteering') === 'true',
          airConditioner: formData.get('airConditioner') === 'true',
          heater: formData.get('heater') === 'true',
          adjustableSteering: formData.get('adjustableSteering') === 'true',
          heightAdjustableDriverSeat: formData.get('heightAdjustableDriverSeat') === 'true',
          accessoryPowerOutlet: formData.get('accessoryPowerOutlet') === 'true',
          rearReadingLamp: formData.get('rearReadingLamp') === 'true',
          adjustableHeadrest: formData.get('adjustableHeadrest') === 'true',
          cruiseControl: formData.get('cruiseControl') === 'true',
          parkingSensors: formData.get('parkingSensors'),
          foldableRearSeat: formData.get('foldableRearSeat'),
          keylessEntry: formData.get('keylessEntry') === 'true',
          voiceCommands: formData.get('voiceCommands') === 'true',
          usbCharger: formData.get('usbCharger'),
          laneChangeIndicator: formData.get('laneChangeIndicator') === 'true',
          followMeHomeHeadlamps: formData.get('followMeHomeHeadlamps') === 'true'
        },
        interior: {
          tachometer: formData.get('tachometer') === 'true',
          gloveBox: formData.get('gloveBox') === 'true',
          upholstery: formData.get('upholstery'),
          digitalCluster: formData.get('digitalCluster') === 'true'
        },
        exterior: {
          adjustableHeadlamps: formData.get('adjustableHeadlamps') === 'true',
          rearWindowDefogger: formData.get('rearWindowDefogger') === 'true',
          alloyWheels: formData.get('alloyWheels') === 'true',
          integratedAntenna: formData.get('integratedAntenna') === 'true',
          halogenHeadlamps: formData.get('halogenHeadlamps') === 'true',
          fogLights: formData.get('fogLights'),
          tyreSize: formData.get('tyreSize'),
          tyreType: formData.get('tyreType'),
          ledTaillights: formData.get('ledTaillights') === 'true'
        },
        safety: {
          abs: formData.get('abs') === 'true',
          brakeAssist: formData.get('brakeAssist') === 'true',
          centralLocking: formData.get('centralLocking') === 'true',
          airbags: Number(formData.get('airbags')),
          driverAirbag: formData.get('driverAirbag') === 'true',
          passengerAirbag: formData.get('passengerAirbag') === 'true',
          ebd: formData.get('ebd') === 'true',
          seatBeltWarning: formData.get('seatBeltWarning') === 'true',
          tpms: formData.get('tpms') === 'true',
          engineImmobilizer: formData.get('engineImmobilizer') === 'true',
          esc: formData.get('esc') === 'true',
          speedSensingDoorLock: formData.get('speedSensingDoorLock') === 'true',
          isofix: formData.get('isofix') === 'true',
          hillDescentControl: formData.get('hillDescentControl') === 'true',
          hillAssist: formData.get('hillAssist') === 'true'
        },
        entertainment: {
          radio: formData.get('radio') === 'true',
          integrated2DINAudio: formData.get('integrated2DINAudio') === 'true',
          bluetooth: formData.get('bluetooth') === 'true',
          touchscreen: formData.get('touchscreen') === 'true',
          touchscreenSize: formData.get('touchscreenSize'),
          connectivity: (formData.get('connectivity') as string).split(','),
          speakers: Number(formData.get('speakers')),
          usbPorts: formData.get('usbPorts') === 'true',
          inbuiltApps: formData.get('inbuiltApps'),
          tweeters: Number(formData.get('tweeters')),
          speakerLocation: formData.get('speakerLocation')
        },
        internetFeatures: {
          eCallICall: formData.get('eCallICall') === 'true',
          overSpeedingAlert: formData.get('overSpeedingAlert') === 'true'
        }
      };

      const data = {
        ...commonData,
        specifications,
        mainImages,
        interiorImages,
        exteriorImages,
        colorImages,
        createdAt: new Date(),
        updatedAt: new Date()
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

  const InputField = ({ 
    name, 
    defaultValue, 
    type = "text", 
    className = "", 
    ...props 
  }) => {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={!isFocused ? defaultValue : ""}
        className={`mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2 ${className}`}
        {...props}
      />
    );
  };

  const renderSpecifications = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-300">Variant</label>
        <select
          name="variant"
          required
          className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
        >
          <option value="">Select Variant</option>
          {VARIANT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
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
      {vehicleType === 'cars' && (
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
      )}
      <div>
        <label className="block text-sm font-medium text-gray-300">Fuel Type</label>
        <select
          name="fuelType"
          required
          className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
        >
          <option value="">Select Fuel Type</option>
          {(vehicleType === 'cars' ? CAR_FUEL_TYPES : BIKE_FUEL_TYPES).map((type) => (
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
      <div>
        <label className="block text-sm font-medium text-gray-300">On-Road Price (₹)</label>
        <input
          type="number"
          name="priceOnroad"
          required
          className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Off-Road Price (₹)</label>
        <input
          type="number"
          name="priceOffroad"
          required
          className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white"
        />
      </div>
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

  const renderSectionFields = () => {
    switch (activeSection) {
      case 'basicInfo':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Brand Name</label>
              <select
                name="brand"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="">Select Brand</option>
                {(vehicleType === 'cars' ? CAR_BRANDS : BIKE_BRANDS).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Model Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Camry, Civic"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Variant</label>
              <select
                name="variant"
                required
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="">Select Variant</option>
                {VARIANT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Launch Year</label>
              <input
                type="number"
                name="launchYear"
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                defaultValue={new Date().getFullYear()}
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                placeholder="Enter vehicle description..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Pros</label>
              <textarea
                name="pros"
                rows={3}
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                placeholder="Enter one pro per line"
              />
              <p className="text-xs text-gray-400 mt-1">Press Enter for each new point. Each will be displayed as a bullet point.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300">Cons</label>
              <textarea
                name="cons"
                rows={3}
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                placeholder="Enter one con per line"
              />
              <p className="text-xs text-gray-400 mt-1">Press Enter for each new point. Each will be displayed as a bullet point.</p>
            </div>
          </div>
        );

      case 'images':
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Cover Image</label>
              <MultipleImageUpload
                images={mainImages}
                onChange={setMainImages}
                onRemove={(index) => {
                  const newImages = [...mainImages];
                  newImages.splice(index, 1);
                  setMainImages(newImages);
                }}
                maxFiles={1}
                label="Main Cover Image"
              />
            </div>

            {vehicleType === 'cars' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Interior Gallery</label>
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">Exterior Gallery</label>
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
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Gallery Images</label>
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
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Color Variants</label>
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
            </div>
          </div>
        );

      case 'engineTransmission':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Engine Type</label>
              <InputField
                name="engineType"
                defaultValue="mHawk 130 CRDe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Displacement (cc)</label>
              <InputField
                name="displacement"
                defaultValue="2184"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Max Power</label>
              <InputField
                name="maxPower"
                defaultValue="130.07bhp@3750rpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Max Torque</label>
              <InputField
                name="maxTorque"
                defaultValue="300Nm@1600-2800rpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">No. of Cylinders</label>
              <InputField
                name="cylinders"
                defaultValue={4}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Valves Per Cylinder</label>
              <InputField
                name="valvesPerCylinder"
                defaultValue={4}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Turbo Charger</label>
              <select
                name="turboCharger"
                defaultValue="Yes"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Transmission Type</label>
              <select
                name="transmissionType"
                defaultValue="Automatic"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Gearbox</label>
              <InputField
                name="gearbox"
                defaultValue="6-Speed AT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Drive Type</label>
              <select
                name="driveType"
                defaultValue="4WD"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                <option value="2WD">2WD</option>
                <option value="4WD">4WD</option>
              </select>
            </div>
          </div>
        );

      case 'fuelPerformance':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Fuel Type</label>
              <select
                name="fuelType"
                defaultValue="Diesel"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {['Petrol', 'Diesel', 'CNG', 'Electric'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Fuel Tank Capacity (Litres)</label>
              <InputField
                name="fuelTankCapacity"
                defaultValue={57}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Highway Mileage</label>
              <InputField
                name="highwayMileage"
                defaultValue="10 kmpl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Emission Norm Compliance</label>
              <InputField
                name="emissionNorm"
                defaultValue="BS VI 2.0"
              />
            </div>
          </div>
        );

      case 'suspensionSteeringBrakes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Front Suspension</label>
              <InputField
                name="frontSuspension"
                defaultValue="Double wishbone suspension"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Rear Suspension</label>
              <InputField
                name="rearSuspension"
                defaultValue="Multi-link, Solid Axle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Steering Type</label>
              <select
                name="steeringType"
                defaultValue="Hydraulic"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {STEERING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Steering Column</label>
              <select
                name="steeringColumn"
                defaultValue="Tilt"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {STEERING_COLUMNS.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Steering Gear Type</label>
              <InputField
                name="steeringGearType"
                defaultValue="Rack & Pinion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Front Brake Type</label>
              <select
                name="frontBrakeType"
                defaultValue="Disc"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {BRAKE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Rear Brake Type</label>
              <select
                name="rearBrakeType"
                defaultValue="Drum"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {BRAKE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Front Wheel Size (Inch)</label>
              <InputField
                name="frontWheelSize"
                defaultValue={18}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Rear Wheel Size (Inch)</label>
              <InputField
                name="rearWheelSize"
                defaultValue={18}
                type="number"
              />
            </div>
          </div>
        );

      case 'dimensionsCapacity':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Length (mm)</label>
              <InputField
                name="length"
                defaultValue={3985}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Width (mm)</label>
              <InputField
                name="width"
                defaultValue={1820}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Height (mm)</label>
              <InputField
                name="height"
                defaultValue={1855}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Seating Capacity</label>
              <InputField
                name="seatingCapacity"
                defaultValue={4}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Ground Clearance (mm)</label>
              <InputField
                name="groundClearance"
                defaultValue={226}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Wheel Base (mm)</label>
              <InputField
                name="wheelBase"
                defaultValue={2450}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Approach Angle</label>
              <InputField
                name="approachAngle"
                defaultValue={41.2}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Break-over Angle</label>
              <InputField
                name="breakoverAngle"
                defaultValue={26.2}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Departure Angle</label>
              <InputField
                name="departureAngle"
                defaultValue={36}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">No. of Doors</label>
              <InputField
                name="doors"
                defaultValue={3}
                type="number"
              />
            </div>
          </div>
        );

      case 'comfortConvenience':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="powerSteering"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Power Steering</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="airConditioner"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Air Conditioner</span>
              </label>
              {/* Add remaining checkboxes */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Parking Sensors</label>
              <select
                name="parkingSensors"
                defaultValue="Rear"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {PARKING_SENSOR_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Foldable Rear Seat</label>
              <InputField
                name="foldableRearSeat"
                defaultValue="50:50 Split"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">USB Charger</label>
              <select
                name="usbCharger"
                defaultValue="Front"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {USB_LOCATIONS.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'interior':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tachometer"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Tachometer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="gloveBox"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Glove Box</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="digitalCluster"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Digital Cluster</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Upholstery</label>
              <select
                name="upholstery"
                defaultValue="Leatherette"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {UPHOLSTERY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'exterior':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="adjustableHeadlamps"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Adjustable Headlamps</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rearWindowDefogger"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Rear Window Defogger</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="alloyWheels"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Alloy Wheels</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="integratedAntenna"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Integrated Antenna</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="halogenHeadlamps"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Halogen Headlamps</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledTaillights"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">LED Taillights</span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Fog Lights</label>
                <select
                  name="fogLights"
                  defaultValue="Front"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {FOG_LIGHT_POSITIONS.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Tyre Size</label>
                <InputField
                  name="tyreSize"
                  defaultValue="255/65 R18"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Tyre Type</label>
                <InputField
                  name="tyreType"
                  defaultValue="Tubeless All-Terrain"
                />
              </div>
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {['abs', 'brakeAssist', 'centralLocking', 'driverAirbag', 'passengerAirbag', 'ebd', 'seatBeltWarning', 'tpms', 'engineImmobilizer', 'esc', 'speedSensingDoorLock', 'isofix', 'hillDescentControl', 'hillAssist'].map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={feature}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {feature.split(/(?=[A-Z])/).join(' ')}
                  </span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">No. of Airbags</label>
              <InputField
                name="airbags"
                defaultValue={2}
                type="number"
              />
            </div>
          </div>
        );

      case 'entertainment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {['radio', 'integrated2DINAudio', 'bluetooth', 'touchscreen', 'usbPorts'].map(feature => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={feature}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {feature.split(/(?=[A-Z])/).join(' ')}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Touchscreen Size</label>
                <InputField
                  name="touchscreenSize"
                  defaultValue="7 Inch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Connectivity</label>
                <select
                  name="connectivity"
                  multiple
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  <option value="Android Auto">Android Auto</option>
                  <option value="Apple CarPlay">Apple CarPlay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">No. of Speakers</label>
                <InputField
                  name="speakers"
                  defaultValue={4}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Inbuilt Apps</label>
                <InputField
                  name="inbuiltApps"
                  defaultValue="BlueSense"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Tweeters</label>
                <InputField
                  name="tweeters"
                  defaultValue={2}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Speaker Location</label>
                <select
                  name="speakerLocation"
                  defaultValue="Both"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {SPEAKER_LOCATIONS.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'internetFeatures':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="eCallICall"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">E-Call & I-Call</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-300">Over Speeding Alert</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <form onSubmit={handleSubmit} className="max-w-full mx-auto">
        <div className="flex gap-6">
          {/* Side Panel */}
          <div className="w-64 flex-shrink-0 bg-gray-900 p-4 rounded-lg border border-gray-800">
            <nav className="space-y-2 sticky top-4">
              {activeSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 bg-gray-900 p-6 rounded-lg border border-gray-800">
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

            {/* Dynamic Section Content */}
            <div className="space-y-6">
              {renderSectionFields()}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePreviousSection}
                disabled={activeSection === activeSections[0].id}
                className={`px-6 py-2 rounded-lg bg-gray-700 text-white font-medium ${
                  activeSection === activeSections[0].id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                }`}
              >
                Previous
              </button>

              {activeSection === activeSections[activeSections.length - 1].id ? (
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Creating...' : 'Create Vehicle'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
