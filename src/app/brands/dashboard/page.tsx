'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Car, Bike, Plus, PenSquare, Trash2, Eye } from 'lucide-react';
import type { Vehicle } from '@/types/vehicle';

const BrandDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cars' | 'bikes'>('cars');

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`/api/brands/vehicles?type=${activeTab}`);
        const data = await response.json();
        if (data.vehicles) {
          setVehicles(data.vehicles);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchVehicles();
    }
  }, [session, activeTab]);

  if (status === "loading" || !session) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="p-8 bg-gray-950">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Brand Dashboard</h1>
          <button
            onClick={() => router.push('/brands/vehicles/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Your {activeTab === 'cars' ? 'Cars' : 'Bikes'}
              </h2>
              <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('cars')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    activeTab === 'cars'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  Cars
                </button>
                <button
                  onClick={() => setActiveTab('bikes')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    activeTab === 'bikes'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  Bikes
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price Range</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-6 text-center text-gray-400">
                      Loading vehicles...
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-6 text-center text-gray-400">
                      No vehicles found. Add your first {activeTab === 'cars' ? 'car' : 'bike'}!
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center">
                            {vehicle.images?.main ? (
                              <img
                                src={vehicle.images.main}
                                alt={vehicle.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              activeTab === 'cars' ? <Car className="w-6 h-6 text-gray-400" /> : <Bike className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-300">{vehicle.name}</div>
                            <div className="text-xs text-gray-500">{vehicle.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-300">
                        ₹{vehicle.price.starting.toLocaleString()} - ₹{vehicle.price.ending.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          vehicle.featured
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {vehicle.featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => router.push(`/vehicles/${vehicle._id}`)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/brands/vehicles/edit/${vehicle._id}`)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <PenSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Add delete confirmation modal
                              console.log('Delete:', vehicle._id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
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
