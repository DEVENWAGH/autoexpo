"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Trash2, ArrowLeft } from "lucide-react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { formatIndianNumber } from "@/lib/utils";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarkStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 pb-16">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Your Bookmarks</h1>
          </div>
          
          {bookmarks.length > 0 && (
            <button
              onClick={clearBookmarks}
              className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="bg-card rounded-xl shadow-md overflow-hidden">
          {bookmarks.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-12 text-center">
              <h2 className="text-2xl font-medium mb-4">No bookmarked vehicles</h2>
              <p className="text-muted-foreground mb-8">
                You haven't saved any vehicles to your bookmarks yet.
              </p>
              <Link
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Vehicles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
              {bookmarks.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
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
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="Remove from bookmarks"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/${vehicle.slug}`} className="block hover:underline">
                      <h3 className="text-lg font-medium line-clamp-1">
                        {vehicle.brand} {vehicle.name}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary font-medium">
                        {formatIndianNumber(vehicle.price)}
                      </span>
                      <Link
                        href={`/${vehicle.slug}`}
                        className="text-sm text-primary/80 hover:text-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
