// src/app/brands/vehicles/car/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { MultipleImageUpload } from "@/components/ui/MultipleImageUpload";
import { useState, useCallback, useEffect } from "react";
import { vehicleService } from "@/services/vehicleService";
import { toast } from "react-hot-toast";
import { useAuthCheck } from "@/lib/authCheck";
import { Button } from "@/components/ui/button";
import { CarPreview } from "@/components/vehicle/CarPreview";
import { useVehicleStore, CAR_PLACEHOLDERS } from "@/store/vehicleStore";
import { validateSection, validatePrices } from "@/validation/formValidation";
import { PlaceholderInput, PlaceholderTextarea, SectionButton, FormField, FormSection } from "@/components/form/FormComponents";
import { CheckCircle2 } from "lucide-react";

// Car-specific constants
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
  { id: "entertainment", label: "Entertainment" },
];

export default function NewCarPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuthCheck();
  const { 
    vehicleType,
    formState,
    mainImages, 
    interiorImages,
    exteriorImages,
    colorImages,
    setVehicleType,
    setMainImages,
    setInteriorImages,
    setExteriorImages,
    setColorImages,
    updateFormSection,
    reset
  } = useVehicleStore();

  const [activeSection, setActiveSection] = useState<string>(CAR_SECTIONS[0].id);
  const [sectionCompletionStatus, setSectionCompletionStatus] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  // Setup initial vehicle type
  useEffect(() => {
    setVehicleType('cars');
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
    
    // Handle other sections as before
    const { isValid, errors } = validateSection(activeSection, formState[activeSection]);
    
    // Special case for price validation in basicInfo section
    if (activeSection === "basicInfo" && isValid && formState.basicInfo?.priceExshowroom && formState.basicInfo?.priceOnroad) {
      const priceCheck = validatePrices(
        formState.basicInfo.priceExshowroom, 
        formState.basicInfo.priceOnroad
      );
      
      if (!priceCheck.isValid) {
        setValidationErrors({
          // Use a new object instead of spreading existing errors to avoid duplicates
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
      const currentIndex = CAR_SECTIONS.findIndex(section => section.id === activeSection);
      if (currentIndex < CAR_SECTIONS.length - 1) {
        setActiveSection(CAR_SECTIONS[currentIndex + 1].id);
      }
    } else {
      toast.error("Please fix the errors in this section before continuing");
    }
  }, [activeSection, validateCurrentSection]);

  const handlePreviousSection = useCallback(() => {
    const currentIndex = CAR_SECTIONS.findIndex(section => section.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(CAR_SECTIONS[currentIndex - 1].id);
    }
  }, [activeSection]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Validate all required sections
      let allValid = true;
      const requiredSections = ["basicInfo", "engineTransmission", "fuelPerformance"];
      
      for (const section of requiredSections) {
        const { isValid } = validateSection(section, formState[section]);
        if (!isValid) {
          allValid = false;
          setActiveSection(section);
          toast.error(`Please complete the ${section} section`);
          break;
        }
      }
      
      if (!allValid) {
        throw new Error("Please fill all required fields");
      }
      
      // Validate price relationship
      const priceCheck = validatePrices(
        formState.basicInfo?.priceExshowroom,
        formState.basicInfo?.priceOnroad
      );
      
      if (!priceCheck.isValid) {
        setActiveSection("basicInfo");
        throw new Error(priceCheck.error);
      }
      
      // Prepare form data
      const formData = new FormData();
      formData.append("vehicleType", "cars");
      
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
      interiorImages.forEach((img) => formData.append("interiorImages", img));
      exteriorImages.forEach((img) => formData.append("exteriorImages", img));
      
      // Submit data
      await vehicleService.createVehicle(formData);
      toast.success("Car created successfully");
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

  // Render section fields - use the existing renderSectionFields function with updates
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
                {CAR_BRANDS.map((brand) => (
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
                placeholder={CAR_PLACEHOLDERS.name}
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
                placeholder={CAR_PLACEHOLDERS.priceExshowroom}
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
                placeholder={CAR_PLACEHOLDERS.priceOnroad}
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
                  placeholder={CAR_PLACEHOLDERS.pros}
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
                  placeholder={CAR_PLACEHOLDERS.cons}
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
              <FormField label="Interior Gallery">
                <MultipleImageUpload
                  images={interiorImages}
                  onChange={setInteriorImages}
                  maxFiles={8}
                  label="Interior Images"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                  defaultSelected={true} // Set default selected to true
                />
                <p className="text-xs text-muted-foreground mt-1">Upload up to 8 images showcasing the interior</p>
              </FormField>
            </div>

            <div>
              <FormField label="Exterior Gallery">
                <MultipleImageUpload
                  images={exteriorImages}
                  onChange={setExteriorImages}
                  maxFiles={8}
                  label="Exterior Images (Optional)"
                  usePlaceholder={true}
                  acceptedFileTypes="image/png, image/jpeg, image/webp"
                />
                <p className="text-xs text-muted-foreground mt-1">Upload up to 8 images showcasing the exterior</p>
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
                placeholder="mHawk 130 CRDe"
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
                placeholder="2184"
                type="number"
                value={formState.engineTransmission?.displacement || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "displacement", e.target.value)}
              />
            </FormField>

            <FormField label="Max Power" required>
              <PlaceholderInput
                name="maxPower"
                placeholder="130.07bhp@3750rpm"
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
                placeholder="300Nm@1600-2800rpm"
                value={formState.engineTransmission?.maxTorque || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "maxTorque", e.target.value)}
              />
              {validationErrors["maxTorque"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["maxTorque"]}</p>
              )}
            </FormField>

            <FormField label="Number of Cylinders">
              <PlaceholderInput
                name="cylinders"
                placeholder="4"
                type="number"
                value={formState.engineTransmission?.cylinders || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "cylinders", e.target.value)}
              />
            </FormField>

            <FormField label="Valves Per Cylinder">
              <PlaceholderInput
                name="valvesPerCylinder"
                placeholder="4"
                type="number"
                value={formState.engineTransmission?.valvesPerCylinder || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "valvesPerCylinder", e.target.value)}
              />
            </FormField>
            
            <FormField label="Turbo Charger">
              <select
                name="turboCharger"
                value={formState.engineTransmission?.turboCharger || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "turboCharger", e.target.value)}
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
                onChange={(e) => handleFieldChange("engineTransmission", "transmissionType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Transmission</option>
                {["Automatic", "Manual", "CVT", "DCT", "AMT"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Gearbox">
              <PlaceholderInput
                name="gearbox"
                placeholder="6-Speed AT"
                value={formState.engineTransmission?.gearbox || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "gearbox", e.target.value)}
              />
            </FormField>

            <FormField label="Drive Type">
              <select
                name="driveType"
                value={formState.engineTransmission?.driveType || ""}
                onChange={(e) => handleFieldChange("engineTransmission", "driveType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Drive Type</option>
                {["2WD", "4WD", "AWD"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
          </div>
        );

      case "fuelPerformance":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Fuel Type" required>
              <select
                name="fuelType"
                value={formState.fuelPerformance?.fuelType || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "fuelType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Fuel Type</option>
                {["Petrol", "Diesel", "CNG", "Electric", "Hybrid", "Flex-Fuel"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {validationErrors["fuelType"] && (
                <p className="text-xs text-destructive mt-1">{validationErrors["fuelType"]}</p>
              )}
            </FormField>

            <FormField label="Fuel Tank Capacity (Litres)">
              <PlaceholderInput
                name="fuelTankCapacity"
                placeholder="57"
                type="number"
                value={formState.fuelPerformance?.fuelTankCapacity || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "fuelTankCapacity", e.target.value)}
              />
            </FormField>

            {/* Moved fields from engine & transmission section */}
            <FormField label="Engine Position">
              <PlaceholderInput
                name="enginePosition"
                placeholder="Front"
                value={formState.fuelPerformance?.enginePosition || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "enginePosition", e.target.value)}
              />
            </FormField>

            <FormField label="Engine Location">
              <PlaceholderInput
                name="engineLocation"
                placeholder="Front Transverse"
                value={formState.fuelPerformance?.engineLocation || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "engineLocation", e.target.value)}
              />
            </FormField>

            <FormField label="Compression Ratio">
              <PlaceholderInput
                name="compressionRatio"
                placeholder="16.5:1"
                value={formState.fuelPerformance?.compressionRatio || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "compressionRatio", e.target.value)}
              />
            </FormField>

            <FormField label="Fuel Supply System">
              <PlaceholderInput
                name="fuelSupplySystem"
                placeholder="Direct Injection"
                value={formState.fuelPerformance?.fuelSupplySystem || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "fuelSupplySystem", e.target.value)}
              />
            </FormField>

            {/* ...existing fields... */}
            <FormField label="Mileage (kmpl)">
              <PlaceholderInput
                name="mileage"
                placeholder="15.6"
                type="text"
                value={formState.fuelPerformance?.mileage || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "mileage", e.target.value)}
              />
            </FormField>

            {/* ...other fuel performance fields... */}
            <FormField label="City Mileage (kmpl)">
              <PlaceholderInput
                name="cityMileage"
                placeholder="12.8"
                type="text"
                value={formState.fuelPerformance?.cityMileage || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "cityMileage", e.target.value)}
              />
            </FormField>

            <FormField label="Highway Mileage (kmpl)">
              <PlaceholderInput
                name="highwayMileage"
                placeholder="18.2"
                type="text"
                value={formState.fuelPerformance?.highwayMileage || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "highwayMileage", e.target.value)}
              />
            </FormField>

            <FormField label="Top Speed (kmph)">
              <PlaceholderInput
                name="topSpeed"
                placeholder="180"
                type="number"
                value={formState.fuelPerformance?.topSpeed || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "topSpeed", e.target.value)}
              />
            </FormField>

            <FormField label="Acceleration (0-100 kmph in sec)">
              <PlaceholderInput
                name="acceleration"
                placeholder="9.5"
                type="number"
                step="0.1"
                value={formState.fuelPerformance?.acceleration || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "acceleration", e.target.value)}
              />
            </FormField>

            <FormField label="Emission Norm Compliance">
              <PlaceholderInput
                name="emissionNorm"
                placeholder="BS VI 2.0"
                value={formState.fuelPerformance?.emissionNorm || ""}
                onChange={(e) => handleFieldChange("fuelPerformance", "emissionNorm", e.target.value)}
              />
            </FormField>
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
                onChange={(e) => handleFieldChange("dimensionsCapacity", "length", e.target.value)}
              />
            </FormField>

            <FormField label="Width (mm)">
              <PlaceholderInput
                name="width"
                placeholder="1820"
                type="number"
                value={formState.dimensionsCapacity?.width || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "width", e.target.value)}
              />
            </FormField>

            <FormField label="Height (mm)">
              <PlaceholderInput
                name="height"
                placeholder="1855"
                type="number"
                value={formState.dimensionsCapacity?.height || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "height", e.target.value)}
              />
            </FormField>

            <FormField label="Wheelbase (mm)">
              <PlaceholderInput
                name="wheelBase"
                placeholder="2450"
                type="number"
                value={formState.dimensionsCapacity?.wheelBase || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "wheelBase", e.target.value)}
              />
            </FormField>

            <FormField label="Ground Clearance (mm)">
              <PlaceholderInput
                name="groundClearance"
                placeholder="226"
                type="number"
                value={formState.dimensionsCapacity?.groundClearance || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "groundClearance", e.target.value)}
              />
            </FormField>

            <FormField label="Seating Capacity">
              <PlaceholderInput
                name="seatingCapacity"
                placeholder="5"
                type="number"
                value={formState.dimensionsCapacity?.seatingCapacity || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "seatingCapacity", e.target.value)}
              />
            </FormField>

            <FormField label="No. of Doors">
              <PlaceholderInput
                name="doors"
                placeholder="3"
                type="number"
                value={formState.dimensionsCapacity?.doors || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "doors", e.target.value)}
              />
            </FormField>

            <FormField label="Boot Space (Litres)">
              <PlaceholderInput
                name="bootSpace"
                placeholder="420"
                type="number"
                value={formState.dimensionsCapacity?.bootSpace || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "bootSpace", e.target.value)}
              />
            </FormField>

            <FormField label="Kerb Weight (kg)">
              <PlaceholderInput
                name="kerbWeight"
                placeholder="1650"
                type="number"
                value={formState.dimensionsCapacity?.kerbWeight || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "kerbWeight", e.target.value)}
              />
            </FormField>

            <FormField label="Approach Angle (degrees)">
              <PlaceholderInput
                name="approachAngle"
                placeholder="41.2"
                type="number"
                step="0.1"
                value={formState.dimensionsCapacity?.approachAngle || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "approachAngle", e.target.value)}
              />
            </FormField>

            <FormField label="Break-over Angle (degrees)">
              <PlaceholderInput
                name="breakOverAngle"
                placeholder="26.2"
                type="number"
                step="0.1"
                value={formState.dimensionsCapacity?.breakOverAngle || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "breakOverAngle", e.target.value)}
              />
            </FormField>

            <FormField label="Departure Angle (degrees)">
              <PlaceholderInput
                name="departureAngle"
                placeholder="36"
                type="number"
                step="0.1"
                value={formState.dimensionsCapacity?.departureAngle || ""}
                onChange={(e) => handleFieldChange("dimensionsCapacity", "departureAngle", e.target.value)}
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
                value={formState.suspensionSteeringBrakes?.frontSuspension || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "frontSuspension", e.target.value)}
              />
            </FormField>

            <FormField label="Rear Suspension">
              <PlaceholderInput
                name="rearSuspension"
                placeholder="Multi-link suspension"
                value={formState.suspensionSteeringBrakes?.rearSuspension || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "rearSuspension", e.target.value)}
              />
            </FormField>

            <FormField label="Steering Type">
              <PlaceholderInput
                name="steeringType"
                placeholder="Hydraulic"
                value={formState.suspensionSteeringBrakes?.steeringType || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "steeringType", e.target.value)}
              />
            </FormField>
            
            <FormField label="Steering Column">
              <PlaceholderInput
                name="steeringColumn"
                placeholder="Tilt"
                value={formState.suspensionSteeringBrakes?.steeringColumn || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "steeringColumn", e.target.value)}
              />
            </FormField>

            <FormField label="Steering Gear Type">
              <PlaceholderInput
                name="steeringGearType"
                placeholder="Rack & Pinion"
                value={formState.suspensionSteeringBrakes?.steeringGearType || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "steeringGearType", e.target.value)}
              />
            </FormField>

            <FormField label="Turning Radius (meters)">
              <PlaceholderInput
                name="turningRadius"
                placeholder="5.4"
                type="number"
                step="0.1"
                value={formState.suspensionSteeringBrakes?.turningRadius || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "turningRadius", e.target.value)}
              />
            </FormField>

            <FormField label="Front Brake Type">
              <select
                name="frontBrakeType"
                value={formState.suspensionSteeringBrakes?.frontBrakeType || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "frontBrakeType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Front Brake Type</option>
                {["Disc", "Drum", "Ventilated Disc"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Rear Brake Type">
              <select
                name="rearBrakeType"
                value={formState.suspensionSteeringBrakes?.rearBrakeType || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "rearBrakeType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Rear Brake Type</option>
                {["Disc", "Drum", "Ventilated Disc"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Front Wheel Size (Inch)">
              <PlaceholderInput
                name="frontWheelSize"
                placeholder="18"
                type="number"
                step="0.5"
                value={formState.suspensionSteeringBrakes?.frontWheelSize || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "frontWheelSize", e.target.value)}
              />
            </FormField>

            <FormField label="Rear Wheel Size (Inch)">
              <PlaceholderInput
                name="rearWheelSize"
                placeholder="18"
                type="number"
                step="0.5"
                value={formState.suspensionSteeringBrakes?.rearWheelSize || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "rearWheelSize", e.target.value)}
              />
            </FormField>
            
            <FormField label="Front Tyre Size">
              <PlaceholderInput
                name="frontTyreSize"
                placeholder="235/60 R18"
                value={formState.suspensionSteeringBrakes?.frontTyreSize || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "frontTyreSize", e.target.value)}
              />
            </FormField>
            
            <FormField label="Rear Tyre Size">
              <PlaceholderInput
                name="rearTyreSize"
                placeholder="235/60 R18"
                value={formState.suspensionSteeringBrakes?.rearTyreSize || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "rearTyreSize", e.target.value)}
              />
            </FormField>
            
            <FormField label="Wheel Type">
              <select
                name="wheelType"
                value={formState.suspensionSteeringBrakes?.wheelType || ""}
                onChange={(e) => handleFieldChange("suspensionSteeringBrakes", "wheelType", e.target.value)}
                className="mt-1 block w-full rounded border border-input bg-background text-foreground px-3 py-2"
              >
                <option value="">Select Wheel Type</option>
                {["Alloy", "Steel"].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                "parkingSensorsRear",
                "foldableRearSeat",
                "split50_50",
                "usbCharger",
                "automaticClimateControl",
                "airQualityControl",
                "rearACVents",
                "seatLumbarSupport",
                "cruiseControl",
                "vanityMirror",
                "rearReadingLamp",
                "rearSeatHeadrest",
                "adjustableHeadrest",
                "powerWindowsFront",
                "powerWindowsRear",
                "remoteFuelLid",
                "lowFuelWarningLight",
                "accessoryPowerOutlet",
                "trunkLight",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.comfortConvenience?.[feature] || false}
                    onChange={(e) => handleFieldChange("comfortConvenience", feature, e.target.checked)}
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature === "split50_50" 
                      ? "Split 50:50" 
                      : feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "interior":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "tachometer",
                "electronicMultiTripmeter",
                "fabricUpholstery",
                "leatherSteeringWheel",
                "gloveBox",
                "digitalCluster",
                "digitalOdometer",
                "heightAdjustableDriverSeat",
                "ventilatedSeats",
                "dualToneSeats",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.interior?.[feature] || false}
                    onChange={(e) => handleFieldChange("interior", feature, e.target.checked)}
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

      case "exterior":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "adjustableHeadlamps",
                "fogLampsFront",
                "fogLampsRear",
                "powerAntenna",
                "rearWindowDefogger",
                "rearWindowWasher",
                "rearWindowWiper",
                "alloyWheels",
                "powerAdjustableExteriorRearViewMirror",
                "electricFoldingRearViewMirror",
                "rainSensingWiper",
                "rearSpoiler",
                "sunroof",
                "moonroof",
                "integratedAntenna",
                "chromeGrille",
                "chromeGarnish",
                "roofRail",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.exterior?.[feature] || false}
                    onChange={(e) => handleFieldChange("exterior", feature, e.target.checked)}
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

      case "safety":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "antiLockBraking",
                "centralLocking",
                "powerDoorLocks",
                "childSafetyLocks",
                "antiTheftAlarm",
                "driverAirbag",
                "passengerAirbag",
                "sideAirbagFront",
                "sideAirbagRear",
                "dayNightRearViewMirror",
                "passengerSideDummyCamera",
                "xenonHeadlamps",
                "rearSeatBelts",
                "seatBeltWarning",
                "doorAjar",
                "sideImpactBeams",
                "frontImpactBeams",
                "tractionControlSystem",
                "adjustableBrakes",
                "electronicBrakeForceDistribution",
                "hillHoldControl",
                "vehicleStabilityControl",
                "engineImmobilizer",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.safety?.[feature] || false}
                    onChange={(e) => handleFieldChange("safety", feature, e.target.checked)}
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

      case "entertainment":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "radio",
                "speakerFront",
                "speakerRear",
                "integratedMusicSystem",
                "wirelessPhoneCharger",
                "usbChargerFront",
                "usbChargerRear",
                "bluetoothConnectivity",
                "touchscreen",
                "smartphoneConnectivity",
                "androidAuto",
                "appleCarPlay",
                "navigationSystem",
                "steeringMountedControls",
              ].map((feature) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formState.entertainment?.[feature] || false}
                    onChange={(e) => handleFieldChange("entertainment", feature, e.target.checked)}
                    className="rounded border border-input bg-background text-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {feature.split(/(?=[A-Z])/).join(" ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <FormField label="Touchscreen Size (inch)">
                <PlaceholderInput
                  name="touchscreenSize"
                  placeholder="10.25"
                  type="number"
                  step="0.1"
                  value={formState.entertainment?.touchscreenSize || ""}
                  onChange={(e) => handleFieldChange("entertainment", "touchscreenSize", e.target.value)}
                />
              </FormField>
              <FormField label="Number of Speakers">
                <PlaceholderInput
                  name="numberOfSpeakers"
                  placeholder="6"
                  type="number"
                  value={formState.entertainment?.numberOfSpeakers || ""}
                  onChange={(e) => handleFieldChange("entertainment", "numberOfSpeakers", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [activeSection, formState, handleFieldChange, validationErrors, mainImages, interiorImages, exteriorImages, colorImages]);

  // Loading state
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // Authentication check
  if (!isAuthenticated) {
    return null; // Will redirect via useAuthCheck
  }

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
          
          {/* Updated CarPreview with properly passed color images */}
          <CarPreview data={formState} images={{
            main: mainImages[0] || "/placeholder.svg",
            interior: interiorImages,
            exterior: exteriorImages,
            colors: colorImages.length > 0 ? colorImages : []
          }} />
          
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => handleSubmit(new Event("submit") as any)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Car"}
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
              {CAR_SECTIONS.map((section) => (
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
              Add New Car
            </h1>

            <div className="space-y-6">{renderSectionFields()}</div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between gap-4">
              <Button
                type="button"
                onClick={handlePreviousSection}
                disabled={activeSection === CAR_SECTIONS[0].id}
                variant="outline"              >                Previous              </Button>              <div className="flex gap-2">                {activeSection === CAR_SECTIONS[CAR_SECTIONS.length - 1].id && (                  <Button                    type="button"                    onClick={togglePreviewMode}                    variant="secondary"                  >                    Preview                  </Button>                )}                {activeSection === CAR_SECTIONS[CAR_SECTIONS.length - 1].id ? (                  <Button type="submit" disabled={isSubmitting}>                    {isSubmitting ? "Creating..." : "Create Car"}                  </Button>                ) : (                  <Button type="button" onClick={handleNextSection}>                    Next                  </Button>                )}              </div>            </div>          </div>        </div>      </form>      {error && (        <div className="mt-4 bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded">          {error}        </div>      )}    </div>
  );
}
