"use client";

import { useRouter } from "next/navigation";
import { Car, Bike } from "lucide-react";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useState, useCallback, useEffect, useRef } from "react";
import { vehicleService } from "@/services/vehicleService";
import {
  validateVehicleData,
  isSectionValid,
  getSectionCompletionStatus,
} from "@/utils/validateVehicleData";
import { toast } from "react-hot-toast";
import {
  FormSelect,
  FormInput,
  FormCheckbox,
} from "@/components/ui/form-components";
import { useAuthCheck } from "@/lib/authCheck";
import { useTheme } from "next-themes";

const CAR_FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "CNG",
  "LPG",
] as const;

const BIKE_FUEL_TYPES = ["Petrol", "Electric", "Hybrid", "CNG"] as const;
const VARIANT_TYPES = ["Base", "Mid", "Top"] as const;
const TRANSMISSION_TYPES = [
  "Manual",
  "Automatic",
  "CVT",
  "DCT",
  "AMT",
  "DSG",
] as const;

const DRIVE_TYPES = ["2WD", "4WD"] as const;
const STEERING_TYPES = ["Hydraulic", "Electric"] as const;
const STEERING_COLUMNS = ["Tilt", "Telescopic"] as const;
const BRAKE_TYPES = ["Disc", "Drum"] as const;
const PARKING_SENSOR_TYPES = ["Front", "Rear", "Front & Rear", "None"] as const;
const USB_LOCATIONS = ["Front", "Rear", "Front & Rear"] as const;
const UPHOLSTERY_TYPES = ["Fabric", "Leatherette", "Leather"] as const;
const FOG_LIGHT_POSITIONS = ["Front", "Rear", "Front & Rear", "None"] as const;
const SPEAKER_LOCATIONS = ["Front", "Rear", "Front & Rear"] as const;
const SUNROOF_TYPES = [
  "None",
  "Regular",
  "Panoramic",
  "Single-Pane",
  "Multi-Pane",
] as const;

const TYRE_TYPES = [
  "Radial Tubeless",
  "Tubeless",
  "Tube Type",
  "Run Flat",
  "Bias Ply",
  "All-Season",
  "All-Terrain",
  "Highway Terrain",
  "Mud Terrain",
] as const;

const SPEC_SECTIONS = [
  { id: "basicInfo", label: "Basic Information" },
  { id: "images", label: "Images" },
  { id: "engineTransmission", label: "Engine & Transmission" },
  { id: "fuelPerformance", label: "Fuel & Performance" },
  { id: "suspensionSteeringBrakes", label: "Suspension, Steering & Brakes" },
  { id: "dimensionsCapacity", label: "Dimensions & Capacity" },
  { id: "comfortConvenience", label: "Comfort & Convenience" },
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "safety", label: "Safety" },
  { id: "adasFeatures", label: "ADAS Features" },
  { id: "entertainment", label: "Entertainment & Communication" },
  { id: "internetFeatures", label: "Advance Internet Feature" },
] as const;

const BIKE_SECTIONS = [
  { id: "basicInfo", label: "Basic Information" },
  { id: "images", label: "Images" },
  { id: "engineTransmission", label: "Engine & Transmission" },
  { id: "features", label: "Features" },
  { id: "featuresAndSafety", label: "Features & Safety" },
  { id: "mileageAndPerformance", label: "Mileage & Performance" },
  { id: "chassisAndSuspension", label: "Chassis & Suspension" },
  { id: "dimensionsAndCapacity", label: "Dimensions & Capacity" },
  { id: "electricals", label: "Electricals" },
  { id: "tyresAndBrakes", label: "Tyres & Brakes" },
  { id: "motorAndBattery", label: "Motor & Battery" },
  { id: "underpinnings", label: "Underpinnings" },
] as const;

const COOLING_SYSTEMS = ["Liquid Cooled", "Oil Cooled", "Air Cooled"] as const;
const STARTING_TYPES = ["Self Start Only", "Kick and Self Start"] as const;
const FUEL_SUPPLY_TYPES = ["Fuel Injection", "Carburetor"] as const;
const CONSOLE_TYPES = ["Digital", "Analog", "Digital-Analog"] as const;
const INSTRUMENT_DISPLAY_TYPES = [
  "Digital",
  "Analog",
  "Not Available",
] as const;
const SEAT_TYPES = ["Split", "Single", "Step-up"] as const;
const LIGHT_TYPES = ["LED", "Halogen", "Projector", "Bulb"] as const;
const ABS_TYPES = ["Single Channel", "Dual Channel", "None"] as const;
const DRIVE_TYPES_BIKE = ["Chain Drive", "Belt Drive"] as const;

const CLUTCH_TYPES = [
  "Assist & Slipper",
  "Wet Multi-plate",
  "Dry",
  "Manual",
] as const;
const IGNITION_TYPES = ["Electronic", "Digital", "Contactless", "CDI"] as const;
const BODY_TYPES = [
  "Sports Naked Bikes",
  "Sports Bikes",
  "Cruiser",
  "Commuter",
  "Adventure",
  "Scooter",
] as const;

const CAR_BRANDS = [
  "Audi",
  "Tata",
  "Jaguar",
  "Force",
  "Mahindra",
  "Lexus",
  "BMW",
  "Mercedes",
  "Toyota",
  "Honda",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Hyundai",
  "Kia",
  "Nissan",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "Tesla",
  "Jeep",
  "Skoda",
  "MG",
  "Volvo",
  "Bugatti",
  "Bentley",
  "Aston Martin",
  "Land Rover",
  "Mini",
  "Peugeot",
  "Rolls Royce",
  "Suzuki",
  "Vector",
  "McLaren",
  "Fiat",
] as const;

const BIKE_BRANDS = [
  "Bajaj",
  "Benelli",
  "Ducati",
  "Harley Davidson",
  "Honda",
  "Husqvarna",
  "Java",
  "Kawasaki",
  "KTM",
  "Royal Enfield",
  "Suzuki",
  "TVS",
  "Yamaha",
  "Aprilia",
  "Ather",
  "Yezdi",
  "Hero",
] as const;

const NCAP_RATING = [
  "1 Star",
  "2 Star",
  "3 Star",
  "4 Star",
  "5 Star",
  "Not Rated",
] as const;
const REAR_CAMERA_OPTIONS = [
  "None",
  "With Guidelines",
  "Without Guidelines",
] as const;
const ANTI_PINCH_WINDOW_OPTIONS = [
  "None",
  "Driver's Window",
  "All Windows",
] as const;
const PRETENSIONER_OPTIONS = [
  "None",
  "Driver Only",
  "Driver and Passenger",
  "All Seats",
] as const;

export default function NewVehicle() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuthCheck();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
    reset,
  } = useVehicleStore();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware styles
  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  const activeSections = vehicleType === "cars" ? SPEC_SECTIONS : BIKE_SECTIONS;

  const [activeSection, setActiveSection] = useState<string>(
    activeSections[0].id
  );
  const [interiorFeaturesCleared, setInteriorFeaturesCleared] = useState(false);
  const defaultInteriorFeatures = `Tablet Storage Space in Glove Box,
Collapsible Grab Handles,
Charcoal Black Interiors,
Fabric Seats with Deco Stitch,
Rear Parcel Shelf,
Premium Piano Black Finish on Steering Wheel,
Interior Lamps with Theatre Dimming,
Premium PianoBlack Finish around Infotainment System,
Body Coloured Side Airvents with Chrome Finish,
Digital Clock,
Trip Meter (2 Nos.), Door Open, Key in Reminder`;

  const [interiorFeatures, setInteriorFeatures] = useState(
    defaultInteriorFeatures
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [sectionErrors, setSectionErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [sectionCompletionStatus, setSectionCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [formInitialized, setFormInitialized] = useState(false);
  const prevSectionRef = useRef(activeSection);

  // Update section completion status when form data changes
  useEffect(() => {
    const status = getSectionCompletionStatus(formState, vehicleType);
    setSectionCompletionStatus(status);
  }, [formState, vehicleType]);

  // Update the saveSectionData function to properly merge nested data
  const saveSectionData = useCallback((section: string, data: any) => {
    console.log(`Saving section data for ${section}:`, data);
    setFormState((prev) => {
      // Initialize the section if it doesn't exist
      const currentSectionData = prev[section] || {};

      // Create a proper merge of the data
      const newSectionData = {
        ...currentSectionData,
        ...data,
      };

      // Return the updated form state
      return {
        ...prev,
        [section]: newSectionData,
      };
    });

    // Special handling for images section
    if (section === "images") {
      // The image data is handled separately in the MultipleImageUpload component
      // but we should make sure it's reflected in the form state
    }
  }, []);

  // Fix duplicate handleNextSection definitions by consolidating into one
  const handleNextSection = useCallback(() => {
    // Get current section data from formState
    const currentSectionData = formState[activeSection] || {};

    // Validate current section
    if (activeSection === "basicInfo") {
      if (!currentSectionData.name || !currentSectionData.brand) {
        toast.error("Please fill in required fields: Name and Brand");
        setSectionErrors((prev) => ({
          ...prev,
          [activeSection]: {
            ...(prev[activeSection] || {}),
            ...(!currentSectionData.name ? { name: "Name is required" } : {}),
            ...(!currentSectionData.brand
              ? { brand: "Brand is required" }
              : {}),
          },
        }));
        return;
      }
    }

    // For images, check if at least one main image is uploaded
    if (activeSection === "images") {
      if (mainImages.length === 0) {
        toast.error("Please upload at least one main image");
        setSectionErrors((prev) => ({
          ...prev,
          [activeSection]: {
            ...(prev[activeSection] || {}),
            mainImages: "At least one main image is required",
          },
        }));
        return;
      }
    }

    // All validations passed, clear errors for this section
    setSectionErrors((prev) => ({
      ...prev,
      [activeSection]: {},
    }));

    // Mark this section as completed
    setSectionCompletionStatus((prev) => ({
      ...prev,
      [activeSection]: true,
    }));

    // Save current section data explicitly before moving to next section
    if (activeSection === "images") {
      // For images section, we need to explicitly save the images
      setFormState((prev) => ({
        ...prev,
        images: {
          mainImages,
          colorImages,
          ...(vehicleType === "cars"
            ? { interiorImages, exteriorImages }
            : { galleryImages }),
        },
      }));
    }

    // Move to next section
    const currentIndex = activeSections.findIndex(
      (section) => section.id === activeSection
    );
    if (currentIndex < activeSections.length - 1) {
      setActiveSection(activeSections[currentIndex + 1].id);
    }
  }, [
    activeSection,
    activeSections,
    formState,
    mainImages,
    colorImages,
    interiorImages,
    exteriorImages,
    galleryImages,
    vehicleType,
    saveSectionData,
    setSectionErrors,
    setSectionCompletionStatus,
  ]);

  const handlePreviousSection = () => {
    const currentIndex = activeSections.findIndex(
      (section) => section.id === activeSection
    );
    if (currentIndex > 0) {
      setActiveSection(activeSections[currentIndex - 1].id);
    }
  };

  // Fix the renderBasicInfo function to ensure it uses the persisted form state
  const renderBasicInfo = () => {
    // Get the stored values from form state
    const basicInfo = formState.basicInfo || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <select
            name="brand"
            defaultValue={basicInfo.brand || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { brand: e.target.value })
            }
            className={`mt-1 block w-full rounded bg-gray-800 border ${
              hasError("brand") ? "border-red-500" : "border-gray-700"
            } text-white px-3 py-2`}
          >
            <option value="">Select Brand</option>
            {(vehicleType === "cars" ? CAR_BRANDS : BIKE_BRANDS).map(
              (brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              )
            )}
          </select>
          {hasError("brand") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("brand")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Model Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={basicInfo.name || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { name: e.target.value })
            }
            placeholder="e.g. Camry, Civic"
            className={`mt-1 block w-full rounded bg-gray-800 border ${
              hasError("name") ? "border-red-500" : "border-gray-700"
            } text-white px-3 py-2`}
          />
          {hasError("name") && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage("name")}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Variant
          </label>
          <select
            name="variant"
            defaultValue={basicInfo.variant || "Base"}
            onChange={(e) =>
              saveSectionData("basicInfo", { variant: e.target.value })
            }
            className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
          >
            {VARIANT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Launch Year
          </label>
          <input
            type="number"
            name="launchYear"
            defaultValue={basicInfo.launchYear || new Date().getFullYear()}
            onChange={(e) =>
              saveSectionData("basicInfo", { launchYear: e.target.value })
            }
            min="1900"
            max={new Date().getFullYear() + 1}
            className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            On-Road Price (₹)
          </label>
          <input
            type="number"
            name="priceOnroad"
            defaultValue={basicInfo.priceOnroad || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { priceOnroad: e.target.value })
            }
            className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Off-Road Price (₹)
          </label>
          <input
            type="number"
            name="priceOffroad"
            defaultValue={basicInfo.priceOffroad || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { priceOffroad: e.target.value })
            }
            className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
          />
        </div>
      </div>
    );
  };

  // Modify the InputField component to properly handle defaultValue from form state
  const InputField = ({
    name,
    defaultValue = "",
    type = "text",
    className = "",
    section = activeSection,
    ...props
  }) => {
    // Get value from form state, or use default
    const storedValue = formState[section]?.[name];
    const initialValue = storedValue !== undefined ? storedValue : defaultValue;
    const [value, setValue] = useState(initialValue);
    const [focused, setFocused] = useState(false);

    // Update component value when form state or section changes
    useEffect(() => {
      const newValue = formState[section]?.[name];
      if (newValue !== undefined) {
        setValue(newValue);
      } else if (section !== prevSectionRef.current) {
        // Reset to default when changing to a new section that doesn't have this field
        setValue(defaultValue);
      }
    }, [section, name, formState, defaultValue]);

    const handleChange = useCallback(
      (e) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Immediately update form state when value changes
        saveSectionData(section, { [name]: newValue });
      },
      [section, name]
    );

    return (
      <div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            !focused
              ? typeof defaultValue === "string"
                ? defaultValue
                : ""
              : ""
          }
          className={`mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2 ${
            hasError(name) ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {hasError(name) && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(name)}</p>
        )}
      </div>
    );
  };

  // Fix the form initialization to log the process
  useEffect(() => {
    const loadSavedFormState = async () => {
      try {
        console.log(
          `Loading saved form state for vehicle type: ${vehicleType}`
        );
        const response = await fetch(
          `/api/brands/vehicles/save-state?formId=${vehicleType}`
        );

        if (!response.ok) {
          console.error("Failed to load form state:", response.statusText);
          setFormInitialized(true);
          return;
        }

        const data = await response.json();
        console.log("Loaded form state:", data);

        if (data.formState) {
          console.log("Setting form state:", data.formState);
          setFormState(data.formState);

          // Also restore uploaded images if they exist
          if (data.formState.images?.mainImages?.length) {
            setMainImages(data.formState.images.mainImages);
          }

          if (vehicleType === "cars") {
            if (data.formState.images?.interiorImages?.length) {
              setInteriorImages(data.formState.images.interiorImages);
            }
            if (data.formState.images?.exteriorImages?.length) {
              setExteriorImages(data.formState.images.exteriorImages);
            }
          } else {
            if (data.formState.images?.galleryImages?.length) {
              setGalleryImages(data.formState.images.galleryImages);
            }
          }

          if (data.formState.images?.colorImages?.length) {
            setColorImages(data.formState.images.colorImages);
          }

          toast.success("Previous form data loaded");
        }

        setFormInitialized(true);
      } catch (error) {
        console.error("Failed to load saved form state:", error);
        setFormInitialized(true);
      }
    };

    loadSavedFormState();
  }, [vehicleType]);

  // Fix the form saving to use formId
  useEffect(() => {
    // Only save if the form has been initialized to avoid overwriting with empty data
    if (!formInitialized) return;

    // Save current form state to API
    const saveFormState = async () => {
      try {
        console.log("Saving form state:", formState);

        // Add image data to form state
        const updatedFormState = {
          ...formState,
          images: {
            mainImages,
            colorImages,
            ...(vehicleType === "cars"
              ? { interiorImages, exteriorImages }
              : { galleryImages }),
          },
        };

        await fetch("/api/brands/vehicles/save-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formId: vehicleType,
            formState: updatedFormState,
          }),
        });
      } catch (error) {
        console.error("Failed to save form state:", error);
      }
    };

    saveFormState();
  }, [
    formState,
    mainImages,
    interiorImages,
    exteriorImages,
    colorImages,
    galleryImages,
    vehicleType,
    formInitialized,
  ]);

  // Load saved form state on initial render
  useEffect(() => {
    const loadSavedFormState = async () => {
      try {
        const response = await fetch(
          `/api/brands/vehicles/save-state?vehicleType=${vehicleType}`
        );
        const data = await response.json();

        if (data.found && data.formState) {
          setFormState(data.formState);

          // Also restore uploaded images if they exist
          if (data.formState.images?.mainImages?.length) {
            setMainImages(data.formState.images.mainImages);
          }

          if (vehicleType === "cars") {
            if (data.formState.images?.interiorImages?.length) {
              setInteriorImages(data.formState.images.interiorImages);
            }
            if (data.formState.images?.exteriorImages?.length) {
              setExteriorImages(data.formState.images.exteriorImages);
            }
          } else {
            if (data.formState.images?.galleryImages?.length) {
              setGalleryImages(data.formState.images.galleryImages);
            }
          }

          if (data.formState.images?.colorImages?.length) {
            setColorImages(data.formState.images.colorImages);
          }

          toast.success("Previous form data loaded");
        }

        setFormInitialized(true);
      } catch (error) {
        console.error("Failed to load saved form state:", error);
        setFormInitialized(true);
      }
    };

    loadSavedFormState();
  }, [vehicleType]);

  // Save form state whenever it changes
  useEffect(() => {
    // Only save if the form has been initialized to avoid overwriting with empty data
    if (!formInitialized) return;

    // Save current form state to API
    const saveFormState = async () => {
      try {
        // Add image data to form state
        const updatedFormState = {
          ...formState,
          images: {
            mainImages,
            colorImages,
            ...(vehicleType === "cars"
              ? { interiorImages, exteriorImages }
              : { galleryImages }),
          },
        };

        await fetch("/api/brands/vehicles/save-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleType,
            formState: updatedFormState,
          }),
        });
      } catch (error) {
        console.error("Failed to save form state:", error);
      }
    };

    saveFormState();
  }, [
    formState,
    mainImages,
    interiorImages,
    exteriorImages,
    colorImages,
    galleryImages,
    vehicleType,
    formInitialized,
  ]);

  // Update active sections when vehicle type changes
  useEffect(() => {
    const newActiveSections =
      vehicleType === "cars" ? SPEC_SECTIONS : BIKE_SECTIONS;
    setActiveSection(newActiveSections[0].id);
  }, [vehicleType]);

  // Track section changes for proper transitions
  useEffect(() => {
    prevSectionRef.current = activeSection;
  }, [activeSection]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setValidationErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("vehicleType", vehicleType);

      // Validate images
      if (mainImages.length === 0) {
        throw new Error("At least one main image is required");
      }

      // Add all images to form data
      mainImages.forEach((img) => formData.append("mainImages", img));
      colorImages.forEach((img) => formData.append("colorImages", img));

      if (vehicleType === "cars") {
        interiorImages.forEach((img) => formData.append("interiorImages", img));
        exteriorImages.forEach((img) => formData.append("exteriorImages", img));
      } else {
        galleryImages.forEach((img) => formData.append("galleryImages", img));
      }

      // Validate form data
      const { isValid, errors } = validateVehicleData(formData, vehicleType);
      if (!isValid) {
        setValidationErrors(errors);
        throw new Error("Please fill in all required fields");
      }

      // Submit data
      await vehicleService.createVehicle(formData);

      toast.success("Vehicle created successfully");
      router.push("/brands/dashboard");
      // Reset form state after successful submission
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create vehicle"
      );
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = (field: string): boolean => {
    return !!(
      (sectionErrors[activeSection] && sectionErrors[activeSection][field]) ||
      validationErrors[field]
    );
  };

  const getErrorMessage = (field: string): string => {
    return (
      (sectionErrors[activeSection] && sectionErrors[activeSection][field]) ||
      validationErrors[field] ||
      ""
    );
  };

  const renderSectionFields = useCallback(() => {
    switch (activeSection) {
      case "basicInfo":
        return renderBasicInfo();

      case "images":
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Cover Image
              </label>
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
            {vehicleType === "cars" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Interior Gallery
                  </label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Exterior Gallery
                  </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Gallery Images
                </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Color Variants
              </label>
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

      case "engineTransmission":
        if (vehicleType === "bikes") {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Engine Type
                </label>
                <InputField
                  name="engineType"
                  defaultValue="Single Cylinder, Liquid Cooled, DOHC, FI Engine"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Displacement (cc)
                </label>
                <InputField
                  name="displacement"
                  defaultValue="398.63"
                  type="number"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Max Power
                </label>
                <InputField name="maxPower" defaultValue="46 PS @ 8500 rpm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Max Torque
                </label>
                <InputField name="maxTorque" defaultValue="39 Nm @ 6500 rpm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  No. of Cylinders
                </label>
                <InputField name="cylinders" defaultValue={1} type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Cooling System
                </label>
                <select
                  name="coolingSystem"
                  defaultValue="Liquid Cooled"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {COOLING_SYSTEMS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Starting
                </label>
                <select
                  name="startingType"
                  defaultValue="Self Start Only"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {STARTING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Fuel Supply
                </label>
                <select
                  name="fuelSupply"
                  defaultValue="Fuel Injection"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {FUEL_SUPPLY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Clutch
                </label>
                <select
                  name="clutchType"
                  defaultValue="Assist & Slipper"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {CLUTCH_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Ignition
                </label>
                <InputField
                  name="ignition"
                  defaultValue="Contactless, Controlled, Fully Electronic Ignition System With Digital Ignition Timing Adjustment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Gear Box
                </label>
                <InputField name="gearBox" defaultValue="6 Speed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Bore (mm)
                </label>
                <InputField name="bore" defaultValue="89" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Stroke (mm)
                </label>
                <InputField name="stroke" defaultValue="64" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Compression Ratio
                </label>
                <InputField name="compressionRatio" defaultValue="12.71:1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Emission Type
                </label>
                <InputField name="emissionType" defaultValue="BS6-2.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Drive Type
                </label>
                <select
                  name="driveTypeBike"
                  defaultValue="Chain Drive"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {DRIVE_TYPES_BIKE.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Engine Type
              </label>
              <InputField name="engineType" defaultValue="mHawk 130 CRDe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Displacement (cc)
              </label>
              <InputField
                name="displacement"
                defaultValue="2184"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Max Power
              </label>
              <InputField name="maxPower" defaultValue="130.07bhp@3750rpm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Max Torque
              </label>
              <InputField name="maxTorque" defaultValue="300Nm@1600-2800rpm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                No. of Cylinders
              </label>
              <InputField name="cylinders" defaultValue={4} type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Valves Per Cylinder
              </label>
              <InputField
                name="valvesPerCylinder"
                defaultValue={4}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Turbo Charger
              </label>
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
              <label className="block text-sm font-medium text-gray-300">
                Transmission Type
              </label>
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
              <label className="block text-sm font-medium text-gray-300">
                Gearbox
              </label>
              <InputField name="gearbox" defaultValue="6-Speed AT" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Drive Type
              </label>
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

      case "fuelPerformance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Fuel Type
              </label>
              <select
                name="fuelType"
                defaultValue="Diesel"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {["Petrol", "Diesel", "CNG", "Electric"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Fuel Tank Capacity (Litres)
              </label>
              <InputField
                name="fuelTankCapacity"
                defaultValue={57}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Highway Mileage
              </label>
              <InputField name="highwayMileage" defaultValue="10 kmpl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Emission Norm Compliance
              </label>
              <InputField name="emissionNorm" defaultValue="BS VI 2.0" />
            </div>
          </div>
        );

      case "suspensionSteeringBrakes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Front Suspension
              </label>
              <InputField
                name="frontSuspension"
                defaultValue="Double wishbone suspension"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Rear Suspension
              </label>
              <InputField
                name="rearSuspension"
                defaultValue="Multi-link, Solid Axle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Steering Type
              </label>
              <select
                name="steeringType"
                defaultValue="Hydraulic"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {STEERING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Steering Column
              </label>
              <select
                name="steeringColumn"
                defaultValue="Tilt"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {STEERING_COLUMNS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Steering Gear Type
              </label>
              <InputField
                name="steeringGearType"
                defaultValue="Rack & Pinion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Front Brake Type
              </label>
              <select
                name="frontBrakeType"
                defaultValue="Disc"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {BRAKE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Rear Brake Type
              </label>
              <select
                name="rearBrakeType"
                defaultValue="Drum"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {BRAKE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Front Wheel Size (Inch)
              </label>
              <InputField
                name="frontWheelSize"
                defaultValue={18}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Rear Wheel Size (Inch)
              </label>
              <InputField
                name="rearWheelSize"
                defaultValue={18}
                type="number"
              />
            </div>
          </div>
        );

      case "dimensionsCapacity":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Length (mm)
              </label>
              <InputField name="length" defaultValue={3985} type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Width (mm)
              </label>
              <InputField name="width" defaultValue={1820} type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Height (mm)
              </label>
              <InputField name="height" defaultValue={1855} type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Seating Capacity
              </label>
              <InputField
                name="seatingCapacity"
                defaultValue={4}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Ground Clearance (mm)
              </label>
              <InputField
                name="groundClearance"
                defaultValue={226}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Wheel Base (mm)
              </label>
              <InputField name="wheelBase" defaultValue={2450} type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Approach Angle
              </label>
              <InputField
                name="approachAngle"
                defaultValue={41.2}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Break-over Angle
              </label>
              <InputField
                name="breakoverAngle"
                defaultValue={26.2}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Departure Angle
              </label>
              <InputField
                name="departureAngle"
                defaultValue={36}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                No. of Doors
              </label>
              <InputField name="doors" defaultValue={3} type="number" />
            </div>
          </div>
        );

      case "comfortConvenience":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="powerSteering"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Power Steering
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="airConditioner"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Air Conditioner
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="heater"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Heater
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="adjustableSteering"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Adjustable Steering
                </span>
              </label>
              {/* Add remaining checkboxes */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Parking Sensors
              </label>
              <select
                name="parkingSensors"
                defaultValue="Rear"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {PARKING_SENSOR_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Foldable Rear Seat
              </label>
              <InputField name="foldableRearSeat" defaultValue="50:50 Split" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                USB Charger
              </label>
              <select
                name="usbCharger"
                defaultValue="Front"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {USB_LOCATIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case "interior":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tachometer"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Tachometer
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="gloveBox"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Glove Box
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="digitalCluster"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Digital Cluster
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Upholstery
              </label>
              <select
                name="upholstery"
                defaultValue="Leatherette"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {UPHOLSTERY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Additional Interior Features
              </label>
              <textarea
                name="additionalInteriorFeatures"
                rows={6}
                value={interiorFeatures}
                onChange={(e) => setInteriorFeatures(e.target.value)}
                onClick={() => {
                  if (!interiorFeaturesCleared) {
                    setInteriorFeatures("");
                    setInteriorFeaturesCleared(true);
                  }
                }}
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter each feature on a new line or separated by commas
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Digital Cluster Size (inch)
              </label>
              <input
                type="number"
                name="digitalClusterSize"
                defaultValue="7"
                min="3"
                max="15"
                step="0.1"
                placeholder="Enter size (e.g. 7.5)"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                You can enter decimal values (e.g. 7.5, 10.2)
              </p>
            </div>
          </div>
        );

      case "exterior":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="adjustableHeadlamps"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Rear Window Wiper
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rearWindowDefogger"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Rear Window Washer
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="alloyWheels"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Rear Window Defogger
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="integratedAntenna"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Alloy Wheels
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="halogenHeadlamps"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Integrated Antenna
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledTaillights"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Projector Headlamps
                </span>
              </label>
              <label className="block text-sm font-medium text-gray-300">
                Sunroof Type
              </label>
              <select
                name="sunroofType"
                defaultValue="None"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {SUNROOF_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="poweredFoldingORVM"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Powered & Folding ORVM
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledDRLs"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  LED DRLs
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledTaillights"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  LED Taillights
                </span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Fog Lights
                </label>
                <select
                  name="fogLights"
                  defaultValue="Front"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {FOG_LIGHT_POSITIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  LED Fog Lamps
                </label>
                <select
                  name="ledFogLamps"
                  defaultValue="Front"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {FOG_LIGHT_POSITIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Tyre Size
                </label>
                <InputField name="tyreSize" defaultValue="255/60 R19" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Tyre Type
                </label>
                <select
                  name="tyreType"
                  defaultValue="Radial Tubeless"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {TYRE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Additional Exterior Features
                </label>
                <textarea
                  name="additionalExteriorFeatures"
                  rows={5}
                  defaultValue="LED Turn indicator on Fender,
LED Centre High Mount Stop Lamp,
Skid Plates,
Split Tailgate,
Side Foot Step,
Dual Tone Interiors"
                  onClick={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    if (target.defaultValue === target.value) {
                      target.value = "";
                    }
                  }}
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </div>
            </div>
          </div>
        );

      case "safety":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "Anti-lock Braking System (ABS)",
                "Brake Assist",
                "Central Locking",
                // ...existing safety options...
              ].map((feature) => (
                <FormCheckbox key={feature} label={feature} name={feature} />
              ))}
            </div>
            <div className="space-y-6">
              <FormInput
                label="No. of Airbags"
                name="airbags"
                type="number"
                defaultValue={2}
              />
              <FormSelect
                label="Bharat NCAP Rating"
                name="bharatNcapRating"
                options={NCAP_RATING}
                defaultValue="5 Star"
              />
              {/* ...remaining safety fields... */}
            </div>
          </div>
        );

      case "adasFeatures":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "Forward Collision Warning",
                "Automatic Emergency Braking",
                "Traffic Sign Recognition",
                "Lane Departure Warning",
                "Lane Keep Assist",
                "Adaptive Cruise Control",
                "Adaptive High Beam Assist",
                "Blind Spot Detection",
                "Rear Cross Traffic Alert",
                "Driver Attention Monitor",
                "Parking Assist",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={feature}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600"
                    defaultChecked={true}
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {feature}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Additional ADAS Features
                </label>
                <textarea
                  name="additionalADASFeatures"
                  rows={5}
                  placeholder="Enter additional ADAS features..."
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  ADAS System Name
                </label>
                <input
                  type="text"
                  name="adasSystemName"
                  placeholder="e.g. Honda Sensing, Nissan ProPILOT"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                />
              </div>
            </div>
          </div>
        );

      case "entertainment":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "Radio",
                "WirelessPhoneCharger",
                "integrated2DINAudio",
                "Bluetooth Connectivity",
                "touchscreen",
                "USB Ports",
                "Apple CarPlay",
                "Android Auto",
                "Connected apps",
                "83 connected features",
                "DTS sound staging",
                "Tweeters",
                "subwoofer",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={feature}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600"
                    defaultChecked={true}
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Touchscreen Size (inch)
                </label>
                <input
                  type="number"
                  name="touchscreenSize"
                  defaultValue="7"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 7.5, 10.25"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can enter decimal values (e.g. 7.5, 10.25)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  No. of Speakers
                </label>
                <InputField name="speakers" defaultValue={4} type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Speaker Location
                </label>
                <select
                  name="speakerLocation"
                  defaultValue="Front & Rear"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {SPEAKER_LOCATIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Additional Entertainment Features
                </label>
                <textarea
                  name="additionalEntertainmentFeatures"
                  rows={5}
                  defaultValue="Connected apps,
83 connected features,
DTS sound staging"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                  onClick={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    if (target.defaultValue === target.value) {
                      target.value = "";
                    }
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </div>
            </div>
          </div>
        );

      case "internetFeatures":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="eCallICall"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  E-Call & I-Call
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Remote Vehicle Ignition Start/Stop
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  SOS Button
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Remote AC On/Off
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Geo-fence Alert
                </span>
              </label>
            </div>
          </div>
        );

      case "features":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="usbChargingPort"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  USB Charging Port
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="cruiseControl"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Cruise Control
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="bodyGraphics"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Body Graphics
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="stepupSeat"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Step-up Seat
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="passengerFootrest"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Passenger Footrest
                </span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Instrument Console
                </label>
                <select
                  name="instrumentConsole"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {CONSOLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Speedometer
                </label>
                <select
                  name="speedometerType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Tachometer
                </label>
                <select
                  name="tachometerType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Tripmeter
                </label>
                <select
                  name="tripmeterType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Odometer
                </label>
                <select
                  name="odometerType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Clock
                </label>
                <select
                  name="clockType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Seat Type
                </label>
                <select
                  name="seatType"
                  defaultValue="Split"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {SEAT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Additional Features
                </label>
                <InputField
                  name="additionalFeatures"
                  defaultValue="Ride-by-wire"
                />
              </div>
            </div>
          </div>
        );

      case "featuresAndSafety":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="passSwitch"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Pass Switch
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ridingModes"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Riding Modes
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tractionControl"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Traction Control
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="launchControl"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Launch Control
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="quickShifter"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Quick Shifter
                </span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  ABS Type
                </label>
                <select
                  name="absType"
                  defaultValue="Dual Channel"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {ABS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Clock
                </label>
                <select
                  name="clockType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Display
                </label>
                <InputField name="displayType" defaultValue="5 Inch, TFT" />
              </div>
            </div>
          </div>
        );

      case "mileageAndPerformance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Overall Mileage (kmpl)
              </label>
              <InputField
                name="overallMileage"
                defaultValue="28.9"
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Top Speed (kmph)
              </label>
              <InputField name="topSpeed" defaultValue="167" type="number" />
            </div>
          </div>
        );

      case "chassisAndSuspension":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Body Type
              </label>
              <select
                name="bodyType"
                defaultValue="Sports Naked Bikes"
                className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
              >
                {BODY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Frame Type
              </label>
              <InputField name="frameType" defaultValue="Split-Trellis frame" />
            </div>
          </div>
        );

      case "dimensionsAndCapacity":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Fuel Capacity (L)
              </label>
              <InputField name="fuelCapacity" defaultValue="15" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Saddle Height (mm)
              </label>
              <InputField
                name="saddleHeight"
                defaultValue="820"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Ground Clearance (mm)
              </label>
              <InputField
                name="groundClearance"
                defaultValue="183"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Wheelbase (mm)
              </label>
              <InputField name="wheelbase" defaultValue="1354" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Kerb Weight (kg)
              </label>
              <InputField
                name="kerbWeight"
                defaultValue="168.3"
                type="number"
                step="0.1"
              />
            </div>
          </div>
        );

      case "electricals":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Headlight
                </label>
                <select
                  name="headlightType"
                  defaultValue="LED"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {LIGHT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Taillight
                </label>
                <select
                  name="taillightType"
                  defaultValue="LED"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {LIGHT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Turn Signal Lamp
                </label>
                <select
                  name="turnSignalType"
                  defaultValue="LED"
                  className="mt-1 block w-full rounded bg-gray-800 border-gray-700 text-white px-3 py-2"
                >
                  {LIGHT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledTaillights"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  LED Taillights
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lowBatteryIndicator"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Low Battery Indicator
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lowFuelIndicator"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Low Fuel Indicator
                </span>
              </label>
            </div>
          </div>
        );

      case "tyresAndBrakes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Front Brake Diameter (mm)
              </label>
              <InputField
                name="frontBrakeDiameter"
                defaultValue="320"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Rear Brake Diameter (mm)
              </label>
              <InputField
                name="rearBrakeDiameter"
                defaultValue="240"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Front Brake Type
              </label>
              <InputField name="frontBrakeType" defaultValue="Disc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Rear Brake Type
              </label>
              <InputField name="rearBrakeType" defaultValue="Disc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Front Tyre Size
              </label>
              <InputField name="frontTyreSize" defaultValue="110/70-17" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Rear Tyre Size
              </label>
              <InputField name="rearTyreSize" defaultValue="150/60-17" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Wheel Size
              </label>
              <InputField
                name="wheelSize"
                defaultValue="Front: 431.8 mm, Rear: 431.8 mm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Wheel Type
              </label>
              <InputField name="wheelType" defaultValue="Alloy" />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tubelessTyre"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Tubeless Tyre
                </span>
              </label>
            </div>
          </div>
        );

      case "motorAndBattery":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Peak Power
              </label>
              <InputField name="peakPower" defaultValue="46 PS @ 8500 rpm" />
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lowBatteryAlert"
                  className="rounded bg-gray-800 border-gray-700 text-blue-600"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-gray-300">
                  Low Battery Alert
                </span>
              </label>
            </div>
          </div>
        );

      case "underpinnings":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Suspension Front
              </label>
              <InputField
                name="suspensionFront"
                defaultValue="5-click Compression & Rebound adjustable, Open Cartridge, WP APEX USD forks, 43mm diameter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Suspension Rear
              </label>
              <InputField
                name="suspensionRear"
                defaultValue="Adjustable WP APEX Monoshock, 5-step Rebound damping, 10-step preload adjustable"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [activeSection, vehicleType, validationErrors]);

  const renderSectionButton = (section) => (
    <button
      key={section.id}
      type="button"
      onClick={() => setActiveSection(section.id)}
      className={`w-full text-left px-4 py-2 rounded flex items-center justify-between ${
        activeSection === section.id
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-gray-800"
      }`}
    >
      <span>{section.label}</span>
      {sectionCompletionStatus[section.id] && (
        <span className="text-green-400 text-sm">✓</span>
      )}
    </button>
  );

  const handleVehicleTypeChange = (type: "cars" | "bikes") => {
    setVehicleType(type);
    // Reset form state when changing vehicle type
    const newSections = type === "cars" ? SPEC_SECTIONS : BIKE_SECTIONS;
    setActiveSection(newSections[0].id);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="bg-gray-950 p-8 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render the form if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useAuthCheck
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 p-8">
      <form onSubmit={handleSubmit} className="max-w-full mx-auto">
        <div className="flex gap-6">
          {/* Side Panel */}
          <div className="w-64 flex-shrink-0 bg-gray-900 p-4 rounded-lg border border-gray-800">
            <nav className="space-y-2 sticky top-4">
              {activeSections.map((section) => renderSectionButton(section))}
            </nav>
          </div>
          {/* Main Form Content */}
          <div className="flex-1 bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h1 className="text-2xl font-bold text-white mb-6">
              Add New Vehicle
            </h1>
            {/* Vehicle Type Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleVehicleTypeChange("cars")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  vehicleType === "cars"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                <Car className="w-5 h-5" />
                Car
              </button>
              <button
                type="button"
                onClick={() => handleVehicleTypeChange("bikes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  vehicleType === "bikes"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                <Bike className="w-5 h-5" />
                Bike
              </button>
            </div>
            {/* Dynamic Section Content */}
            <div className="space-y-6">{renderSectionFields()}</div>
            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <button
                type="button"
                onClick={handlePreviousSection}
                disabled={activeSection === activeSections[0].id}
                className={`px-6 py-2 rounded-lg bg-gray-700 text-white font-medium ${
                  activeSection === activeSections[0].id
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-600"
                }`}
              >
                Previous
              </button>
              {activeSection ===
              activeSections[activeSections.length - 1].id ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg bg-blue-600 text-white font-medium ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Creating..." : "Create Vehicle"}
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
