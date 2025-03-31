"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarkStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-black"></div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Bookmarked Vehicles</h1>
          {bookmarks.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Remove all bookmarks?")) {
                  clearBookmarks();
                }
              }}
              className="text-red-500 border-red-500 hover:bg-red-500/10"
            >
              Clear All
            </Button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-4">No bookmarked vehicles</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You haven't saved any vehicles to your bookmarks yet.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Explore Vehicles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookmarks.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={vehicle.image || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.name}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeBookmark(vehicle.id)}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <Link href={`/${vehicle.slug}`}>
                    <h2 className="text-lg font-medium hover:text-blue-500 transition-colors">
                      {vehicle.name}
                    </h2>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(vehicle.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
