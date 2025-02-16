"use client";

import { Car, Bike, Eye, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const popularCars = [
    { name: 'Honda Civic 2023', views: 1234, category: 'Car', trend: '+15%' },
    { name: 'Toyota Camry', views: 956, category: 'Car', trend: '+10%' },
    { name: 'BMW 3 Series', views: 845, category: 'Car', trend: '+18%' },
];

const popularBikes = [
    { name: 'Royal Enfield Classic', views: 1156, category: 'Bike', trend: '+23%' },
    { name: 'Kawasaki Ninja', views: 923, category: 'Bike', trend: '+12%' },
    { name: 'Harley Davidson Iron', views: 878, category: 'Bike', trend: '+20%' },
];

const stats = [
    { title: 'Total Listings', value: '1,256', icon: Car, change: '+8%', color: 'purple', details: '864 Cars • 392 Bikes' },
    { title: 'Total Views', value: '45.2K', icon: Eye, change: '+23%', color: 'green' },
];

const recentSignups = [
    { 
        name: 'John Doe',
        email: 'john.doe@example.com',
        date: '2024-01-15',
        avatar: '/avatars/placeholder.png'
    },
    { 
        name: 'Sarah Wilson',
        email: 'sarah.w@example.com',
        date: '2024-01-14',
        avatar: '/avatars/placeholder.png'
    },
    { 
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        date: '2024-01-14',
        avatar: '/avatars/placeholder.png'
    },
];

const Dashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showCars, setShowCars] = useState(true);
    const activeVehicles = showCars ? popularCars : popularBikes;

    useEffect(() => {
        console.log("Current session:", session); // For debugging
        console.log("User role:", session?.user?.role); // For debugging

        if (status === "loading") return;

        if (!session || session.user?.role !== "admin") {
            router.push("/unauthorized");
        }
    }, [session, status, router]);

    // Don't render anything while checking authentication
    if (status === "loading" || !session) {
        return null;
    }

    return (
        <div className="min-h-screen w-full bg-black">
            <div className="p-8 bg-gray-950">
                <h1 className="text-2xl font-bold text-white mb-8">Platform Overview</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-500 text-sm">{stat.change}</span>
                                        {stat.details && (
                                            <span className="text-gray-500 text-xs">{stat.details}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">
                                Most Viewed {showCars ? 'Cars' : 'Bikes'}
                            </h2>
                            <div className="flex items-center gap-3 bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => setShowCars(true)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                                        showCars 
                                            ? 'bg-gray-700 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Car className="w-4 h-4" />
                                    Cars
                                </button>
                                <button
                                    onClick={() => setShowCars(false)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                                        !showCars 
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
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {showCars ? 'Car Model' : 'Bike Model'}
                                    </th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {activeVehicles.map((vehicle, index) => (
                                    <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6 text-sm font-medium text-gray-300">
                                            <div className="flex items-center gap-2">
                                                {showCars ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                                                {vehicle.name}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4 text-gray-500" />
                                                {vehicle.views.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-500">
                                                {vehicle.trend}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Signups Section */}
                <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-semibold text-white">Recent Signups</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {recentSignups.map((user, index) => (
                                    <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-300">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {user.date}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;