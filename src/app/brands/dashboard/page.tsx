"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Car as CarIcon,
  Bike as BikeIcon,
  Plus,
  PenSquare,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

// Extended vehicle type that matches your API response structure
interface ExtendedVehicle {
  _id?: string;
  basicInfo?: {
    brand: string;
    name: string;
    variant: string;
    variantName?: string;
    carType?: string;
    priceExshowroom: number;
    priceOnroad: number;
    launchYear?: number | string;
    pros?: string[];
    cons?: string[];
  };
  engineTransmission?: {
    engineType: string;
    displacement: number;
    maxPower: string;
    maxTorque: string;
    cylinders?: number;
    valvesPerCylinder?: number;
    transmissionType: string;
    gearbox?: string;
    driveType?: string;
  };
  fuelPerformance?: {
    fuelType: string;
    fuelTankCapacity?: number;
    mileage?: string;
    highwayMileage?: string;
    topSpeed?: number;
    acceleration?: number;
    emissionNorm?: string;
    electricRange?: string;
    batteryCapacity?: string;
    chargingTimeDC?: string;
    chargingTimeAC?: string;
  };
  dimensionsCapacity?: {
    length?: number;
    width?: number;
    height?: number;
    wheelBase?: number;
    groundClearance?: number;
    seatingCapacity?: number;
    doors?: number;
    bootSpace?: number;
    kerbWeight?: number;
  };
  suspensionSteeringBrakes?: {
    frontSuspension?: string;
    rearSuspension?: string;
    steeringType?: string;
    steeringColumn?: string;
    steeringGearType?: string;
    turningRadius?: number;
    frontBrakeType?: string;
    rearBrakeType?: string;
  };
  featured?: boolean;
  images?: {
    main: string[];
    interior?: string[];
    exterior?: string[];
    gallery?: string[];
    color: string[];
  };
}

const BrandDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState<ExtendedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cars" | "bikes">("cars");
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure theme is available after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`/api/vehicles/my-vehicles`);
        const data = await response.json();
        if (data.vehicles) {
          setVehicles(data.vehicles);
        } else if (activeTab === "cars" && data.cars) {
          // Handle the response format from my-vehicles endpoint
          setVehicles(data.cars);
        } else if (activeTab === "bikes" && data.bikes) {
          setVehicles(data.bikes);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchVehicles();
    }
  }, [session, activeTab]);

  // Toggle expanded view for vehicle details
  const toggleExpand = (id: string) => {
    if (expandedVehicle === id) {
      setExpandedVehicle(null);
    } else {
      setExpandedVehicle(id);
    }
  };

  // Format price for display
  const formatPrice = (price: number | undefined) => {
    // Add default value to handle undefined
    const safePrice = price ?? 0;

    if (safePrice >= 10000000) {
      return `₹${(safePrice / 10000000).toFixed(2)} Cr`;
    } else if (safePrice >= 100000) {
      return `₹${(safePrice / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${safePrice.toLocaleString("en-IN")}`;
    }
  };

  // Function to handle vehicle deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      // Refresh the list after deletion
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  // View vehicle details
  const handleView = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  // Edit vehicle
  const handleEdit = (vehicleId: string) => {
    router.push(`/brands/vehicles/edit/${vehicleId}`);
  };

  // Determine if using light or dark theme
  const isDark = mounted && theme === "dark";

  // Extract nested ternary operation for vehicle icon
  const renderVehicleIcon = (vehicle: ExtendedVehicle) => {
    // Vehicle has a main image
    if (vehicle.images?.main && vehicle.images.main.length > 0) {
      return (
        <img
          src={vehicle.images.main[0]}
          alt={vehicle.basicInfo?.name}
          className="h-10 w-10 rounded-lg object-cover"
        />
      );
    }

    // No image, show icon based on vehicle type
    if (activeTab === "cars") {
      return <CarIcon className="w-6 h-6 text-gray-400" />;
    }

    // Default to bike icon
    return <BikeIcon className="w-6 h-6 text-gray-400" />;
  };

  // Extract nested ternary for fuel information display
  const renderFuelInfo = (vehicle: ExtendedVehicle) => {
    if (vehicle.fuelPerformance?.fuelType !== "Electric") {
      return (
        <>
          {vehicle.fuelPerformance?.fuelTankCapacity && (
            <li>
              <span className="text-gray-500">Fuel Capacity:</span>{" "}
              {vehicle.fuelPerformance?.fuelTankCapacity} L
            </li>
          )}
          {vehicle.fuelPerformance?.mileage && (
            <li>
              <span className="text-gray-500">Mileage:</span>{" "}
              {vehicle.fuelPerformance?.mileage} kmpl
            </li>
          )}
        </>
      );
    } else {
      return (
        <>
          {vehicle.fuelPerformance?.batteryCapacity && (
            <li>
              <span className="text-gray-500">Battery:</span>{" "}
              {vehicle.fuelPerformance?.batteryCapacity}
            </li>
          )}
          {vehicle.fuelPerformance?.electricRange && (
            <li>
              <span className="text-gray-500">Range:</span>{" "}
              {vehicle.fuelPerformance?.electricRange}
            </li>
          )}
        </>
      );
    }
  };

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <div
      className={`min-h-screen w-full ${isDark ? "bg-black" : "bg-gray-50"}`}
    >
      <div
        className={`p-8 ${
          isDark ? "bg-gray-950" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Brand Dashboard
          </h1>
          <button
            onClick={() => router.push("/brands/vehicles/car")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex mb-6 border-b ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("cars")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "cars"
                ? "text-blue-500 border-b-2 border-blue-500"
                : isDark
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Cars
          </button>
          <button
            onClick={() => setActiveTab("bikes")}
            className={`py-2 px-4 font-medium transition-colors ${
              activeTab === "bikes"
                ? "text-blue-500 border-b-2 border-blue-500"
                : isDark
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Bikes
          </button>
        </div>

        {/* Vehicles Table */}
        <div
          className={`${
            isDark ? "bg-gray-900" : "bg-white"
          } rounded-lg shadow overflow-hidden transition-colors duration-300`}
        >
          <div className="overflow-x-auto">
            <table
              className={`min-w-full divide-y ${
                isDark ? "divide-gray-800" : "divide-gray-200"
              }`}
            >
              <thead className={isDark ? "bg-gray-800" : "bg-gray-100"}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    {activeTab === "cars" ? "Car Details" : "Bike Details"}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Pricing
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Status
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-gray-800" : "divide-gray-200"
                }`}
              >
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`py-4 px-6 text-center ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Loading vehicles...
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className={`py-4 px-6 text-center ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No vehicles found. Add your first{" "}
                      {activeTab === "cars" ? "car" : "bike"}!
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <React.Fragment key={vehicle._id}>
                      <tr
                        className={`${
                          isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-lg ${
                                isDark ? "bg-gray-700" : "bg-gray-200"
                              } flex items-center justify-center`}
                            >
                              {renderVehicleIcon(vehicle)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-medium ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {vehicle.basicInfo?.brand}{" "}
                                  {vehicle.basicInfo?.name}
                                </span>
                                <button
                                  onClick={() =>
                                    toggleExpand(vehicle._id as string)
                                  }
                                  className={`${
                                    isDark
                                      ? "text-gray-400 hover:text-gray-200"
                                      : "text-gray-500 hover:text-gray-700"
                                  }`}
                                >
                                  {expandedVehicle === vehicle._id ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              </div>
                              <div className="text-xs text-gray-500">
                                {vehicle.basicInfo?.variant}{" "}
                                {vehicle.basicInfo?.variantName &&
                                  `- ${vehicle.basicInfo.variantName}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`py-4 px-6 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <div className="flex flex-col">
                            <div>
                              Ex-Showroom:{" "}
                              {formatPrice(vehicle.basicInfo?.priceExshowroom)}
                            </div>
                            <div>
                              On-Road:{" "}
                              {formatPrice(vehicle.basicInfo?.priceOnroad)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              vehicle.featured
                                ? "bg-purple-500/10 text-purple-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {vehicle.featured ? "Featured" : "Standard"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleView(vehicle._id as string)}
                              className={`p-1 ${
                                isDark
                                  ? "text-gray-400 hover:text-white"
                                  : "text-gray-500 hover:text-blue-600"
                              } transition-colors`}
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(vehicle._id as string)}
                              className={`p-1 ${
                                isDark
                                  ? "text-gray-400 hover:text-white"
                                  : "text-gray-500 hover:text-blue-600"
                              } transition-colors`}
                              title="Edit"
                            >
                              <PenSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(vehicle._id as string)
                              }
                              className={`p-1 ${
                                isDark
                                  ? "text-gray-400 hover:text-red-500"
                                  : "text-gray-500 hover:text-red-600"
                              } transition-colors`}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {expandedVehicle === vehicle._id && (
                        <tr
                          className={isDark ? "bg-gray-850" : "bg-gray-100/50"}
                        >
                          <td colSpan={4} className="py-4 px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              {/* Engine & Transmission Details */}
                              <div
                                className={`${
                                  isDark ? "bg-gray-800/50" : "bg-white"
                                } p-4 rounded shadow`}
                              >
                                <h3 className="font-medium text-blue-600 mb-2 flex items-center gap-1">
                                  <Info size={14} />
                                  Engine & Transmission
                                </h3>
                                <ul className="space-y-1">
                                  <li>
                                    <span className="text-gray-500">
                                      Engine:
                                    </span>{" "}
                                    <span
                                      className={
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }
                                    >
                                      {vehicle.engineTransmission?.engineType}
                                    </span>
                                  </li>
                                  <li>
                                    <span className="text-gray-500">
                                      Displacement:
                                    </span>{" "}
                                    <span
                                      className={
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }
                                    >
                                      {vehicle.engineTransmission?.displacement}{" "}
                                      cc
                                    </span>
                                  </li>
                                  <li>
                                    <span className="text-gray-500">
                                      Power:
                                    </span>{" "}
                                    <span
                                      className={
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }
                                    >
                                      {vehicle.engineTransmission?.maxPower}
                                    </span>
                                  </li>
                                  <li>
                                    <span className="text-gray-500">
                                      Torque:
                                    </span>{" "}
                                    <span
                                      className={
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }
                                    >
                                      {vehicle.engineTransmission?.maxTorque}
                                    </span>
                                  </li>
                                  {vehicle.engineTransmission
                                    ?.transmissionType && (
                                    <li>
                                      <span className="text-gray-500">
                                        Transmission:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {
                                          vehicle.engineTransmission
                                            ?.transmissionType
                                        }
                                      </span>
                                    </li>
                                  )}
                                </ul>
                              </div>

                              {/* Fuel & Performance */}
                              <div
                                className={`${
                                  isDark ? "bg-gray-800/50" : "bg-white"
                                } p-4 rounded shadow`}
                              >
                                <h3 className="font-medium text-blue-600 mb-2 flex items-center gap-1">
                                  <Info size={14} />
                                  Fuel & Performance
                                </h3>
                                <ul className="space-y-1">
                                  <li>
                                    <span className="text-gray-500">
                                      Fuel Type:
                                    </span>{" "}
                                    <span
                                      className={
                                        isDark
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }
                                    >
                                      {vehicle.fuelPerformance?.fuelType}
                                    </span>
                                  </li>
                                  {renderFuelInfo(vehicle)}
                                  {vehicle.fuelPerformance?.topSpeed && (
                                    <li>
                                      <span className="text-gray-500">
                                        Top Speed:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {vehicle.fuelPerformance?.topSpeed} kmph
                                      </span>
                                    </li>
                                  )}
                                  {vehicle.fuelPerformance?.acceleration && (
                                    <li>
                                      <span className="text-gray-500">
                                        0-100:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {vehicle.fuelPerformance?.acceleration}{" "}
                                        sec
                                      </span>
                                    </li>
                                  )}
                                </ul>
                              </div>

                              {/* Dimensions & Features */}
                              <div
                                className={`${
                                  isDark ? "bg-gray-800/50" : "bg-white"
                                } p-4 rounded shadow`}
                              >
                                <h3 className="font-medium text-blue-600 mb-2 flex items-center gap-1">
                                  <Info size={14} />
                                  Dimensions & Features
                                </h3>
                                <ul className="space-y-1">
                                  {vehicle.dimensionsCapacity
                                    ?.seatingCapacity && (
                                    <li>
                                      <span className="text-gray-500">
                                        Seating:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {
                                          vehicle.dimensionsCapacity
                                            ?.seatingCapacity
                                        }{" "}
                                        People
                                      </span>
                                    </li>
                                  )}
                                  {vehicle.dimensionsCapacity?.length && (
                                    <li>
                                      <span className="text-gray-500">
                                        Dimensions:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {vehicle.dimensionsCapacity?.length}L ×{" "}
                                        {vehicle.dimensionsCapacity?.width}W ×{" "}
                                        {vehicle.dimensionsCapacity?.height}H mm
                                      </span>
                                    </li>
                                  )}
                                  {vehicle.suspensionSteeringBrakes
                                    ?.turningRadius && (
                                    <li>
                                      <span className="text-gray-500">
                                        Turning Radius:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {
                                          vehicle.suspensionSteeringBrakes
                                            ?.turningRadius
                                        }{" "}
                                        m
                                      </span>
                                    </li>
                                  )}
                                  {vehicle.basicInfo?.launchYear && (
                                    <li>
                                      <span className="text-gray-500">
                                        Launch:
                                      </span>{" "}
                                      <span
                                        className={
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                        }
                                      >
                                        {vehicle.basicInfo?.launchYear}
                                      </span>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
