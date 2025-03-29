// src/app/brands/vehicles/car/page.tsx
"use client";

// Add the import for vehicleService
import { vehicleService } from "@/services/vehicleService";
import { useRouter } from "next/navigation";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CarPreview } from "@/components/vehicle/CarPreview";
import { useCarStore, useCarForm } from "@/store/useCarStore"; // Fix: import useCarForm from useCarStore
import {
  PlaceholderInput,
  PlaceholderTextarea,
  SectionButton,
  FormField,
} from "@/components/form/FormComponents";
import { VehicleFormField } from "@/components/form/VehicleFormField";

// Fix the CAR_BRANDS array syntax
const CAR_BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata Motors",
  "Mahindra",
  "Kia",
  "Toyota",
  "Honda",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Volkswagen",
  "Skoda",
  "MG Motor",
  "Jeep",
  "Renault",
  "Nissan",
  "Citroen",
  "BYD",
  "Lexus",
  "Land Rover",
  "Jaguar",
  "Volvo",
  "Ferrari",
  "Porsche",
  "Lamborghini",
] as const;

// Update CAR_TYPES to remove Electric since it will be handled by the toggle
const CAR_TYPES = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Crossover",
  "MUV/MPV",
  "Coupe",
  "Convertible",
  "Wagon",
  "Pickup Truck",
  "Luxury",
  "Sports",
  "Hybrid",
  // "Electric" removed - now handled by toggle
] as const;

const CAR_SECTIONS = [
  { id: "basicInfo", label: "Basic Information" },
  { id: "images", label: "Images" },
  { id: "engineTransmission", label: "Engine & Transmission" },
  { id: "fuelPerformance", label: "Fuel & Performance" },
  { id: "dimensionsCapacity", label: "Dimensions & Capacity" },
  { id: "suspensionSteeringBrakes", label: "Suspension, Steering & Brakes" },
  { id: "comfortConvenience", label: "Comfort & Convenience" },
  { id: "interior", label: "Interior Features" },
  { id: "exterior", label: "Exterior Features" },
  { id: "safety", label: "Safety Features" },
  { id: "adasFeatures", label: "ADAS Features" },
  { id: "entertainment", label: "Entertainment & Communication" },
  { id: "internetFeatures", label: "Advance Internet Feature" },
];

// Car form placeholders
const CAR_PLACEHOLDERS = {
  name: "New Model",
  brand: "",
  variant: "Base",
  launchYear: new Date().getFullYear().toString(),
  priceOnroad: "1000000",
  priceExshowroom: "850000",
  pros: "Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride",
  cons: "Average Performance\nBasic Infotainment System\nLimited Color Options",
};

const PLACEHOLDER_VALUES = {
  engineTransmission: {
    engineType: "mHawk 130 CRDe",
    displacement: "2184",
    maxPower: "130.07bhp@3750rpm",
    maxTorque: "300Nm@1600-2800rpm",
    cylinders: "4",
    valvesPerCylinder: "4",
    gearbox: "6-Speed AT",
  },
  fuelPerformance: {
    fuelTankCapacity: "57",
    mileage: "15.6",
    highwayMileage: "18.2",
    topSpeed: "180",
    acceleration: "9.5",
    emissionNorm: "BS VI 2.0",
  },
  dimensionsCapacity: {
    length: "3985",
    width: "1820",
    height: "1855",
    wheelBase: "2450",
    groundClearance: "226",
    seatingCapacity: "5",
    doors: "4",
    bootSpace: "420",
    kerbWeight: "1650",
    approachAngle: "41.2",
    breakOverAngle: "26.2",
    departureAngle: "36",
  },
  suspensionSteeringBrakes: {
    frontSuspension: "Double wishbone suspension",
    rearSuspension: "Multi-link suspension",
    steeringGearType: "Rack & Pinion",
    frontWheelSize: "18",
    rearWheelSize: "18",
  },
  exterior: {
    tyreSize: "255/60 R19",
  },
  // Add more sections as needed// Add more sections as needed
};

export default function NewCarPage() {
  const { handleSubmit } = useCarForm();
  const router = useRouter();
  const {
    formState,
    mainImages,
    interiorImages,
    exteriorImages,
    colorImages,
    isSubmitting,
    error,
    updateFormSection,
    setMainImages,
    setInteriorImages,
    setExteriorImages,
    setColorImages,
    setIsSubmitting,
    setError,
    reset,
  } = useCarStore();

  const [activeSection, setActiveSection] = useState<string>(
    CAR_SECTIONS[0].id
  );
  const [sectionCompletionStatus, setSectionCompletionStatus] = useState<
    Record<string, boolean>
  >({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [previewMode, setPreviewMode] = useState(false);

  // Save form data helper
  const handleFieldChange = useCallback(
    (section: string, field: string, value: any) => {
      updateFormSection(section, { [field]: value });
    },
    [updateFormSection]
  );

  // Simplified validation functions
  const validateCurrentSection = useCallback(() => {
    // Always clear validation errors and return true
    setValidationErrors({});
    return true;
  }, []);

  // Simplified validation for required sections
  const validateRequiredSections = useCallback(() => {
    return true;
  }, []);

  // Update section completion status when section changes completion status when section changes
  useEffect(() => {
    // For images section, check if mainImages exist to mark completionainImages exist to mark completion
    if (activeSection === "images") {
      // Check if image section should be marked as completedrked as completed
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

    // For other sections, use the existing logicexisting logic
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
    // Validate current section before navigatingting
    const isValid = validateCurrentSection();
    if (isValid) {
      const currentIndex = CAR_SECTIONS.findIndex(
        (section) => section.id === activeSection
      );
      if (currentIndex < CAR_SECTIONS.length - 1) {
        setActiveSection(CAR_SECTIONS[currentIndex + 1].id);
      }
    } else {
      toast.error("Please complete all required fields before continuing");
    }
  }, [activeSection, validateCurrentSection]);

  const handlePreviousSection = useCallback(() => {
    const currentIndex = CAR_SECTIONS.findIndex(
      (section) => section.id === activeSection
    );
    if (currentIndex > 0) {
      setActiveSection(CAR_SECTIONS[currentIndex - 1].id);
    }
  }, [activeSection]);

  // Add a new function to apply placeholders when a tab is clickedlders when a tab is clicked
  const applyPlaceholders = useCallback(
    (section: string) => {
      if (PLACEHOLDER_VALUES[section]) {
        // Don't overwrite existing values, just set placeholderslaceholders
        const existingData = formState[section] || {};
        // We'll show placeholders but not actually change the form statethe form state
        console.log(`Applied placeholders for ${section}`);
      }
    },
    [formState]
  );

  // Modify the setActiveSection logic to apply placeholdersapply placeholders
  const handleSectionChange = useCallback(
    (sectionId: string) => {
      setActiveSection(sectionId);
      applyPlaceholders(sectionId);
    },
    [setActiveSection, applyPlaceholders]
  );

  // Form submission
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Preparing form data for submission...");

      // Prepare a clean copy of the form statee
      let cleanedFormState = { ...formState };

      // Only remove electric-specific fields if not an electric vehiclec vehicle
      if (formState.fuelPerformance?.fuelType !== "Electric") {
        console.log(
          "Non-electric vehicle detected, removing electric-specific fields"
        );
        // Create a clean version without electric fieldsric fields
        if (cleanedFormState.fuelPerformance) {
          const {
            batteryCapacity,
            chargingTimeDC,
            chargingTimeAC,
            chargingPort,
            chargingOptions,
            regenerativeBraking,
            regenerativeBrakingLevels,
            ...remainingFuelProps
          } = cleanedFormState.fuelPerformance;
          cleanedFormState = {
            ...cleanedFormState,
            fuelPerformance: remainingFuelProps,
          };
        }
      } else {
        console.log(
          "Electric vehicle detected, removing combustion-specific fields"
        );
        // For electric vehicles, remove combustion engine specific fieldsn engine specific fields
        if (cleanedFormState.engineTransmission) {
          const {
            engineType,
            displacement,
            maxPower,
            maxTorque,
            cylinders,
            valvesPerCylinder,
            gearbox,
            ...remainingEngineProps
          } = cleanedFormState.engineTransmission;
          cleanedFormState = {
            ...cleanedFormState,
            engineTransmission: remainingEngineProps,
          };
        }
        // Set fuel type to Electric if not already set
        if (!cleanedFormState.fuelPerformance?.fuelType) {
          cleanedFormState = {
            ...cleanedFormState,
            fuelPerformance: {
              ...cleanedFormState.fuelPerformance,
              fuelType: "Electric",
            },
          };
        }
      }

      // Prepare form data with cleaned stated state
      const formData = new FormData();
      formData.append("vehicleType", "cars");
      // Add form state as JSON with the fixed variant fieldd
      // Ensure required fields are set, especially variantare set, especially variant
      const updatedFormState = {
        ...cleanedFormState,
        basicInfo: {
          ...cleanedFormState.basicInfo,
          // Set variant to Base if not already set
          variant: cleanedFormState.basicInfo?.variant || "Base",
        },
      };

      // Add form state as JSON with the fixed variant field
      Object.entries(updatedFormState).forEach(([section, data]) => {
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
      interiorImages.forEach((img) => formData.append("interiorImages", img));
      exteriorImages.forEach((img) => formData.append("exteriorImages", img));

      // Submit form data
      await vehicleService.createVehicle(formData);
      toast.success(
        `Car "${formState.basicInfo?.name || "New Car"}" created successfully!`,
        {
          duration: 5000, // Show for 5 seconds
          icon: "🚗", // Add car icon for better visibility
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

  // Toggle preview mode
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

  // Add this helper function for navigation buttons before the rendergation buttons before the render
  const getNavigationButtons = () => {
    const isLastSection =
      activeSection === CAR_SECTIONS[CAR_SECTIONS.length - 1].id;

    // Update the Next button implementation to explicitly prevent form submissiontion to explicitly prevent form submission
    const nextButton = isLastSection ? (
      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={(e) => {
          if (!validateRequiredSections()) {
            e.preventDefault(); // Explicitly prevent default form submission
          }
        }}
      >
        {isSubmitting ? "Creating..." : "Create Car"}
      </Button>
    ) : (
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault(); // Explicitly prevent default form submission
          handleNextSection();
        }}
      >
        Next
      </Button>
    );

    const previewButton = isLastSection ? (
      <Button type="button" onClick={togglePreviewMode} variant="secondary">
        Preview
      </Button>
    ) : null;

    return (
      <div className="flex gap-2">
        {previewButton}
        {nextButton}
      </div>
    );
  };

  // Render section fields - use the existing renderSectionFields functionderSectionFields function
  const renderSectionFields = useCallback(() => {
    switch (activeSection) {
      case "basicInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VehicleFormField
              section="basicInfo"
              field="brand"
              label="Brand Name"
              type="select"
              options={CAR_BRANDS}
              required
            />

            <VehicleFormField
              section="basicInfo"
              field="name"
              label="Model Name"
              placeholder="New Model"
              required
            />

            <VehicleFormField
              section="basicInfo"
              field="variantName"
              label="Variant Name"
              placeholder="Variant Name"
            />

            <VehicleFormField
              section="basicInfo"
              field="variant"
              label="Variant Type"
              type="select"
              options={["Base", "Mid", "Top"]}
              required
            />

            {/* Add a small toggle for power type (Electric vs ICE) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Power Type</label>
              <div className="flex items-center space-x-2">
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary">
                  <input
                    type="checkbox"
                    className="peer absolute inset-0 opacity-0 cursor-pointer z-10"
                    checked={formState.fuelPerformance?.fuelType === "Electric"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Only update fuel type, don't modify car category
                        handleFieldChange(
                          "fuelPerformance",
                          "fuelType",
                          "Electric"
                        );
                      } else {
                        handleFieldChange("fuelPerformance", "fuelType", "");
                      }
                    }}
                  />
                  <span
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      formState.fuelPerformance?.fuelType === "Electric"
                        ? "translate-x-5"
                        : ""
                    }`}
                  />
                </div>
                <span className="text-sm">
                  {formState.fuelPerformance?.fuelType === "Electric"
                    ? "Electric"
                    : "Combustion"}
                </span>
              </div>
            </div>

            {/* Car category dropdown - keep all options available regardless of power type */}
            <VehicleFormField
              section="basicInfo"
              field="carType"
              label="Car Body Type"
              type="select"
              options={CAR_TYPES}
              value={formState.basicInfo?.carType || ""}
              onChange={(e) => {
                handleFieldChange("basicInfo", "carType", e.target.value);
              }}
            />

            <div className="space-y-2">
              <VehicleFormField
                section="basicInfo"
                field="priceExshowroom"
                label="Ex-Showroom Price (₹)"
                type="number"
                placeholder="850000"
                required
              />
              {validationErrors["priceExshowroom"] ? (
                <p className="text-xs text-destructive">
                  {validationErrors["priceExshowroom"]}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Ex-showroom price before taxes
                </p>
              )}
            </div>

            <div className="space-y-2">
              <VehicleFormField
                section="basicInfo"
                field="priceOnroad"
                label="On-Road Price (₹)"
                type="number"
                placeholder="1000000"
                required
              />
              {validationErrors["priceOnroad"] ? (
                <p className="text-xs text-destructive">
                  {validationErrors["priceOnroad"]}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  On-road price includes taxes, registration, and insurance
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <VehicleFormField
                section="basicInfo"
                field="pros"
                label="Pros"
                type="textarea"
                placeholder="Spacious Interior\nFuel Efficient\nAdvanced Safety Features\nComfortable Ride"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter each point on a new line
              </p>
            </div>

            <div className="md:col-span-2">
              <VehicleFormField
                section="basicInfo"
                field="cons"
                label="Cons"
                type="textarea"
                placeholder="Average Performance\nBasic Infotainment System\nLimited Color Options"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter each point on a new line
              </p>
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
              <FormField label="Interior Gallery">
                <MultipleImageUpload
                  images={interiorImages}
                  onChange={setInteriorImages}
                  maxFiles={30}
                  label="Interior Images"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload up to 30 images showcasing the interior
                </p>
              </FormField>
            </div>

            <div>
              <FormField label="Exterior Gallery">
                <MultipleImageUpload
                  images={exteriorImages}
                  onChange={setExteriorImages}
                  maxFiles={30}
                  label="Exterior Images (Optional)"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload up to 30 images showcasing the exterior
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
                placeholder="mHawk 130 CRDe"
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
                placeholder="2184"
                type="number"
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
                placeholder="130.07bhp@3750rpm"
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
                placeholder="300Nm@1600-2800rpm"
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

            {/* Only show cylinder-related fields and gearbox for non-electric vehicles */}
            {formState.basicInfo?.carType !== "Electric" && (
              <>
                <FormField label="Number of Cylinders">
                  <PlaceholderInput
                    name="cylinders"
                    placeholder="4"
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

                <FormField label="Valves Per Cylinder">
                  <PlaceholderInput
                    name="valvesPerCylinder"
                    placeholder="4"
                    type="number"
                    value={
                      formState.engineTransmission?.valvesPerCylinder || ""
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "engineTransmission",
                        "valvesPerCylinder",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Gearbox">
                  <PlaceholderInput
                    name="gearbox"
                    placeholder="6-Speed AT"
                    value={formState.engineTransmission?.gearbox || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "engineTransmission",
                        "gearbox",
                        e.target.value
                      )
                    }
                  />
                </FormField>
              </>
            )}

            <FormField label="Turbo Charger">
              <select
                name="turboCharger"
                value={formState.engineTransmission?.turboCharger || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "turboCharger",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormField>

            <FormField label="Transmission Type">
              <select
                name="transmissionType"
                value={formState.engineTransmission?.transmissionType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "engineTransmission",
                    "transmissionType",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Transmission</option>
                {["Automatic", "Manual", "CVT", "DCT", "AMT"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            {formState.basicInfo?.carType !== "Electric" && (
              <FormField label="Drive Type">
                <select
                  name="driveType"
                  value={formState.engineTransmission?.driveType || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "engineTransmission",
                      "driveType",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Drive Type</option>
                  {["2WD", "4WD", "FWD"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
          </div>
        );

      case "fuelPerformance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Fuel Type" required>
              <select
                name="fuelType"
                value={formState.fuelPerformance?.fuelType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "fuelPerformance",
                    "fuelType",
                    e.target.value
                  )
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                disabled={formState.basicInfo?.carType === "Electric"}
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
                <option value="LPG">LPG</option>
              </select>
              {validationErrors["fuelType"] && (
                <p className="text-xs text-destructive mt-1">
                  {validationErrors["fuelType"]}
                </p>
              )}
              {formState.basicInfo?.carType === "Electric" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Fuel type is set to Electric based on your car type selection
                </p>
              )}
            </FormField>

            {/* Display fields based on fuel type */}
            {formState.fuelPerformance?.fuelType !== "Electric" && (
              <>
                <FormField label="Fuel Tank Capacity (Litres)">
                  <PlaceholderInput
                    name="fuelTankCapacity"
                    placeholder="57"
                    type="number"
                    value={formState.fuelPerformance?.fuelTankCapacity || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "fuelTankCapacity",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Mileage (kmpl)">
                  <PlaceholderInput
                    name="mileage"
                    placeholder="15.6"
                    type="text"
                    value={formState.fuelPerformance?.mileage || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "mileage",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Highway Mileage (kmpl)">
                  <PlaceholderInput
                    name="highwayMileage"
                    placeholder="18.2"
                    type="text"
                    value={formState.fuelPerformance?.highwayMileage || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "highwayMileage",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Emission Norm Compliance">
                  <PlaceholderInput
                    name="emissionNorm"
                    placeholder="BS VI 2.0"
                    value={formState.fuelPerformance?.emissionNorm || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "emissionNorm",
                        e.target.value
                      )
                    }
                  />
                </FormField>
              </>
            )}

            <FormField label="Top Speed (kmph)">
              <PlaceholderInput
                name="topSpeed"
                placeholder="180"
                type="number"
                value={formState.fuelPerformance?.topSpeed || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "fuelPerformance",
                    "topSpeed",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Acceleration (0-100 kmph in sec)">
              <PlaceholderInput
                name="acceleration"
                placeholder="9.5"
                type="number"
                step="0.1"
                value={formState.fuelPerformance?.acceleration || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "fuelPerformance",
                    "acceleration",
                    e.target.value
                  )
                }
              />
            </FormField>

            {/* Electric vehicle specific fields */}
            {formState.fuelPerformance?.fuelType === "Electric" && (
              <>
                <FormField label="Range (km)">
                  <PlaceholderInput
                    name="electricRange"
                    placeholder="557 - 683"
                    value={formState.fuelPerformance?.electricRange || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "electricRange",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Battery Capacity (kWh)">
                  <PlaceholderInput
                    name="batteryCapacity"
                    placeholder="59 - 79"
                    value={formState.fuelPerformance?.batteryCapacity || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "batteryCapacity",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Charging Time DC">
                  <PlaceholderInput
                    name="chargingTimeDC"
                    placeholder="20Min with 180 kW DC"
                    value={formState.fuelPerformance?.chargingTimeDC || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "chargingTimeDC",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Charging Time AC">
                  <PlaceholderInput
                    name="chargingTimeAC"
                    placeholder="8 / 11.7 h (11.2 kW / 7.2 kW Charger)"
                    value={formState.fuelPerformance?.chargingTimeAC || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "chargingTimeAC",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Charging Port">
                  <PlaceholderInput
                    name="chargingPort"
                    placeholder="CCS-II"
                    value={formState.fuelPerformance?.chargingPort || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "chargingPort",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Charging Options">
                  <PlaceholderInput
                    name="chargingOptions"
                    placeholder="13A (upto 3.2kW) | 7.2kW | 11.2kW | 180 kW DC"
                    value={formState.fuelPerformance?.chargingOptions || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "chargingOptions",
                        e.target.value
                      )
                    }
                  />
                </FormField>

                <FormField label="Regenerative Braking">
                  <select
                    name="regenerativeBraking"
                    value={formState.fuelPerformance?.regenerativeBraking || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "regenerativeBraking",
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </FormField>

                <FormField label="Regenerative Braking Levels">
                  <PlaceholderInput
                    name="regenerativeBrakingLevels"
                    placeholder="4"
                    type="number"
                    value={
                      formState.fuelPerformance?.regenerativeBrakingLevels || ""
                    }
                    onChange={(e) =>
                      handleFieldChange(
                        "fuelPerformance",
                        "regenerativeBrakingLevels",
                        e.target.value
                      )
                    }
                  />
                </FormField>
              </>
            )}
          </div>
        );

      case "dimensionsCapacity":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Length (mm)">
              <PlaceholderInput
                name="length"
                placeholder="3985"
                type="number"
                value={formState.dimensionsCapacity?.length || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "length",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Width (mm)">
              <PlaceholderInput
                name="width"
                placeholder="1820"
                type="number"
                value={formState.dimensionsCapacity?.width || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "width",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Height (mm)">
              <PlaceholderInput
                name="height"
                placeholder="1855"
                type="number"
                value={formState.dimensionsCapacity?.height || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "height",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Wheelbase (mm)">
              <PlaceholderInput
                name="wheelBase"
                placeholder="2450"
                type="number"
                value={formState.dimensionsCapacity?.wheelBase || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "wheelBase",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Ground Clearance (mm)">
              <PlaceholderInput
                name="groundClearance"
                placeholder="226"
                type="number"
                value={formState.dimensionsCapacity?.groundClearance || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "groundClearance",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Seating Capacity">
              <PlaceholderInput
                name="seatingCapacity"
                placeholder="5"
                type="number"
                value={formState.dimensionsCapacity?.seatingCapacity || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "seatingCapacity",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="No. of Doors">
              <PlaceholderInput
                name="doors"
                placeholder="3"
                type="number"
                value={formState.dimensionsCapacity?.doors || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "doors",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Boot Space (Litres)">
              <PlaceholderInput
                name="bootSpace"
                placeholder="420"
                type="number"
                value={formState.dimensionsCapacity?.bootSpace || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "bootSpace",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Kerb Weight (kg)">
              <PlaceholderInput
                name="kerbWeight"
                placeholder="1650"
                type="number"
                value={formState.dimensionsCapacity?.kerbWeight || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "kerbWeight",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Approach Angle (degrees)">
              <PlaceholderInput
                name="approachAngle"
                placeholder="41.2"
                type="number"
                step="0.1"
                value={formState.dimensionsCapacity?.approachAngle || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "approachAngle",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Break-over Angle (degrees)">
              <PlaceholderInput
                name="breakOverAngle"
                placeholder="26.2"
                type="number"
                step="0.1"
                value={formState.dimensionsCapacity?.breakOverAngle || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "breakOverAngle",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Departure Angle (degrees)">
              <PlaceholderInput
                name="departureAngle"
                placeholder="36"
                type="number"
                step="0.1"
                value={formState.dimensionsCapacity?.departureAngle || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "dimensionsCapacity",
                    "departureAngle",
                    e.target.value
                  )
                }
              />
            </FormField>
          </div>
        );

      case "suspensionSteeringBrakes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Front Suspension">
              <PlaceholderInput
                name="frontSuspension"
                placeholder="Double wishbone suspension"
                value={
                  formState.suspensionSteeringBrakes?.frontSuspension || ""
                }
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "frontSuspension",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Rear Suspension">
              <PlaceholderInput
                name="rearSuspension"
                placeholder="Multi-link suspension"
                value={formState.suspensionSteeringBrakes?.rearSuspension || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "rearSuspension",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Steering Type">
              <PlaceholderInput
                name="steeringType"
                placeholder="Electric Power Steering"
                value={formState.suspensionSteeringBrakes?.steeringType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "steeringType",
                    e.target.value
                  )
                }
              />
            </FormField>

            {/* Add Turning Radius field */}
            <FormField label="Turning Radius (m)">
              <PlaceholderInput
                name="turningRadius"
                placeholder="5.2"
                type="number"
                step="0.1"
                value={formState.suspensionSteeringBrakes?.turningRadius || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "turningRadius",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Steering Column">
              <PlaceholderInput
                name="steeringColumn"
                placeholder="Tilt & Telescopic"
                value={formState.suspensionSteeringBrakes?.steeringColumn || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "steeringColumn",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Steering Gear Type">
              <PlaceholderInput
                name="steeringGearType"
                placeholder="Rack & Pinion"
                value={
                  formState.suspensionSteeringBrakes?.steeringGearType || ""
                }
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "steeringGearType",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Turning Radius (m)">
              <PlaceholderInput
                name="turningRadius"
                placeholder="5.2"
                type="number"
                step="0.1"
                value={formState.suspensionSteeringBrakes?.turningRadius || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "turningRadius",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Front Brake Type">
              <PlaceholderInput
                name="frontBrakeType"
                placeholder="Disc"
                value={formState.suspensionSteeringBrakes?.frontBrakeType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "frontBrakeType",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Rear Brake Type">
              <PlaceholderInput
                name="rearBrakeType"
                placeholder="Disc"
                value={formState.suspensionSteeringBrakes?.rearBrakeType || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "rearBrakeType",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Front Wheel Size">
              <PlaceholderInput
                name="frontWheelSize"
                placeholder="18"
                type="number"
                value={formState.suspensionSteeringBrakes?.frontWheelSize || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "frontWheelSize",
                    e.target.value
                  )
                }
              />
            </FormField>

            <FormField label="Rear Wheel Size">
              <PlaceholderInput
                name="rearWheelSize"
                placeholder="18"
                type="number"
                value={formState.suspensionSteeringBrakes?.rearWheelSize || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "suspensionSteeringBrakes",
                    "rearWheelSize",
                    e.target.value
                  )
                }
              />
            </FormField>
          </div>
        );

      case "comfortConvenience":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "powerSteering",
                "airConditioner",
                "heater",
                "adjustableSteering",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.comfortConvenience?.[feature] || false}
                    onChange={(e) =>
                      handleFieldChange(
                        "comfortConvenience",
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
            <div className="space-y-6">
              <FormField label="Foldable Rear Seat">
                <PlaceholderInput
                  name="foldableRearSeat"
                  placeholder="50:50 Split"
                  value={formState.comfortConvenience?.foldableRearSeat || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "comfortConvenience",
                      "foldableRearSeat",
                      e.target.value
                    )
                  }
                />
              </FormField>
              <FormField label="Parking Sensors">
                <select
                  name="parkingSensors"
                  value={formState.comfortConvenience?.parkingSensors || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "comfortConvenience",
                      "parkingSensors",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Location</option>
                  <option value="Front">Front</option>
                  <option value="Rear">Rear</option>
                  <option value="Front & Rear">Front & Rear</option>
                </select>
              </FormField>

              <FormField label="USB Charger">
                <select
                  name="usbCharger"
                  value={formState.comfortConvenience?.usbCharger || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "comfortConvenience",
                      "usbCharger",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  <option value="">Select Location</option>
                  <option value="Front">Front</option>
                  <option value="Rear">Rear</option>
                  <option value="Front & Rear">Front & Rear</option>
                </select>
              </FormField>
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
                  checked={formState.interior?.tachometer || false}
                  onChange={(e) =>
                    handleFieldChange(
                      "interior",
                      "tachometer",
                      e.target.checked
                    )
                  }
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
                  checked={formState.interior?.gloveBox || false}
                  onChange={(e) =>
                    handleFieldChange("interior", "gloveBox", e.target.checked)
                  }
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
                  checked={formState.interior?.digitalCluster || false}
                  onChange={(e) =>
                    handleFieldChange(
                      "interior",
                      "digitalCluster",
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm font-medium text-foreground">
                  Digital Cluster
                </span>
              </label>
            </div>
            <div>
              <FormField label="Upholstery">
                <select
                  name="upholstery"
                  value={formState.interior?.upholstery || "Leatherette"}
                  onChange={(e) => {
                    handleFieldChange("interior", "upholstery", e.target.value);
                    // Log to confirm the value is being updated
                    console.log("Updated upholstery to:", e.target.value);
                  }}
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {["Fabric", "Leatherette", "Leather"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Additional Interior Features">
                <PlaceholderTextarea
                  name="additionalInteriorFeatures"
                  placeholder="Tablet Storage Space in Glove Box, Collapsible Grab Handles, Charcoal Black Interiors..."
                  value={formState.interior?.additionalInteriorFeatures || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "interior",
                      "additionalInteriorFeatures",
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </FormField>
            </div>
            <div>
              <FormField label="Digital Cluster Size (inch)">
                <PlaceholderInput
                  name="digitalClusterSize"
                  placeholder="7"
                  type="number"
                  step="0.1"
                  value={formState.interior?.digitalClusterSize || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "interior",
                      "digitalClusterSize",
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can enter decimal values (e.g. 7.5, 10.2)
                </p>
              </FormField>
            </div>
          </div>
        );

      case "exterior":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boolean checkbox fields */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium mb-3">Exterior Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: "adjustableHeadlamps", label: "Adjustable Headlamps" },
                  { id: "rearWindowWiper", label: "Rear Window Wiper" },
                  { id: "rearWindowDefogger", label: "Rear Window Defogger" },
                  { id: "rearWindowWasher", label: "Rear Window Washer" },
                  { id: "integratedAntenna", label: "Integrated Antenna" },
                  { id: "ledDRLs", label: "LED DRLs" },
                  { id: "ledTaillights", label: "LED Taillights" },
                  { id: "poweredFoldingORVM", label: "Powered & Folding ORVM" },
                  { id: "halogenHeadlamps", label: "Halogen Headlamps" },
                ].map((item) => (
                  <label key={item.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formState.exterior?.[item.id] || false}
                      onChange={(e) =>
                        handleFieldChange("exterior", item.id, e.target.checked)
                      }
                      className="rounded border-input bg-background text-primary h-4 w-4"
                    />
                    <span className="text-sm text-foreground">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Non-boolean fields */}
            <FormField label="Fog Lights">
              <PlaceholderInput
                name="fogLights"
                placeholder="Front & Rear"
                value={formState.exterior?.fogLights || ""}
                onChange={(e) =>
                  handleFieldChange("exterior", "fogLights", e.target.value)
                }
              />
            </FormField>

            <FormField label="LED Fog Lamps">
              <PlaceholderInput
                name="ledFogLamps"
                placeholder="Front"
                value={formState.exterior?.ledFogLamps || ""}
                onChange={(e) =>
                  handleFieldChange("exterior", "ledFogLamps", e.target.value)
                }
              />
            </FormField>

            <FormField label="Sunroof Type">
              <select
                name="sunroofType"
                value={formState.exterior?.sunroofType || ""}
                onChange={(e) =>
                  handleFieldChange("exterior", "sunroofType", e.target.value)
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Type</option>
                {["Panoramic", "Single-Pane", "Pop-up", "None"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Tyre Size">
              <PlaceholderInput
                name="tyreSize"
                placeholder="255/60 R19"
                value={formState.exterior?.tyreSize || ""}
                onChange={(e) =>
                  handleFieldChange("exterior", "tyreSize", e.target.value)
                }
              />
            </FormField>

            <FormField label="Tyre Type">
              <select
                name="tyreType"
                value={formState.exterior?.tyreType || ""}
                onChange={(e) =>
                  handleFieldChange("exterior", "tyreType", e.target.value)
                }
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Type</option>
                {["Radial", "Tubeless", "Tube", "Run-flat"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Additional Features - Full width textarea */}
            <div className="md:col-span-2">
              <FormField label="Additional Features">
                <PlaceholderTextarea
                  name="additionalExteriorFeatures"
                  placeholder="Roof Rails, Rear Spoiler, Alloy Wheels, Mud Flaps, Side Stepper, Body Graphics, Chrome Grille, Roof Antenna, Rear Window Sunshade, Front Skid Plate"
                  value={formState.exterior?.additionalExteriorFeatures || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "exterior",
                      "additionalExteriorFeatures",
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </div>
        );

      case "safety":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "antiLockBrakingSystem", // Simplified property names without special characters
                "brakeAssist",
                "centralLocking",
                "driverAirbag",
                "childSafetyLocks",
                "passengerAirbag",
                "dayNightRearViewMirror",
                "electronicBrakeforceDistribution",
                "seatBeltWarning",
                "tyrePressureMonitoringSystem",
                "engineImmobilizer",
                "electronicStabilityControl",
                "speedSensingAutoDoorLock",
                "isofixChildSeatMounts",
                "hillDescentControl",
                "hillAssist",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.safety?.[feature] || false}
                    onChange={(e) =>
                      handleFieldChange("safety", feature, e.target.checked)
                    }
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-6">
              <FormField label="No. of Airbags">
                <PlaceholderInput
                  name="airbags"
                  type="number"
                  placeholder="2"
                  value={formState.safety?.airbags || ""}
                  onChange={(e) =>
                    handleFieldChange("safety", "airbags", e.target.value)
                  }
                />
              </FormField>
              <FormField label="Global NCAP Safety Rating">
                <select
                  name="bharatNcapSafetyRating"
                  value={formState.safety?.bharatNcapRating || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "safety",
                      "bharatNcapRating",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {[
                    "No Rating",
                    "1 Star",
                    "2 Star",
                    "3 Star",
                    "4 Star",
                    "5 Star",
                    "Not Rated",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Global NCAP Child Safety Rating">
                <select
                  name="bharatNcapChildSafetyRating"
                  value={formState.safety?.bharatNcapChildSafetyRating || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "safety",
                      "bharatNcapChildSafetyRating",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {[
                    "No Rating",
                    "1 Star",
                    "2 Star",
                    "3 Star",
                    "4 Star",
                    "5 Star",
                    "Not Rated",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        );

      case "adasFeatures":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "forwardCollisionWarning",
                "automaticEmergencyBraking",
                "trafficSignRecognition",
                "laneDepartureWarning",
                "laneKeepAssist",
                "adaptiveCruiseControl",
                "adaptiveHighBeamAssist",
                "blindSpotDetection",
                "rearCrossTrafficAlert",
                "driverAttentionMonitor",
                "parkingAssist",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.adasFeatures?.[feature] || false}
                    onChange={(e) =>
                      handleFieldChange(
                        "adasFeatures",
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
              <FormField label="Additional ADAS Features">
                <PlaceholderTextarea
                  name="additionalADASFeatures"
                  placeholder="Enter additional ADAS features..."
                  value={formState.adasFeatures?.additionalADASFeatures || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "adasFeatures",
                      "additionalADASFeatures",
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </FormField>
              <FormField label="ADAS System Name">
                <PlaceholderInput
                  name="adasSystemName"
                  placeholder="e.g. Honda Sensing, Nissan ProPILOT"
                  value={formState.adasFeatures?.adasSystemName || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "adasFeatures",
                      "adasSystemName",
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </div>
        );

      case "entertainment":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "Radio",
                "Wireless Phone Charger",
                "Integrated 2DIN Audio",
                "Bluetooth Connectivity",
                "Touchscreen",
                "USB Ports",
                "Apple Car Play",
                "Android Auto",
                "Connected Apps",
                "DTS Sound Staging",
                "Tweeters",
                "Subwoofer",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.entertainment?.[feature] || false}
                    onChange={(e) => {
                      // Use the exact property name from the schema
                      handleFieldChange(
                        "entertainment",
                        feature, // Using exact key name from the schema
                        e.target.checked
                      );
                    }}
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              {/* Rest of the entertainment section remains unchanged */}
              <FormField label="Touchscreen Size (inch)">
                <PlaceholderInput
                  name="touchscreenSize"
                  placeholder="10.25"
                  type="number"
                  step="0.1"
                  value={formState.entertainment?.touchscreenSize || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "entertainment",
                      "touchscreenSize",
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can enter decimal values (e.g. 7.5, 10.25)
                </p>
              </FormField>
              <FormField label="No. of Speakers">
                <PlaceholderInput
                  name="speakers"
                  placeholder="4"
                  type="number"
                  value={formState.entertainment?.speakers || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "entertainment",
                      "speakers",
                      e.target.value
                    )
                  }
                />
              </FormField>
              <FormField label="Speaker Location">
                <select
                  name="speakerLocation"
                  value={formState.entertainment?.speakerLocation || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "entertainment",
                      "speakerLocation",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
                >
                  {["No Speaker", "Front", "Rear", "Front & Rear"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Additional Entertainment Features">
                <PlaceholderTextarea
                  name="additionalEntertainmentFeatures"
                  placeholder="Connected apps, 83 connected features, DTS sound staging..."
                  value={
                    formState.entertainment?.additionalEntertainmentFeatures ||
                    ""
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "entertainment",
                      "additionalEntertainmentFeatures",
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each feature on a new line or separated by commas
                </p>
              </FormField>
            </div>
          </div>
        );

      case "internetFeatures":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "eCallICall",
                "remoteVehicleStart",
                "sosButton",
                "remoteACControl",
                "geoFenceAlert",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.internetFeatures?.[feature] || false}
                    onChange={(e) => {
                      // Use the exact property name as defined in the schema
                      handleFieldChange(
                        "internetFeatures",
                        feature, // Using exact key name from the schema
                        e.target.checked
                      );
                    }}
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature === "eCallICall"
                      ? "E-Call & I-Call"
                      : feature === "remoteVehicleStart"
                      ? "Remote Vehicle Ignition Start/Stop"
                      : feature === "sosButton"
                      ? "SOS Button"
                      : feature === "remoteACControl"
                      ? "Remote AC On/Off"
                      : feature === "geoFenceAlert"
                      ? "Geo-fence Alert"
                      : feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              {/* Rest of the internetFeatures section remains unchanged */}
              <FormField label="Connected Car App">
                <PlaceholderInput
                  name="connectedCarApp"
                  placeholder="e.g. Mahindra AdrenoX, Kia UVO"
                  value={formState.internetFeatures?.connectedCarApp || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "internetFeatures",
                      "connectedCarApp",
                      e.target.value
                    )
                  }
                />
              </FormField>
              <FormField label="Additional Connected Features">
                <PlaceholderTextarea
                  name="additionalConnectedFeatures"
                  placeholder="Connected app services, OTA updates, voice assistant..."
                  value={
                    formState.internetFeatures?.additionalConnectedFeatures ||
                    ""
                  }
                  onChange={(e) =>
                    handleFieldChange(
                      "internetFeatures",
                      "additionalConnectedFeatures",
                      e.target.value
                    )
                  }
                />
              </FormField>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [
    activeSection,
    formState,
    handleFieldChange,
    validationErrors,
    mainImages,
    interiorImages,
    exteriorImages,
    colorImages,
  ]);

  // First, add a useEffect to automatically set fuel type when car type changes
  useEffect(() => {
    // When car type is set to "Electric", automatically set fuel type to "Electric"
    if (formState.basicInfo?.carType === "Electric") {
      updateFormSection("fuelPerformance", { fuelType: "Electric" });
    }
  }, [formState.basicInfo?.carType, updateFormSection]);

  // Update the useEffect that watches for electric vehicle type changes
  useEffect(() => {
    // When car type is set to "Electric", automatically set fuel type to "Electric"
    // and set gearbox to "Single Speed" for electric vehicles
    if (formState.fuelPerformance?.fuelType === "Electric") {
      // Set fuel type to Electric if not already set
      updateFormSection("fuelPerformance", { fuelType: "Electric" });

      // Set transmission type and gearbox to Single Speed for electric vehicles
      updateFormSection("engineTransmission", {
        gearbox: "Single Speed",
        transmissionType: "Automatic",
      });
    }
  }, [formState.fuelPerformance?.fuelType, updateFormSection]);

  // In the useEffect section, add a new effect to initialize the upholstery value
  useEffect(() => {
    // Initialize default upholstery value if not already set
    if (!formState.interior?.upholstery) {
      updateFormSection("interior", { upholstery: "Leatherette" });
    }
  }, [formState.interior?.upholstery, updateFormSection]);

  // Add navigation warning to prevent accidental data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if user has started entering data
      const hasEnteredData =
        Object.keys(formState).length > 0 ||
        mainImages.length > 0 ||
        interiorImages.length > 0 ||
        exteriorImages.length > 0 ||
        colorImages.length > 0;

      if (hasEnteredData) {
        // Standard way of showing a confirmation dialog
        e.preventDefault();
        e.returnValue = ""; // Required for browser compatibility
        return ""; // Return value is shown in some browsers
      }
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formState, mainImages, interiorImages, exteriorImages, colorImages]);

  // Preview mode
  if (previewMode) {
    return (
      <div className="w-full min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto bg-card rounded-lg border p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Car Preview</h1>
            <Button onClick={togglePreviewMode} variant="outline">
              Back to Edit
            </Button>
          </div>
          <CarPreview
            onBackToEdit={togglePreviewMode}
            onSubmit={() => handleSubmit(new Event("submit") as any)}
          />
        </div>
      </div>
    );
  }

  // Regular form view
  return (
    <div className="w-full min-h-screen bg-background p-8">
      <form
        onSubmit={(e) => {
          // Only submit form on explicit submit button click
          if (activeSection !== CAR_SECTIONS[CAR_SECTIONS.length - 1].id) {
            e.preventDefault();
          }
          return handleSubmitForm(e);
        }}
      >
        <div className="max-w-full mx-auto">
          <div className="flex gap-6">
            {/* Side Panel */}
            <div className="w-64 flex-shrink-0 bg-card p-4 rounded-lg border">
              <nav className="space-y-2 sticky top-4">
                {CAR_SECTIONS.map((section) => (
                  <SectionButton
                    key={section.id}
                    section={section}
                    active={activeSection}
                    completed={sectionCompletionStatus[section.id]}
                    onClick={handleSectionChange}
                  />
                ))}
              </nav>
            </div>
            {/* Main Form Content */}
            <div className="flex-1 bg-card p-6 rounded-lg border">
              <h1 className="text-2xl font-bold text-foreground mb-6">
                Add New Car
              </h1>
              <div className="space-y-6">{renderSectionFields()}</div>
              <div className="mt-6 flex justify-between gap-4">
                <Button
                  type="button"
                  onClick={handlePreviousSection}
                  disabled={activeSection === CAR_SECTIONS[0].id}
                  variant="outline"
                >
                  Previous
                </Button>
                {getNavigationButtons()}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
