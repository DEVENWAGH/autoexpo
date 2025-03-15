"use client";

import { useRouter } from "next/navigation";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useState, useCallback, useEffect } from "react";
import { vehicleService } from "@/services/vehicleService";
import { toast } from "react-hot-toast";
import { useAuthCheck } from "@/lib/authCheck";
import { Button } from "@/components/ui/button";
import { BikePreview } from "@/components/vehicle/BikePreview";
import { useVehicleStore, BIKE_PLACEHOLDERS } from "@/store/vehicleStore";
import { validateSection, validatePrices, validateImages } from "@/validation/formValidation";
import { PlaceholderInput, PlaceholderTextarea, SectionButton, FormField, FormSection } from "@/components/form/FormComponents";

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
const CLUTCH_TYPES = [
  "Assist & Slipper",
  "Wet Multi-plate",
  "Dry",
  "Manual",
] as const;
const BODY_TYPES = [
  "Sports Naked Bikes",
  "Sports Bikes",
  "Cruiser",
  "Commuter",
  "Adventure",
  "Scooter",
] as const;

export default function NewBikePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuthCheck();
  const { 
    vehicleType,
    formState,
    mainImages, 
    galleryImages,
    colorImages,
    setVehicleType,
    setMainImages,
    setGalleryImages,
    setColorImages,
    updateFormSection,
    reset
  } = useVehicleStore();

  const [activeSection, setActiveSection] = useState<string>(BIKE_SECTIONS[0].id);
  const [sectionCompletionStatus, setSectionCompletionStatus] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  // Setup initial vehicle type
  useEffect(() => {
    setVehicleType('bikes');
  }, [setVehicleType]);

  // Save form data helper
  const handleFieldChange = useCallback((section: string, field: string, value: any) => {
    updateFormSection(section, { [field]: value });
  }, [updateFormSection]);

  // Validate current section
  const validateCurrentSection = useCallback(() => {
    if (!formState || !formState[activeSection]) return true;
    
    // Special handling for images section
    if (activeSection === "images") {
      // Mark as valid only if at least one main image exists
      return mainImages.length > 0;
    }
    
    const { isValid, errors } = validateSection(activeSection, formState[activeSection]);
    
    // Special case for price validation in basicInfo section - only run if basic validation passes
    if (activeSection === "basicInfo" && isValid && formState.basicInfo?.priceExshowroom && formState.basicInfo?.priceOnroad) {
      const priceCheck = validatePrices(
        formState.basicInfo.priceExshowroom, 
        formState.basicInfo.priceOnroad
      );
      
      if (!priceCheck.isValid) {
        setValidationErrors({
          priceExshowroom: priceCheck.error
        });
        return false;
      }
    }
    
    // Only set validation errors if there are actual errors
    if (!isValid) {
      setValidationErrors(errors || {});
    } else {
      setValidationErrors({});
    }
    return isValid;
  }, [activeSection, formState, mainImages]);

  // Update section completion status when section changes
  useEffect(() => {
    // For images section, check if mainImages exist to mark completion
    if (activeSection === "images") {
      // Check if image section should be marked as completed
      const isValid = mainImages.length > 0;
      if (isValid) {
        setSectionCompletionStatus(prev => ({
          ...prev,
          [activeSection]: true
        }));
      } else {
        setSectionCompletionStatus(prev => ({
          ...prev,
          [activeSection]: false
        }));
      }
      return;
    }
    
    // For other sections, use the existing logic
    if (formState[activeSection]) {
      const timer = setTimeout(() => {
        const isValid = validateCurrentSection();
        if (isValid) {
          setSectionCompletionStatus(prev => ({
            ...prev,
            [activeSection]: true
          }));
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formState, activeSection, validateCurrentSection, mainImages]);

  // Section navigation handlers
  const handleNextSection = useCallback(() => {
    if (validateCurrentSection()) {
      const currentIndex = BIKE_SECTIONS.findIndex(section => section.id === activeSection);
      if (currentIndex < BIKE_SECTIONS.length - 1) {
        setActiveSection(BIKE_SECTIONS[currentIndex + 1].id);
      }
    } else {
      toast.error("Please fix the errors in this section before continuing");
    }
  }, [activeSection, validateCurrentSection]);

  const handlePreviousSection = useCallback(() => {
    const currentIndex = BIKE_SECTIONS.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(BIKE_SECTIONS[currentIndex - 1].id);
    }
  }, [activeSection]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Similar validation as car form...
      // ...
      
      // Prepare form data
      const formData = new FormData();
      formData.append("vehicleType", "bikes");
      
      // Add form state as JSON
      Object.entries(formState).forEach(([section, data]) => {
        formData.append(section, JSON.stringify(data));
      });
      
      // Add images
      if (mainImages.length === 0) {
        formData.append("mainImages", "/placeholder.svg");
      } else {
        mainImages.forEach((img) => formData.append("mainImages", img));
      }
      
      colorImages.forEach((img) => formData.append("colorImages", img));
      galleryImages.forEach((img) => formData.append("galleryImages", img));
      
      // Submit data
      await vehicleService.createVehicle(formData);
      toast.success("Bike created successfully");
      reset();
      router.push("/brands/dashboard");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create vehicle");
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle preview mode
  const togglePreviewMode = useCallback(() => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      window.scrollTo(0, 0);
    }
  }, [previewMode]);

  // Render section fields based on the active section - adapt from existing components
  const renderSectionFields = useCallback(() => {
    switch (activeSection) {
      case "basicInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Brand Name" required>
              <select
                name="brand"
                value={formState.basicInfo?.brand || ""}
                onChange={(e) => handleFieldChange("basicInfo", "brand", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Brand</option>
                {BIKE_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {validationErrors["brand"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["brand"]}</p>
              )}
            </FormField>

            <FormField label="Model Name" required>
              <PlaceholderInput
                name="name"
                placeholder={BIKE_PLACEHOLDERS.name}
                value={formState.basicInfo?.name || ""}
                onChange={(e) => handleFieldChange("basicInfo", "name", e.target.value)}
              />
              {validationErrors["name"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["name"]}</p>
              )}
            </FormField>

            <FormField label="Ex-Showroom Price (₹)" required>
              <PlaceholderInput
                name="priceExshowroom"
                type="number"
                placeholder={BIKE_PLACEHOLDERS.priceExshowroom}
                value={formState.basicInfo?.priceExshowroom || ""}
                onChange={(e) => handleFieldChange("basicInfo", "priceExshowroom", e.target.value)}
                min="0"
                step="1000"
              />
              {validationErrors["priceExshowroom"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["priceExshowroom"]}</p>
              )}
            </FormField>

            <FormField label="On-Road Price (₹)" required>
              <PlaceholderInput
                name="priceOnroad"
                type="number"
                placeholder={BIKE_PLACEHOLDERS.priceOnroad}
                value={formState.basicInfo?.priceOnroad || ""}
                onChange={(e) => handleFieldChange("basicInfo", "priceOnroad", e.target.value)}
                min="0"
                step="1000"
              />
              {validationErrors["priceOnroad"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["priceOnroad"]}</p>
              )}
            </FormField>

            <FormField label="Variant">
              <select
                name="variant"
                value={formState.basicInfo?.variant || "Base"}
                onChange={(e) => handleFieldChange("basicInfo", "variant", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {["Base", "Mid", "Top"].map((variant) => (
                  <option key={variant} value={variant}>{variant}</option>
                ))}
              </select>
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Pros">
                <PlaceholderTextarea
                  name="pros"
                  placeholder={BIKE_PLACEHOLDERS.pros}
                  value={formState.basicInfo?.pros || ""}
                  onChange={(e) => handleFieldChange("basicInfo", "pros", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Enter each point on a new line</p>
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Cons">
                <PlaceholderTextarea
                  name="cons"
                  placeholder={BIKE_PLACEHOLDERS.cons}
                  value={formState.basicInfo?.cons || ""}
                  onChange={(e) => handleFieldChange("basicInfo", "cons", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Enter each point on a new line</p>
              </FormField>
            </div>
          </div>
        );

      case "images":
        return (
          <div className="space-y-8">
            <div>
              <FormField label="Main Cover Image">
                <MultipleImageUpload
                  images={mainImages}
                  onChange={setMainImages}
                  maxFiles={1}
                  label="Cover Image"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">This image will appear as the main display image</p>
              </FormField>
            </div>

            <div>
              <FormField label="Gallery Images">
                <MultipleImageUpload
                  images={galleryImages}
                  onChange={setGalleryImages}
                  maxFiles={8}
                  label="Gallery Images (Optional)"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">Upload up to 8 images showcasing the bike</p>
              </FormField>
            </div>

            <div>
              <FormField label="Color Variants">
                <MultipleImageUpload
                  images={colorImages}
                  onChange={setColorImages}
                  maxFiles={10}
                  label="Color Variants (Optional)"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">Upload images of different color options available</p>
              </FormField>
            </div>
          </div>
        );

      case "engineTransmission":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Engine Type" required>
              <PlaceholderInput
                name="engineType"
                placeholder="Single Cylinder, Liquid Cooled, DOHC, FI Engine"
                value={formState.engineTransmission?.engineType || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "engineType", e.target.value)}
              />
              {validationErrors["engineType"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["engineType"]}</p>
              )}
            </FormField>
            
            <FormField label="Displacement (cc)">
              <PlaceholderInput
                name="displacement"
                placeholder="398.63"
                type="number"
                step="0.01"
                value={formState.engineTransmission?.displacement || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "displacement", e.target.value)}
              />
            </FormField>
            
            <FormField label="Max Power" required>
              <PlaceholderInput
                name="maxPower"
                placeholder="46 PS @ 8500 rpm"
                value={formState.engineTransmission?.maxPower || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "maxPower", e.target.value)}
              />
              {validationErrors["maxPower"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["maxPower"]}</p>
              )}
            </FormField>
            
            <FormField label="Max Torque" required>
              <PlaceholderInput
                name="maxTorque"
                placeholder="39 Nm @ 6500 rpm"
                value={formState.engineTransmission?.maxTorque || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "maxTorque", e.target.value)}
              />
              {validationErrors["maxTorque"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["maxTorque"]}</p>
              )}
            </FormField>
            
            <FormField label="No. of Cylinders">
              <PlaceholderInput
                name="cylinders"
                placeholder="1"
                type="number"
                value={formState.engineTransmission?.cylinders || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "cylinders", e.target.value)}
              />
            </FormField>
            
            <FormField label="Cooling System">
              <select
                name="coolingSystem"
                value={formState.engineTransmission?.coolingSystem || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "coolingSystem", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Cooling System</option>
                {COOLING_SYSTEMS.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Starting">
              <select
                name="startingType"
                value={formState.engineTransmission?.startingType || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "startingType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Starting Type</option>
                {STARTING_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Fuel Supply">
              <select
                name="fuelSupply"
                value={formState.engineTransmission?.fuelSupply || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "fuelSupply", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Fuel Supply</option>
                {FUEL_SUPPLY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
          </div>
        );

      // Add all the remaining sections
      case "features":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {["usbChargingPort", "cruiseControl", "bodyGraphics", "stepupSeat", "passengerFootrest"].map((feature) => (
                <label key={feature} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name={feature}
                    checked={formState.features?.[feature] || false}
                    onChange={(e) => handleFieldChange("features", feature, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "featuresAndSafety":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "passSwitch",
                "ridingModes",
                "tractionControl",
                "launchControl",
                "quickShifter",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.featuresAndSafety?.[feature] || false}
                    onChange={(e) => handleFieldChange("featuresAndSafety", feature, e.target.checked)}
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <FormField label="ABS Type">
                <select
                  name="absType"
                  value={formState.featuresAndSafety?.absType || ""}
                  onChange={(e) => handleFieldChange("featuresAndSafety", "absType", e.target.value)}
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select ABS Type</option>
                  {["Single Channel", "Dual Channel", "None"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Display">
                <PlaceholderInput
                  name="displayType"
                  placeholder="5 Inch, TFT"
                  value={formState.featuresAndSafety?.displayType || ""}
                  onChange={(e) => handleFieldChange("featuresAndSafety", "displayType", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        );

      case "mileageAndPerformance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Overall Mileage (kmpl)">
              <PlaceholderInput
                name="overallMileage"
                placeholder="28.9"
                type="number"
                step="0.1"
                value={formState.mileageAndPerformance?.overallMileage || ""}
                onChange={(e) => handleFieldChange("mileageAndPerformance", "overallMileage", e.target.value)}
              />
            </FormField>
            <FormField label="Top Speed (kmph)">
              <PlaceholderInput
                name="topSpeed"
                placeholder="167"
                type="number"
                value={formState.mileageAndPerformance?.topSpeed || ""}
                onChange={(e) => handleFieldChange("mileageAndPerformance", "topSpeed", e.target.value)}
              />
            </FormField>
            <FormField label="0-100 kmph">
              <PlaceholderInput
                name="acceleration"
                placeholder="4.2"
                type="number"
                step="0.1"
                value={formState.mileageAndPerformance?.acceleration || ""}
                onChange={(e) => handleFieldChange("mileageAndPerformance", "acceleration", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Time in seconds</p>
            </FormField>
          </div>
        );

      case "chassisAndSuspension":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Body Type">
              <select
                name="bodyType"
                value={formState.chassisAndSuspension?.bodyType || ""}
                onChange={(e) => handleFieldChange("chassisAndSuspension", "bodyType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Body Type</option>
                {BODY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Frame Type">
              <PlaceholderInput
                name="frameType"
                placeholder="Split-Trellis frame"
                value={formState.chassisAndSuspension?.frameType || ""}
                onChange={(e) => handleFieldChange("chassisAndSuspension", "frameType", e.target.value)}
              />
            </FormField>
            <FormField label="Front Suspension">
              <PlaceholderInput
                name="frontSuspension"
                placeholder="USD forks, 43mm diameter"
                value={formState.chassisAndSuspension?.frontSuspension || ""}
                onChange={(e) => handleFieldChange("chassisAndSuspension", "frontSuspension", e.target.value)}
              />
            </FormField>
            <FormField label="Rear Suspension">
              <PlaceholderInput
                name="rearSuspension"
                placeholder="Monoshock with preload adjustment"
                value={formState.chassisAndSuspension?.rearSuspension || ""}
                onChange={(e) => handleFieldChange("chassisAndSuspension", "rearSuspension", e.target.value)}
              />
            </FormField>
          </div>
        );

      case "dimensionsAndCapacity":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Fuel Capacity (L)">
              <PlaceholderInput
                name="fuelCapacity"
                placeholder="15"
                type="number"
                step="0.1"
                value={formState.dimensionsAndCapacity?.fuelCapacity || ""}
                onChange={(e) => handleFieldChange("dimensionsAndCapacity", "fuelCapacity", e.target.value)}
              />
            </FormField>
            <FormField label="Saddle Height (mm)">
              <PlaceholderInput
                name="saddleHeight"
                placeholder="820"
                type="number"
                value={formState.dimensionsAndCapacity?.saddleHeight || ""}
                onChange={(e) => handleFieldChange("dimensionsAndCapacity", "saddleHeight", e.target.value)}
              />
            </FormField>
            <FormField label="Ground Clearance (mm)">
              <PlaceholderInput
                name="groundClearance"
                placeholder="183"
                type="number"
                value={formState.dimensionsAndCapacity?.groundClearance || ""}
                onChange={(e) => handleFieldChange("dimensionsAndCapacity", "groundClearance", e.target.value)}
              />
            </FormField>
            <FormField label="Wheelbase (mm)">
              <PlaceholderInput
                name="wheelbase"
                placeholder="1354"
                type="number"
                value={formState.dimensionsAndCapacity?.wheelbase || ""}
                onChange={(e) => handleFieldChange("dimensionsAndCapacity", "wheelbase", e.target.value)}
              />
            </FormField>
            <FormField label="Kerb Weight (kg)">
              <PlaceholderInput
                name="kerbWeight"
                placeholder="168.3"
                type="number"
                step="0.1"
                value={formState.dimensionsAndCapacity?.kerbWeight || ""}
                onChange={(e) => handleFieldChange("dimensionsAndCapacity", "kerbWeight", e.target.value)}
              />
            </FormField>
          </div>
        );

      case "electricals":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField label="Headlight">
                <select
                  name="headlightType"
                  value={formState.electricals?.headlightType || ""}
                  onChange={(e) => handleFieldChange("electricals", "headlightType", e.target.value)}
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Headlight Type</option>
                  {["LED", "Halogen", "Projector", "Bulb"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Taillight">
                <select
                  name="taillightType"
                  value={formState.electricals?.taillightType || ""}
                  onChange={(e) => handleFieldChange("electricals", "taillightType", e.target.value)}
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Taillight Type</option>
                  {["LED", "Halogen", "Bulb"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="space-y-4">
              {[
                "ledTaillights",
                "lowBatteryIndicator",
                "lowFuelIndicator",
                "turnSignalLamp"
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.electricals?.[feature] || false}
                    onChange={(e) => handleFieldChange("electricals", feature, e.target.checked)}
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "tyresAndBrakes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Front Brake Type">
              <select
                name="frontBrakeType"
                value={formState.tyresAndBrakes?.frontBrakeType || ""}
                onChange={(e) => handleFieldChange("tyresAndBrakes", "frontBrakeType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Brake Type</option>
                {["Disc", "Drum"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Rear Brake Type">
              <select
                name="rearBrakeType"
                value={formState.tyresAndBrakes?.rearBrakeType || ""}
                onChange={(e) => handleFieldChange("tyresAndBrakes", "rearBrakeType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Brake Type</option>
                {["Disc", "Drum"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Front Brake Diameter (mm)">
              <PlaceholderInput
                name="frontBrakeDiameter"
                placeholder="320"
                type="number"
                value={formState.tyresAndBrakes?.frontBrakeDiameter || ""}
                onChange={(e) => handleFieldChange("tyresAndBrakes", "frontBrakeDiameter", e.target.value)}
              />
            </FormField>
            <FormField label="Rear Brake Diameter (mm)">
              <PlaceholderInput
                name="rearBrakeDiameter"
                placeholder="240"
                type="number"
                value={formState.tyresAndBrakes?.rearBrakeDiameter || ""}
                onChange={(e) => handleFieldChange("tyresAndBrakes", "rearBrakeDiameter", e.target.value)}
              />
            </FormField>
            <FormField label="Front Tyre Size">
              <PlaceholderInput
                name="frontTyreSize"
                placeholder="110/70-17"
                value={formState.tyresAndBrakes?.frontTyreSize || ""}
                onChange={(e) => handleFieldChange("tyresAndBrakes", "frontTyreSize", e.target.value)}
              />
            </FormField>
            <FormField label="Rear Tyre Size">
              <PlaceholderInput
                name="rearTyreSize"
                placeholder="150/60-17"
                value={formState.tyresAndBrakes?.rearTyreSize || ""}
                onChange={(e) => handleFieldChange("tyresAndBrakes", "rearTyreSize", e.target.value)}
              />
            </FormField>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formState.tyresAndBrakes?.tubelessTyre || false}
                  onChange={(e) => handleFieldChange("tyresAndBrakes", "tubelessTyre", e.target.checked)}
                  className="rounded border border-input bg-background text-primary"
                />
                <span className="text-sm font-medium text-foreground">Tubeless Tyre</span>
              </label>
            </div>
          </div>
        );

      case "motorAndBattery":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Motor Type">
              <PlaceholderInput
                name="motorType"
                placeholder="Permanent Magnet Synchronous"
                value={formState.motorAndBattery?.motorType || ""}
                onChange={(e) => handleFieldChange("motorAndBattery", "motorType", e.target.value)}
              />
            </FormField>
            <FormField label="Motor Power (kW)">
              <PlaceholderInput
                name="motorPower"
                placeholder="5.5"
                type="number"
                step="0.1"
                value={formState.motorAndBattery?.motorPower || ""}
                onChange={(e) => handleFieldChange("motorAndBattery", "motorPower", e.target.value)}
              />
            </FormField>
            <FormField label="Battery Type">
              <PlaceholderInput
                name="batteryType"
                placeholder="Lithium-ion"
                value={formState.motorAndBattery?.batteryType || ""}
                onChange={(e) => handleFieldChange("motorAndBattery", "batteryType", e.target.value)}
              />
            </FormField>
            <FormField label="Battery Capacity (kWh)">
              <PlaceholderInput
                name="batteryCapacity"
                placeholder="2.9"
                type="number"
                step="0.1"
                value={formState.motorAndBattery?.batteryCapacity || ""}
                onChange={(e) => handleFieldChange("motorAndBattery", "batteryCapacity", e.target.value)}
              />
            </FormField>
            <FormField label="Charging Time (hours)">
              <PlaceholderInput
                name="chargingTime"
                placeholder="4.5"
                type="number"
                step="0.1"
                value={formState.motorAndBattery?.chargingTime || ""}
                onChange={(e) => handleFieldChange("motorAndBattery", "chargingTime", e.target.value)}
              />
            </FormField>
            <FormField label="Range (km)">
              <PlaceholderInput
                name="range"
                placeholder="120"
                type="number"
                value={formState.motorAndBattery?.range || ""}
                onChange={(e) => handleFieldChange("motorAndBattery", "range", e.target.value)}
              />
            </FormField>
          </div>
        );

      case "underpinnings":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Front Fork">
              <PlaceholderInput
                name="frontFork"
                placeholder="Telescopic, 43mm USD fork"
                value={formState.underpinnings?.frontFork || ""}
                onChange={(e) => handleFieldChange("underpinnings", "frontFork", e.target.value)}
              />
            </FormField>
            <FormField label="Rear Monoshock">
              <PlaceholderInput
                name="rearMonoshock"
                placeholder="Monoshock with preload adjustment"
                value={formState.underpinnings?.rearMonoshock || ""}
                onChange={(e) => handleFieldChange("underpinnings", "rearMonoshock", e.target.value)}
              />
            </FormField>
            <FormField label="Swingarm">
              <PlaceholderInput
                name="swingarm"
                placeholder="Aluminum"
                value={formState.underpinnings?.swingarm || ""}
                onChange={(e) => handleFieldChange("underpinnings", "swingarm", e.target.value)}
              />
            </FormField>
            <FormField label="Chassis Type">
              <PlaceholderInput
                name="chassisType"
                placeholder="Trellis Frame"
                value={formState.underpinnings?.chassisType || ""}
                onChange={(e) => handleFieldChange("underpinnings", "chassisType", e.target.value)}
              />
            </FormField>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Please select a section to continue</p>
          </div>
        );
    }
  }, [activeSection, formState, handleFieldChange, validationErrors, mainImages, galleryImages, colorImages]);

  // In the Preview mode section, add similar preview support as in the car page
  const renderPreview = () => {
    if (previewMode) {
      return (
        <div className="w-full min-h-screen bg-background p-8">
          <div className="max-w-5xl mx-auto bg-card rounded-lg border p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Bike Preview</h1>
              <Button onClick={togglePreviewMode} variant="outline">
                Back to Edit
              </Button>
            </div>
            
            {/* BikePreview with properly passed color images */}
            <BikePreview data={formState} images={{
              main: mainImages[0] || "/placeholder.svg",
              gallery: galleryImages,
              colors: colorImages.length > 0 ? colorImages : []
            }} />
            
            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => handleSubmit(new Event("submit") as any)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Bike"}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Return the form structure
  if (previewMode) {
    return renderPreview();
  }

  return (
    <div className="w-full min-h-screen bg-background p-8">
      <form onSubmit={handleSubmit} className="max-w-full mx-auto">
        <div className="flex gap-6">
          {/* Side Panel */}
          <div className="w-64 flex-shrink-0 bg-card p-4 rounded-lg border">
            <nav className="space-y-2 sticky top-4">
              {BIKE_SECTIONS.map((section) => (
                <SectionButton
                  key={section.id}
                  section={section}
                  active={activeSection}
                  completed={sectionCompletionStatus[section.id]}
                  onClick={setActiveSection}
                />
              ))}
            </nav>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 bg-card p-6 rounded-lg border">
            <h1 className="text-2xl font-bold text-foreground mb-6">
              Add New Bike
            </h1>

            {/* Dynamic Section Content */}
            <div className="space-y-6">{renderSectionFields()}</div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <Button
                type="button"
                onClick={handlePreviousSection}
                disabled={activeSection === BIKE_SECTIONS[0].id}
                variant="outline"
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {activeSection === BIKE_SECTIONS[BIKE_SECTIONS.length - 1].id && (
                  <Button
                    type="button"
                    onClick={togglePreviewMode}
                    variant="secondary"
                  >
                    Preview
                  </Button>
                )}

                {activeSection === BIKE_SECTIONS[BIKE_SECTIONS.length - 1].id ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Bike"}
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
