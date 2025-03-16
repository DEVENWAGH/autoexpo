"use client";

import { useRouter } from "next/navigation";
import { Car, Bike } from "lucide-react";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useVehicleStore } from "@/store/useVehicleStore";
import { useState, useCallback, useEffect, useRef } from "react";
import { vehicleService } from "@/services/vehicleService";
import {
  validateVehicleData,
  getSectionCompletionStatus,
} from "@/utils/validateVehicleData";
import { toast } from "react-hot-toast";
import {
  FormSelect,
  FormInput,
  FormCheckbox,
} from "@/components/ui/form-components";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    vehicleType,
    mainImages,
    interiorImages,
    exteriorImages,
    colorImages,
    galleryImages,
    error,
    setVehicleType,
    setMainImages,
    setInteriorImages,
    setExteriorImages,
    setColorImages,
    setGalleryImages,
    setError,
    reset,
  } = useVehicleStore();

  const [exshowroomPrice, setExshowroomPrice] = useState<string>("");
  const [onroadPrice, setOnroadPrice] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define default data for cars and bikes
  const defaultCarData = {
    name: "New Model",
    brand: "Toyota",
    variant: "Base",
    launchYear: new Date().getFullYear().toString(),
    priceOnroad: "1000000",
    priceExshowroom: "850000",
    pros: "Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride",
    cons: "Average Performance\nBasic Infotainment System\nLimited Color Options",
  };

  const defaultBikeData = {
    name: "Street Fighter",
    brand: "Honda",
    variant: "Base",
    launchYear: new Date().getFullYear().toString(),
    priceOnroad: "150000",
    priceExshowroom: "120000",
    pros: "Excellent Mileage\nEasy Handling\nAffordable Maintenance\nSporty Look",
    cons: "Limited Power\nBasic Features\nAverage Build Quality",
  };

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

  // Add state for preview mode
  const [previewMode, setPreviewMode] = useState(false);

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
  }, []);

  // Fix duplicate handleNextSection definitions by consolidating into one
  const handleNextSection = useCallback(() => {
    // Get current section data from formState
    const currentSectionData = formState[activeSection] || {};

    // Validate current section
    if (activeSection === "basicInfo") {
      // Check if the required fields are filled
      const { name, brand } = currentSectionData;
      const errors: Record<string, string> = {};

      if (!name) {
        errors.name = "Name is required";
      }

      if (!brand) {
        errors.brand = "Brand is required";
      }

      // If there are errors, show them and stop
      if (Object.keys(errors).length > 0) {
        toast.error("Please fill in all required fields");
        setSectionErrors((prev) => ({
          ...prev,
          [activeSection]: errors,
        }));
        return;
      }

      // Validate prices if both are provided
      if (
        currentSectionData.priceOnroad &&
        currentSectionData.priceExshowroom
      ) {
        if (
          Number(currentSectionData.priceExshowroom) >=
          Number(currentSectionData.priceOnroad)
        ) {
          toast.error("Ex-showroom price must be lower than On-road price");
          setSectionErrors((prev) => ({
            ...prev,
            [activeSection]: {
              ...(prev[activeSection] || {}),
              priceExshowroom:
                "Ex-showroom price must be lower than On-road price",
            },
          }));
          return;
        }
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

  // Fix the renderBasicInfo function to ensure it uses the persisted form state and includes pros & cons
  const renderBasicInfo = () => {
    // Get the stored values from form state
    const basicInfo = formState.basicInfo || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="brand"
          >
            Brand Name <span className="text-destructive">*</span>
          </label>
          <select
            id="brand"
            name="brand"
            value={basicInfo.brand || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { brand: e.target.value })
            }
            className={`mt-1 block w-full rounded bg-background border ${
              hasError("brand") ? "border-destructive" : "border-input"
            } text-foreground px-3 py-2`}
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
            <p className="text-destructive text-sm mt-1">
              {getErrorMessage("brand")}
            </p>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="name"
          >
            Model Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={basicInfo.name || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { name: e.target.value })
            }
            placeholder="e.g. Camry, Civic"
            className={`mt-1 block w-full rounded bg-background border ${
              hasError("name") ? "border-destructive" : "border-input"
            } text-foreground px-3 py-2`}
          />
          {hasError("name") && (
            <p className="text-destructive text-sm mt-1">
              {getErrorMessage("name")}
            </p>
          )}
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="variant"
          >
            Variant
          </label>
          <select
            id="variant"
            name="variant"
            value={basicInfo.variant || "Base"}
            onChange={(e) =>
              saveSectionData("basicInfo", { variant: e.target.value })
            }
            className="mt-1 block w-full rounded bg-background border-input text-foreground px-3 py-2"
          >
            {VARIANT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="launchYear"
          >
            Launch Year
          </label>
          <input
            id="launchYear"
            type="number"
            name="launchYear"
            value={basicInfo.launchYear || new Date().getFullYear()}
            onChange={(e) =>
              saveSectionData("basicInfo", { launchYear: e.target.value })
            }
            min="1900"
            max={new Date().getFullYear() + 1}
            className="mt-1 block w-full rounded bg-background border-input text-foreground px-3 py-2"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="priceOnroad"
          >
            On-Road Price (₹)
          </label>
          <input
            id="priceOnroad"
            type="number"
            name="priceOnroad"
            value={basicInfo.priceOnroad || onroadPrice}
            onChange={(e) => {
              const value = e.target.value;
              setOnroadPrice(value);
              saveSectionData("basicInfo", { priceOnroad: value });
              // Run validation if both prices are entered
              if (value && exshowroomPrice) {
                if (Number(exshowroomPrice) >= Number(value)) {
                  setPriceError(
                    "Ex-showroom price must be lower than On-road price"
                  );
                } else {
                  setPriceError("");
                }
              }
            }}
            className="mt-1 block w-full rounded bg-background border-input text-foreground px-3 py-2"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground"
            htmlFor="priceExshowroom"
          >
            Ex-Showroom Price (₹)
          </label>
          <input
            id="priceExshowroom"
            type="number"
            name="priceExshowroom"
            value={basicInfo.priceExshowroom || exshowroomPrice}
            onChange={(e) => {
              const value = e.target.value;
              setExshowroomPrice(value);
              saveSectionData("basicInfo", { priceExshowroom: value });
              // Run validation if both prices are entered
              if (value && onroadPrice) {
                if (Number(value) >= Number(onroadPrice)) {
                  setPriceError(
                    "Ex-showroom price must be lower than On-road price"
                  );
                } else {
                  setPriceError("");
                }
              }
            }}
            className={`mt-1 block w-full rounded bg-background border ${
              priceError ? "border-destructive" : "border-input"
            } text-foreground px-3 py-2`}
          />
          {priceError && (
            <p className="text-destructive text-sm mt-1">{priceError}</p>
          )}
        </div>

        {/* Pros Section */}
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-foreground mb-1"
            htmlFor="pros"
          >
            Pros
          </label>
          <textarea
            id="pros"
            name="pros"
            rows={4}
            value={basicInfo.pros || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { pros: e.target.value })
            }
            placeholder="Enter key advantages of this vehicle (one per line)"
            className="mt-1 block w-full rounded bg-background border-input text-foreground px-3 py-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter each point on a new line
          </p>
        </div>

        {/* Cons Section */}
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-foreground mb-1"
            htmlFor="cons"
          >
            Cons
          </label>
          <textarea
            id="cons"
            name="cons"
            rows={4}
            value={basicInfo.cons || ""}
            onChange={(e) =>
              saveSectionData("basicInfo", { cons: e.target.value })
            }
            placeholder="Enter potential drawbacks of this vehicle (one per line)"
            className="mt-1 block w-full rounded bg-background border-input text-foreground px-3 py-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter each point on a new line
          </p>
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
  }: {
    name: string;
    defaultValue?: string | number;
    type?: string;
    className?: string;
    section?: string;
    [key: string]: any;
  }) => {
    // Get value from form state, or use default
    const storedValue = formState[section]?.[name];
    const initialValue = storedValue !== undefined ? storedValue : defaultValue;
    const [value, setValue] = useState(initialValue);
    const [focused, setFocused] = useState(false);
    const inputId = `${section}-${name}`;

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
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Immediately update form state when value changes
        saveSectionData(section, { [name]: newValue });
      },
      [section, name, saveSectionData]
    );

    return (
      <div>
        <input
          id={inputId}
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
                : String(defaultValue)
              : ""
          }
          className={`mt-1 block w-full rounded border bg-background text-foreground px-3 py-2 ${
            hasError(name) ? "border-destructive" : "border-input"
          } ${className}`}
          {...props}
        />
        {hasError(name) && (
          <p className="text-destructive text-sm mt-1">
            {getErrorMessage(name)}
          </p>
        )}
      </div>
    );
  };

  // Initialize form state with default values when vehicle type changes
  useEffect(() => {
    // Set default values based on vehicle type
    const defaultData =
      vehicleType === "cars" ? defaultCarData : defaultBikeData;

    // Initialize only if basicInfo doesn't exist yet or if vehicle type has changed
    if (!formState.basicInfo) {
      saveSectionData("basicInfo", defaultData);
      console.log(`Initialized default ${vehicleType} data:`, defaultData);
    }
  }, [vehicleType, saveSectionData, formState.basicInfo]);

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

          // If no saved state, apply default values
          const defaultData =
            vehicleType === "cars" ? defaultCarData : defaultBikeData;
          saveSectionData("basicInfo", defaultData);

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
        } else {
          // If no saved state, apply default values
          const defaultData =
            vehicleType === "cars" ? defaultCarData : defaultBikeData;
          saveSectionData("basicInfo", defaultData);
        }

        setFormInitialized(true);
      } catch (error) {
        console.error("Failed to load saved form state:", error);

        // If error, still apply default values
        const defaultData =
          vehicleType === "cars" ? defaultCarData : defaultBikeData;
        saveSectionData("basicInfo", defaultData);

        setFormInitialized(true);
      }
    };

    loadSavedFormState();
  }, [vehicleType, saveSectionData]);

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

  // Update active sections when vehicle type changes
  useEffect(() => {
    const newActiveSections =
      vehicleType === "cars" ? SPEC_SECTIONS : BIKE_SECTIONS;
    setActiveSection(newActiveSections[0].id);

    // Apply default values when vehicle type changes
    const defaultData =
      vehicleType === "cars" ? defaultCarData : defaultBikeData;
    saveSectionData("basicInfo", defaultData);
  }, [vehicleType, saveSectionData]);

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
      // Check price validation first
      if (
        formState.basicInfo?.priceExshowroom &&
        formState.basicInfo?.priceOnroad
      ) {
        if (
          Number(formState.basicInfo.priceExshowroom) >=
          Number(formState.basicInfo.priceOnroad)
        ) {
          setPriceError("Ex-showroom price must be lower than On-road price");
          throw new Error("Ex-showroom price must be lower than On-road price");
        }
      }

      const formData = new FormData(e.currentTarget);
      formData.append("vehicleType", vehicleType);

      // Add pros and cons to form data
      if (formState.basicInfo?.pros) {
        formData.append("pros", formState.basicInfo.pros);
      }
      if (formState.basicInfo?.cons) {
        formData.append("cons", formState.basicInfo.cons);
      }

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

  // Function to toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    // Scroll to top when entering preview mode
    if (!previewMode) {
      window.scrollTo(0, 0);
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
              <label className="block text-sm font-medium text-foreground mb-4">
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
                usePlaceholder={true}
                placeholderText="Upload your vehicle's main image here"
              />
            </div>
            {vehicleType === "cars" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
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
                    usePlaceholder={true}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
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
                    usePlaceholder={true}
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
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
                  usePlaceholder={true}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-4">
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
                usePlaceholder={true}
              />
            </div>
          </div>
        );

      case "engineTransmission":
        if (vehicleType === "bikes") {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Engine Type
                </label>
                <InputField
                  name="engineType"
                  defaultValue="Single Cylinder, Liquid Cooled, DOHC, FI Engine"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
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
                <label className="block text-sm font-medium text-foreground">
                  Max Power
                </label>
                <InputField name="maxPower" defaultValue="46 PS @ 8500 rpm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Max Torque
                </label>
                <InputField name="maxTorque" defaultValue="39 Nm @ 6500 rpm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  No. of Cylinders
                </label>
                <InputField name="cylinders" defaultValue={1} type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Cooling System
                </label>
                <select
                  name="coolingSystem"
                  defaultValue="Liquid Cooled"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {COOLING_SYSTEMS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Starting
                </label>
                <select
                  name="startingType"
                  defaultValue="Self Start Only"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {STARTING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Fuel Supply
                </label>
                <select
                  name="fuelSupply"
                  defaultValue="Fuel Injection"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {FUEL_SUPPLY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Clutch
                </label>
                <select
                  name="clutchType"
                  defaultValue="Assist & Slipper"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {CLUTCH_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Ignition
                </label>
                <InputField
                  name="ignition"
                  defaultValue="Contactless, Controlled, Fully Electronic Ignition System With Digital Ignition Timing Adjustment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Gear Box
                </label>
                <InputField name="gearBox" defaultValue="6 Speed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Bore (mm)
                </label>
                <InputField name="bore" defaultValue="89" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Stroke (mm)
                </label>
                <InputField name="stroke" defaultValue="64" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Compression Ratio
                </label>
                <InputField name="compressionRatio" defaultValue="12.71:1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Emission Type
                </label>
                <InputField name="emissionType" defaultValue="BS6-2.0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Drive Type
                </label>
                <select
                  name="driveTypeBike"
                  defaultValue="Chain Drive"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
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
              <label className="block text-sm font-medium text-foreground">
                Engine Type
              </label>
              <InputField name="engineType" defaultValue="mHawk 130 CRDe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Displacement (cc)
              </label>
              <InputField
                name="displacement"
                defaultValue="2184"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Max Power
              </label>
              <InputField name="maxPower" defaultValue="130.07bhp@3750rpm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Max Torque
              </label>
              <InputField name="maxTorque" defaultValue="300Nm@1600-2800rpm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                No. of Cylinders
              </label>
              <InputField name="cylinders" defaultValue={4} type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Valves Per Cylinder
              </label>
              <InputField
                name="valvesPerCylinder"
                defaultValue={4}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Turbo Charger
              </label>
              <select
                name="turboCharger"
                defaultValue="Yes"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Transmission Type
              </label>
              <select
                name="transmissionType"
                defaultValue="Automatic"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Gearbox
              </label>
              <InputField name="gearbox" defaultValue="6-Speed AT" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Drive Type
              </label>
              <select
                name="driveType"
                defaultValue="4WD"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
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
              <label className="block text-sm font-medium text-foreground">
                Fuel Type
              </label>
              <select
                name="fuelType"
                defaultValue="Diesel"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {["Petrol", "Diesel", "CNG", "Electric"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Fuel Tank Capacity (Litres)
              </label>
              <InputField
                name="fuelTankCapacity"
                defaultValue={57}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Highway Mileage
              </label>
              <InputField name="highwayMileage" defaultValue="10 kmpl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Steering Column
              </label>
              <select
                name="steeringColumn"
                defaultValue="Tilt"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {STEERING_COLUMNS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Steering Gear Type
              </label>
              <InputField
                name="steeringGearType"
                defaultValue="Rack & Pinion"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Front Brake Type
              </label>
              <select
                name="frontBrakeType"
                defaultValue="Disc"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {BRAKE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Rear Brake Type
              </label>
              <select
                name="rearBrakeType"
                defaultValue="Drum"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {BRAKE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Front Wheel Size (Inch)
              </label>
              <InputField
                name="frontWheelSize"
                defaultValue={18}
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Length (mm)
              </label>
              <InputField name="length" defaultValue="3985" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Width (mm)
              </label>
              <InputField name="width" defaultValue="1820" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Height (mm)
              </label>
              <InputField name="height" defaultValue="1855" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Seating Capacity
              </label>
              <InputField
                name="seatingCapacity"
                defaultValue="4"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Ground Clearance (mm)
              </label>
              <InputField
                name="groundClearance"
                defaultValue="226"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Wheel Base (mm)
              </label>
              <InputField name="wheelBase" defaultValue="2450" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Approach Angle
              </label>
              <InputField
                name="approachAngle"
                defaultValue="41.2"
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Break-over Angle
              </label>
              <InputField
                name="breakoverAngle"
                defaultValue="26.2"
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Departure Angle
              </label>
              <InputField
                name="departureAngle"
                defaultValue="36"
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                No. of Doors
              </label>
              <InputField name="doors" defaultValue="3" type="number" />
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Power Steering
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="airConditioner"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Air Conditioner
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="heater"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Heater
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="adjustableSteering"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Adjustable Steering
                </span>
              </label>
              {/* Add remaining checkboxes */}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Parking Sensors
              </label>
              <select
                name="parkingSensors"
                defaultValue="Rear"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {PARKING_SENSOR_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Foldable Rear Seat
              </label>
              <InputField name="foldableRearSeat" defaultValue="50:50 Split" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                USB Charger
              </label>
              <select
                name="usbCharger"
                defaultValue="Front"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Tachometer
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="gloveBox"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Glove Box
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="digitalCluster"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Digital Cluster
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Upholstery
              </label>
              <select
                name="upholstery"
                defaultValue="Leatherette"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {UPHOLSTERY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">
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
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter each feature on a new line or separated by commas
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
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
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Rear Window Wiper
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rearWindowDefogger"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Rear Window Washer
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="alloyWheels"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Rear Window Defogger
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="integratedAntenna"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Alloy Wheels
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="halogenHeadlamps"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Integrated Antenna
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledTaillights"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Projector Headlamps
                </span>
              </label>
              <label className="block text-sm font-medium text-foreground">
                Sunroof Type
              </label>
              <select
                name="sunroofType"
                defaultValue="None"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Powered & Folding ORVM
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledDRLs"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  LED DRLs
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ledTaillights"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  LED Taillights
                </span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Fog Lights
                </label>
                <select
                  name="fogLights"
                  defaultValue="Front"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {FOG_LIGHT_POSITIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  LED Fog Lamps
                </label>
                <select
                  name="ledFogLamps"
                  defaultValue="Front"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {FOG_LIGHT_POSITIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Tyre Size
                </label>
                <InputField name="tyreSize" defaultValue="255/60 R19" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Tyre Type
                </label>
                <select
                  name="tyreType"
                  defaultValue="Radial Tubeless"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {TYRE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground">
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
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
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
                    className="rounded border border-input bg-background text-primary"
                    defaultChecked={true}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Additional ADAS Features
                </label>
                <textarea
                  name="additionalADASFeatures"
                  rows={5}
                  placeholder="Enter additional ADAS features..."
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  ADAS System Name
                </label>
                <input
                  type="text"
                  name="adasSystemName"
                  placeholder="e.g. Honda Sensing, Nissan ProPILOT"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
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
                    className="rounded border border-input bg-background text-primary"
                    defaultChecked={true}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Touchscreen Size (inch)
                </label>
                <input
                  type="number"
                  name="touchscreenSize"
                  defaultValue="7"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 7.5, 10.25"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can enter decimal values (e.g. 7.5, 10.25)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  No. of Speakers
                </label>
                <InputField name="speakers" defaultValue={4} type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Speaker Location
                </label>
                <select
                  name="speakerLocation"
                  defaultValue="Front & Rear"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {SPEAKER_LOCATIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground">
                  Additional Entertainment Features
                </label>
                <textarea
                  name="additionalEntertainmentFeatures"
                  rows={5}
                  defaultValue="Connected apps,
83 connected features,
DTS sound staging"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                  onClick={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    if (target.defaultValue === target.value) {
                      target.value = "";
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  E-Call & I-Call
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Remote Vehicle Ignition Start/Stop
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  SOS Button
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Remote AC On/Off
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="overSpeedingAlert"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  USB Charging Port
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="cruiseControl"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Cruise Control
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="bodyGraphics"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Body Graphics
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="stepupSeat"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Step-up Seat
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="passengerFootrest"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Passenger Footrest
                </span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Instrument Console
                </label>
                <select
                  name="instrumentConsole"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {CONSOLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Speedometer
                </label>
                <select
                  name="speedometerType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Tachometer
                </label>
                <select
                  name="tachometerType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Tripmeter
                </label>
                <select
                  name="tripmeterType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Odometer
                </label>
                <select
                  name="odometerType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Clock
                </label>
                <select
                  name="clockType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Seat Type
                </label>
                <select
                  name="seatType"
                  defaultValue="Split"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {SEAT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Pass Switch
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ridingModes"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Riding Modes
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tractionControl"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Traction Control
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="launchControl"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Launch Control
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="quickShifter"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Quick Shifter
                </span>
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  ABS Type
                </label>
                <select
                  name="absType"
                  defaultValue="Dual Channel"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {ABS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Clock
                </label>
                <select
                  name="clockType"
                  defaultValue="Digital"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {INSTRUMENT_DISPLAY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Body Type
              </label>
              <select
                name="bodyType"
                defaultValue="Sports Naked Bikes"
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {BODY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Fuel Capacity (L)
              </label>
              <InputField name="fuelCapacity" defaultValue="15" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Saddle Height (mm)
              </label>
              <InputField
                name="saddleHeight"
                defaultValue="820"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Ground Clearance (mm)
              </label>
              <InputField
                name="groundClearance"
                defaultValue="183"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Wheelbase (mm)
              </label>
              <InputField name="wheelbase" defaultValue="1354" type="number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
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
                <label className="block text-sm font-medium text-foreground">
                  Headlight
                </label>
                <select
                  name="headlightType"
                  defaultValue="LED"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {LIGHT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Taillight
                </label>
                <select
                  name="taillightType"
                  defaultValue="LED"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {LIGHT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Turn Signal Lamp
                </label>
                <select
                  name="turnSignalType"
                  defaultValue="LED"
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
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
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  LED Taillights
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lowBatteryIndicator"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
                  Low Battery Indicator
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lowFuelIndicator"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Front Brake Diameter (mm)
              </label>
              <InputField
                name="frontBrakeDiameter"
                defaultValue="320"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Rear Brake Diameter (mm)
              </label>
              <InputField
                name="rearBrakeDiameter"
                defaultValue="240"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Front Brake Type
              </label>
              <InputField name="frontBrakeType" defaultValue="Disc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Rear Brake Type
              </label>
              <InputField name="rearBrakeType" defaultValue="Disc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Front Tyre Size
              </label>
              <InputField name="frontTyreSize" defaultValue="110/70-17" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Rear Tyre Size
              </label>
              <InputField name="rearTyreSize" defaultValue="150/60-17" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Wheel Size
              </label>
              <InputField
                name="wheelSize"
                defaultValue="Front: 431.8 mm, Rear: 431.8 mm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Wheel Type
              </label>
              <InputField name="wheelType" defaultValue="Alloy" />
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tubelessTyre"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Peak Power
              </label>
              <InputField name="peakPower" defaultValue="46 PS @ 8500 rpm" />
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="lowBatteryAlert"
                  className="rounded border border-input bg-background text-primary"
                  defaultChecked={true}
                />
                <span className="text-sm font-medium text-foreground">
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
              <label className="block text-sm font-medium text-foreground">
                Suspension Front
              </label>
              <InputField
                name="suspensionFront"
                defaultValue="5-click Compression & Rebound adjustable, Open Cartridge, WP APEX USD forks, 43mm diameter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
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
  }, [
    activeSection,
    vehicleType,
    validationErrors,
    mainImages,
    interiorImages,
    exteriorImages,
    galleryImages,
    colorImages,
    interiorFeatures,
    interiorFeaturesCleared,
  ]);

  const renderSectionButton = (section: { id: string; label: string }) => (
    <button
      key={section.id}
      type="button"
      onClick={() => setActiveSection(section.id)}
      className={`w-full text-left px-4 py-2 rounded flex items-center justify-between ${
        activeSection === section.id
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <span>{section.label}</span>
      {sectionCompletionStatus[section.id] && (
        <span className="text-success text-sm">✓</span>
      )}
    </button>
  );

  const handleVehicleTypeChange = (type: "cars" | "bikes") => {
    setVehicleType(type);
    // Reset form state when changing vehicle type
    const newSections = type === "cars" ? SPEC_SECTIONS : BIKE_SECTIONS;
    setActiveSection(newSections[0].id);
  };
  // Render preview mode if enabled
  if (previewMode) {
    return (
      <div className="w-full min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto bg-card rounded-lg border p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Vehicle Preview
            </h1>
            <Button onClick={togglePreviewMode} variant="outline">
              Back to Edit
            </Button>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => handleSubmit(new Event("submit") as any)}
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-50" : ""}
            >
              {isSubmitting ? "Creating..." : "Create Vehicle"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Regular form view
  return (
    <div className="w-full min-h-screen bg-background p-8">
      <form onSubmit={handleSubmit} className="max-w-full mx-auto">
        <div className="flex gap-6">
          {/* Side Panel */}
          <div className="w-64 flex-shrink-0 bg-card p-4 rounded-lg border">
            <nav className="space-y-2 sticky top-4">
              {activeSections.map((section) => renderSectionButton(section))}
            </nav>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 bg-card p-6 rounded-lg border">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              Add New Vehicle
            </h1>

            {/* Vehicle Type Selection - Changed to Tabs */}
            <Tabs
              defaultValue={vehicleType}
              value={vehicleType}
              onValueChange={(value) =>
                handleVehicleTypeChange(value as "cars" | "bikes")
              }
              className="w-[400px] mb-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cars" className="flex items-center gap-2">
                  <Car className="h-4 w-4" /> Car
                </TabsTrigger>
                <TabsTrigger value="bikes" className="flex items-center gap-2">
                  <Bike className="h-4 w-4" /> Bike
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Dynamic Section Content */}
            <div className="space-y-6">{renderSectionFields()}</div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <Button
                type="button"
                onClick={handlePreviousSection}
                disabled={activeSection === activeSections[0].id}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {activeSection ===
                  activeSections[activeSections.length - 1].id && (
                  <Button
                    type="button"
                    onClick={togglePreviewMode}
                    variant="secondary"
                  >
                    Preview
                  </Button>
                )}

                {activeSection ===
                activeSections[activeSections.length - 1].id ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? "opacity-50" : ""}
                  >
                    {isSubmitting ? "Creating..." : "Create Vehicle"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNextSection}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

// Define InfoCard component outside the main component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background border rounded-md p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-1">{value}</p>
    </div>
  );
}
