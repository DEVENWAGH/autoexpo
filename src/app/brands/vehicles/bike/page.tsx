"use client";

import { useRouter } from "next/navigation";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { BikePreview } from "@/components/vehicle/BikePreview";
import { useVehicleStore, BIKE_PLACEHOLDERS } from "@/store/vehicleStore";
import { validateSection, validatePrices } from "@/validation/formValidation";
import { vehicleService } from "@/services/vehicleService";
import {
  PlaceholderInput,
  PlaceholderTextarea,
  SectionButton,
  FormField,
} from "@/components/form/FormComponents";

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

const BIKE_TYPES = [
  "Sports Bike",
  "Naked Sports",
  "Cruiser",
  "Commuter",
  "Adventure/Tourer",
  "Scooter",
  "Dirt Bike",
  "Electric",
  "Cafe Racer",
  "Supermoto",
  "Scrambler",
  "Retro/Classic",
  "Street Fighter",
] as const;

export default function NewBikePage() {
  const router = useRouter();
  const {
    formState,
    mainImages,
    galleryImages,
    colorImages,
    setVehicleType,
    setMainImages,
    setGalleryImages,
    setColorImages,
    updateFormSection,
    reset,
  } = useVehicleStore();

  const [activeSection, setActiveSection] = useState<string>(
    BIKE_SECTIONS[0].id
  );
  const [sectionCompletionStatus, setSectionCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [previewMode, setPreviewMode] = useState(false);

  // Setup initial vehicle type
  useEffect(() => {
    setVehicleType("bikes");
  }, [setVehicleType]);

  // Save form data helper
  const handleFieldChange = useCallback(
    (section: string, field: string, value: any) => {
      updateFormSection(section, { [field]: value });
    },
    [updateFormSection]
  );

  // Validate current section
  const validateCurrentSection = useCallback(() => {
    // Always validate required fields in basic info section
    if (activeSection === "basicInfo") {
      const { brand, name, priceExshowroom } = formState.basicInfo || {};

      const errors: Record<string, string> = {};
      if (!brand) errors.brand = "Brand is required";
      if (!name) errors.name = "Name is required";
      if (!priceExshowroom)
        errors.priceExshowroom = "Ex-showroom price is required";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error("Please fill all required fields marked with *");
        return false;
      }

      // Clear validation errors if all fields are valid
      setValidationErrors({});
    }

    // Special handling for images section - make it optional
    if (activeSection === "images") {
      // Clear any validation errors
      setValidationErrors({});
      return true; // Always return true for images section
    }

    // For engineTransmission section
    if (activeSection === "engineTransmission") {
      const { engineType, maxPower, maxTorque } =
        formState.engineTransmission || {};

      const errors: Record<string, string> = {};
      if (!engineType) errors.engineType = "Engine type is required";
      if (!maxPower) errors.maxPower = "Maximum power is required";
      if (!maxTorque) errors.maxTorque = "Maximum torque is required";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error(
          "Please fill all required fields in Engine & Transmission section"
        );
        return false;
      }

      // Clear validation errors if all fields are valid
      setValidationErrors({});
    }

    // If we're here and there's no data for the section, check if it's a required section
    if (!formState[activeSection]) {
      if (["basicInfo", "engineTransmission"].includes(activeSection)) {
        toast.error(
          `The ${activeSection} section has required fields that need to be filled`
        );
        return false;
      }
      setValidationErrors({});
      return true;
    }

    // For all other sections, assume they're valid if we get here
    // This prevents issues with the toast appearing for non-required sections
    if (!["basicInfo", "engineTransmission"].includes(activeSection)) {
      setValidationErrors({});
      return true;
    }

    // Run any schema-based validation
    const { isValid, errors } = validateSection(
      activeSection,
      formState[activeSection] || {},
      "bikes"
    );

    if (!isValid && errors) {
      const stringErrors: Record<string, string> = {};
      Object.entries(errors).forEach(([key, value]) => {
        stringErrors[key] = Array.isArray(value) ? value[0] : String(value);
      });
      setValidationErrors(stringErrors);
      toast.error("Please correct the validation errors before continuing");
      return false;
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
        setSectionCompletionStatus((prev) => ({
          ...prev,
          [activeSection]: true,
        }));
      } else {
        setSectionCompletionStatus((prev) => ({
          ...prev,
          [activeSection]: false,
        }));
      }
      return;
    }

    // For other sections, use the existing logic
    if (formState[activeSection]) {
      const timer = setTimeout(() => {
        const isValid = validateCurrentSection();
        if (isValid) {
          setSectionCompletionStatus((prev) => ({
            ...prev,
            [activeSection]: true,
          }));
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formState, activeSection, validateCurrentSection, mainImages]);

  // Section navigation handlers
  const handleNextSection = useCallback(() => {
    // Validate current section before navigating
    const isValid = validateCurrentSection();
    if (isValid) {
      const currentIndex = BIKE_SECTIONS.findIndex(
        (section) => section.id === activeSection
      );
      if (currentIndex < BIKE_SECTIONS.length - 1) {
        setActiveSection(BIKE_SECTIONS[currentIndex + 1].id);
      }
    }
    // Note: We no longer need the else block with toast.error since it's now handled in validateCurrentSection
  }, [activeSection, validateCurrentSection]);

  const handlePreviousSection = useCallback(() => {
    const currentIndex = BIKE_SECTIONS.findIndex(
      (section) => section.id === activeSection
    );
    if (currentIndex > 0) {
      setActiveSection(BIKE_SECTIONS[currentIndex - 1].id);
    }
  }, [activeSection]);

  // Add a function to validate all required sections
  const validateRequiredSections = useCallback(() => {
    // Check basic info
    const { brand, name, priceExshowroom } = formState.basicInfo || {};
    if (!brand || !name || !priceExshowroom) {
      setActiveSection("basicInfo");
      toast.error("Please complete the Basic Information section first");
      return false;
    }

    // Check images
    if (mainImages.length === 0) {
      setActiveSection("images");
      toast.error("Please upload at least one main image");
      return false;
    }

    // Check engine info
    const { engineType, maxPower, maxTorque } =
      formState.engineTransmission || {};
    if (!engineType || !maxPower || !maxTorque) {
      setActiveSection("engineTransmission");
      toast.error("Please complete the Engine & Transmission section");
      return false;
    }

    return true;
  }, [formState, mainImages, setActiveSection]);

  // Toggle preview mode with validation
  const togglePreviewMode = useCallback(() => {
    // Add validation check before showing preview
    const allSectionsValid = validateRequiredSections();
    if (!allSectionsValid) {
      toast.error("Please complete all required fields before previewing");
      return;
    }

    setPreviewMode(!previewMode);
    if (!previewMode) {
      window.scrollTo(0, 0);
    }
  }, [previewMode, validateRequiredSections]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all required sections before submission
    if (!validateRequiredSections()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Preparing bike form data for submission...");
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
        console.log("Using placeholder image for main image");
      } else {
        mainImages.forEach((img) => formData.append("mainImages", img));
        console.log(`Added ${mainImages.length} main images`);
      }

      colorImages.forEach((img) => formData.append("colorImages", img));
      galleryImages.forEach((img) => formData.append("galleryImages", img));

      // Submit data
      console.log("Submitting bike data...");
      await vehicleService.createVehicle(formData);
      toast.success(
        `Bike "${
          formState.basicInfo?.name || "New Bike"
        }" created successfully!`,
        {
          duration: 5000, // Show for 5 seconds
          icon: "🏍️", // Add bike icon for better visibility
        }
      );
      reset();
      router.push("/brands/dashboard");
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
                onChange={(e) =>
                  handleFieldChange("basicInfo", "brand", e.target.value)
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Brand</option>
                {BIKE_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {validationErrors["brand"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["brand"]}
                </p>
              )}
            </FormField>

            <FormField label="Model Name" required>
              <PlaceholderInput
                name="name"
                placeholder={BIKE_PLACEHOLDERS.name}
                value={formState.basicInfo?.name || ""}
                onChange={(e) =>
                  handleFieldChange("basicInfo", "name", e.target.value)
                }
              />
              {validationErrors["name"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["name"]}
                </p>
              )}
            </FormField>

            <FormField label="Variant Name" required>
              <PlaceholderInput
                name="variantName"
                placeholder="Variant Name"
                value={formState.basicInfo?.variantName || ""}
                onChange={(e) =>
                  handleFieldChange("basicInfo", "variantName", e.target.value)
                }
              />
              {validationErrors["variantName"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["variantName"]}
                </p>
              )}
            </FormField>

            <FormField label="Bike Type">
              <select
                name="bikeType"
                value={formState.basicInfo?.bikeType || ""}
                onChange={(e) =>
                  handleFieldChange("basicInfo", "bikeType", e.target.value)
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Bike Type</option>
                {BIKE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="space-y-2">
              <FormField label="Ex-Showroom Price (₹)" required>
                <PlaceholderInput
                  name="priceExshowroom"
                  type="number"
                  placeholder={BIKE_PLACEHOLDERS.priceExshowroom}
                  value={formState.basicInfo?.priceExshowroom || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "basicInfo",
                      "priceExshowroom",
                      e.target.value
                    )
                  }
                  min="0"
                  step="1000"
                />
                {validationErrors["priceExshowroom"] ? (
                  <p className="text-xs text-destructive mt-1">
                    {validationErrors["priceExshowroom"]}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ex-showroom price before taxes
                  </p>
                )}
              </FormField>
            </div>

            <FormField label="Variant">
              <select
                name="variant"
                value={formState.basicInfo?.variant || "Base"}
                onChange={(e) =>
                  handleFieldChange("basicInfo", "variant", e.target.value)
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                {["Base", "Mid", "Top"].map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Pros">
                <PlaceholderTextarea
                  name="pros"
                  placeholder={BIKE_PLACEHOLDERS.pros}
                  value={formState.basicInfo?.pros || ""}
                  onChange={(e) =>
                    handleFieldChange("basicInfo", "pros", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each point on a new line
                </p>
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Cons">
                <PlaceholderTextarea
                  name="cons"
                  placeholder={BIKE_PLACEHOLDERS.cons}
                  value={formState.basicInfo?.cons || ""}
                  onChange={(e) =>
                    handleFieldChange("basicInfo", "cons", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each point on a new line
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  This image will appear as the main display image
                </p>
              </FormField>
            </div>

            <div>
              <FormField label="Gallery Images">
                <MultipleImageUpload
                  images={galleryImages}
                  onChange={setGalleryImages}
                  maxFiles={30}
                  label="Gallery Images (Optional)"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload up to 30 images showcasing the bike
                </p>
              </FormField>
            </div>

            <div>
              <FormField label="Color Variants">
                <MultipleImageUpload
                  images={colorImages}
                  onChange={setColorImages}
                  maxFiles={30}
                  label="Color Variants (Optional)"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload up to 30 images of different color options available
                </p>
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
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "engineType",
                    e.target.value
                  )
                }
              />
              {validationErrors["engineType"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["engineType"]}
                </p>
              )}
            </FormField>

            <FormField label="Displacement (cc)">
              <PlaceholderInput
                name="displacement"
                placeholder="398.63"
                type="number"
                step="0.01"
                value={formState.engineTransmission?.displacement || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "displacement",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Max Power" required>
              <PlaceholderInput
                name="maxPower"
                placeholder="46 PS @ 8500 rpm"
                value={formState.engineTransmission?.maxPower || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "maxPower",
                    e.target.value
                  )
                }
              />
              {validationErrors["maxPower"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["maxPower"]}
                </p>
              )}
            </FormField>

            <FormField label="Max Torque" required>
              <PlaceholderInput
                name="maxTorque"
                placeholder="39 Nm @ 6500 rpm"
                value={formState.engineTransmission?.maxTorque || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "maxTorque",
                    e.target.value
                  )
                }
              />
              {validationErrors["maxTorque"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["maxTorque"]}
                </p>
              )}
            </FormField>

            <FormField label="No. of Cylinders">
              <PlaceholderInput
                name="cylinders"
                placeholder="1"
                type="number"
                value={formState.engineTransmission?.cylinders || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "cylinders",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Cooling System">
              <select
                name="coolingSystem"
                value={formState.engineTransmission?.coolingSystem || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "coolingSystem",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Cooling System</option>
                {COOLING_SYSTEMS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Starting">
              <select
                name="startingType"
                value={formState.engineTransmission?.startingType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "startingType",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Starting Type</option>
                {STARTING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Fuel Supply">
              <select
                name="fuelSupply"
                value={formState.engineTransmission?.fuelSupply || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "fuelSupply",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Fuel Supply</option>
                {FUEL_SUPPLY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
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
              {[
                "usbChargingPort",
                "cruiseControl",
                "bodyGraphics",
                "stepupSeat",
                "passengerFootrest",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name={feature}
                    checked={formState.features?.[feature] || false}
                    onChange={(e) =>
                      handleFieldChange("features", feature, e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">
                    {feature
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "featuresAndSafety":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Modified to handle riding modes as a string input */}
              {[
                "passSwitch",
                "tractionControl",
                "launchControl",
                "quickShifter",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.featuresAndSafety?.[feature] || false}
                    onChange={(e) =>
                      handleFieldChange(
                        "featuresAndSafety",
                        feature,
                        e.target.checked
                      )
                    }
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
                  onChange={(e) =>
                    handleFieldChange(
                      "featuresAndSafety",
                      "absType",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select ABS Type</option>
                  {["Single Channel", "Dual Channel", "None"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Riding Modes">
                <PlaceholderInput
                  name="ridingModes"
                  placeholder="Rain, Sport, Urban"
                  value={formState.featuresAndSafety?.ridingModes || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "featuresAndSafety",
                      "ridingModes",
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list of riding modes
                </p>
              </FormField>

              <FormField label="Display">
                <PlaceholderInput
                  name="displayType"
                  placeholder="5 Inch, TFT"
                  value={formState.featuresAndSafety?.displayType || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "featuresAndSafety",
                      "displayType",
                      e.target.value
                    )
                  }
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
                onChange={(e) =>
                  handleFieldChange(
                    "mileageAndPerformance",
                    "overallMileage",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Top Speed (kmph)">
              <PlaceholderInput
                name="topSpeed"
                placeholder="167"
                type="number"
                value={formState.mileageAndPerformance?.topSpeed || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "mileageAndPerformance",
                    "topSpeed",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="0-100 kmph">
              <PlaceholderInput
                name="acceleration"
                placeholder="4.2"
                type="number"
                step="0.1"
                value={formState.mileageAndPerformance?.acceleration || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "mileageAndPerformance",
                    "acceleration",
                    e.target.value
                  )
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Time in seconds
              </p>
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
                onChange={(e) =>
                  handleFieldChange(
                    "chassisAndSuspension",
                    "bodyType",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Body Type</option>
                {BODY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Frame Type">
              <PlaceholderInput
                name="frameType"
                placeholder="Split-Trellis frame"
                value={formState.chassisAndSuspension?.frameType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "chassisAndSuspension",
                    "frameType",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Front Suspension">
              <PlaceholderInput
                name="frontSuspension"
                placeholder="USD forks, 43mm diameter"
                value={formState.chassisAndSuspension?.frontSuspension || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "chassisAndSuspension",
                    "frontSuspension",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Rear Suspension">
              <PlaceholderInput
                name="rearSuspension"
                placeholder="Monoshock with preload adjustment"
                value={formState.chassisAndSuspension?.rearSuspension || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "chassisAndSuspension",
                    "rearSuspension",
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsAndCapacity",
                    "fuelCapacity",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Saddle Height (mm)">
              <PlaceholderInput
                name="saddleHeight"
                placeholder="820"
                type="number"
                value={formState.dimensionsAndCapacity?.saddleHeight || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsAndCapacity",
                    "saddleHeight",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Ground Clearance (mm)">
              <PlaceholderInput
                name="groundClearance"
                placeholder="183"
                type="number"
                value={formState.dimensionsAndCapacity?.groundClearance || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsAndCapacity",
                    "groundClearance",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Wheelbase (mm)">
              <PlaceholderInput
                name="wheelbase"
                placeholder="1354"
                type="number"
                value={formState.dimensionsAndCapacity?.wheelbase || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsAndCapacity",
                    "wheelbase",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Kerb Weight (kg)">
              <PlaceholderInput
                name="kerbWeight"
                placeholder="168.3"
                type="number"
                step="0.1"
                value={formState.dimensionsAndCapacity?.kerbWeight || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsAndCapacity",
                    "kerbWeight",
                    e.target.value
                  )
                }
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
                  onChange={(e) =>
                    handleFieldChange(
                      "electricals",
                      "headlightType",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Headlight Type</option>
                  {["LED", "Halogen", "Projector", "Bulb"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Taillight">
                <select
                  name="taillightType"
                  value={formState.electricals?.taillightType || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "electricals",
                      "taillightType",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Taillight Type</option>
                  {["LED", "Halogen", "Bulb"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="space-y-4">
              {[
                "ledTaillights",
                "lowBatteryIndicator",
                "lowFuelIndicator",
                "turnSignalLamp",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.electricals?.[feature] || false}
                    onChange={(e) =>
                      handleFieldChange(
                        "electricals",
                        feature,
                        e.target.checked
                      )
                    }
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
                onChange={(e) =>
                  handleFieldChange(
                    "tyresAndBrakes",
                    "frontBrakeType",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Brake Type</option>
                {["Disc", "Drum"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Rear Brake Type">
              <select
                name="rearBrakeType"
                value={formState.tyresAndBrakes?.rearBrakeType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "tyresAndBrakes",
                    "rearBrakeType",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Brake Type</option>
                {["Disc", "Drum"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Front Brake Diameter (mm)">
              <PlaceholderInput
                name="frontBrakeDiameter"
                placeholder="320"
                type="number"
                value={formState.tyresAndBrakes?.frontBrakeDiameter || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "tyresAndBrakes",
                    "frontBrakeDiameter",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Rear Brake Diameter (mm)">
              <PlaceholderInput
                name="rearBrakeDiameter"
                placeholder="240"
                type="number"
                value={formState.tyresAndBrakes?.rearBrakeDiameter || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "tyresAndBrakes",
                    "rearBrakeDiameter",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Front Tyre Size">
              <PlaceholderInput
                name="frontTyreSize"
                placeholder="110/70-17"
                value={formState.tyresAndBrakes?.frontTyreSize || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "tyresAndBrakes",
                    "frontTyreSize",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Rear Tyre Size">
              <PlaceholderInput
                name="rearTyreSize"
                placeholder="150/60-17"
                value={formState.tyresAndBrakes?.rearTyreSize || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "tyresAndBrakes",
                    "rearTyreSize",
                    e.target.value
                  )
                }
              />
            </FormField>
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formState.tyresAndBrakes?.tubelessTyre || false}
                  onChange={(e) =>
                    handleFieldChange(
                      "tyresAndBrakes",
                      "tubelessTyre",
                      e.target.checked
                    )
                  }
                  className="rounded border border-input bg-background text-primary"
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
            <FormField label="Motor Type">
              <PlaceholderInput
                name="motorType"
                placeholder="Permanent Magnet Synchronous"
                value={formState.motorAndBattery?.motorType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "motorAndBattery",
                    "motorType",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Motor Power (kW)">
              <PlaceholderInput
                name="motorPower"
                placeholder="5.5"
                type="number"
                step="0.1"
                value={formState.motorAndBattery?.motorPower || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "motorAndBattery",
                    "motorPower",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Battery Type">
              <PlaceholderInput
                name="batteryType"
                placeholder="Lithium-ion"
                value={formState.motorAndBattery?.batteryType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "motorAndBattery",
                    "batteryType",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Battery Capacity (kWh)">
              <PlaceholderInput
                name="batteryCapacity"
                placeholder="2.9"
                type="number"
                step="0.1"
                value={formState.motorAndBattery?.batteryCapacity || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "motorAndBattery",
                    "batteryCapacity",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Charging Time (hours)">
              <PlaceholderInput
                name="chargingTime"
                placeholder="4.5"
                type="number"
                step="0.1"
                value={formState.motorAndBattery?.chargingTime || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "motorAndBattery",
                    "chargingTime",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Range (km)">
              <PlaceholderInput
                name="range"
                placeholder="120"
                type="number"
                value={formState.motorAndBattery?.range || ""}
                onChange={(e) =>
                  handleFieldChange("motorAndBattery", "range", e.target.value)
                }
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
                onChange={(e) =>
                  handleFieldChange(
                    "underpinnings",
                    "frontFork",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Rear Monoshock">
              <PlaceholderInput
                name="rearMonoshock"
                placeholder="Monoshock with preload adjustment"
                value={formState.underpinnings?.rearMonoshock || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "underpinnings",
                    "rearMonoshock",
                    e.target.value
                  )
                }
              />
            </FormField>
            <FormField label="Swingarm">
              <PlaceholderInput
                name="swingarm"
                placeholder="Aluminum"
                value={formState.underpinnings?.swingarm || ""}
                onChange={(e) =>
                  handleFieldChange("underpinnings", "swingarm", e.target.value)
                }
              />
            </FormField>
            <FormField label="Chassis Type">
              <PlaceholderInput
                name="chassisType"
                placeholder="Trellis Frame"
                value={formState.underpinnings?.chassisType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "underpinnings",
                    "chassisType",
                    e.target.value
                  )
                }
              />
            </FormField>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">
              Please select a section to continue
            </p>
          </div>
        );
    }
  }, [
    activeSection,
    formState,
    handleFieldChange,
    validationErrors,
    mainImages,
    galleryImages,
    colorImages,
  ]);

  // In the Preview mode section, add similar preview support as in the car page
  const renderPreview = () => {
    if (previewMode) {
      return (
        <div className="w-full min-h-screen bg-background p-8">
          <div className="max-w-5xl mx-auto bg-card rounded-lg border p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Bike Preview
              </h1>
              <Button onClick={togglePreviewMode} variant="outline">
                Back to Edit
              </Button>
            </div>

            {/* BikePreview with properly passed color images */}
            <BikePreview
              data={formState}
              images={{
                main: mainImages[0] || "/placeholder.svg",
                gallery: galleryImages,
                colors: colorImages.length > 0 ? colorImages : [],
              }}
            />

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
                {activeSection ===
                  BIKE_SECTIONS[BIKE_SECTIONS.length - 1].id && (
                  <Button
                    type="button"
                    onClick={togglePreviewMode}
                    variant="secondary"
                  >
                    Preview
                  </Button>
                )}

                {activeSection ===
                BIKE_SECTIONS[BIKE_SECTIONS.length - 1].id ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Bike"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); // Explicitly prevent form submission
                      handleNextSection();
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
