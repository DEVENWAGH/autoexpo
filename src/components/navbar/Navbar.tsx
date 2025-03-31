"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import location from "../../app/location.json";
import localFont from "next/font/local";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Bookmark, Heart, X, ChevronDown } from "lucide-react";
import { useBookmarkStore, BookmarkedVehicle } from "@/store/useBookmarkStore";

const MonumentExtended = localFont({
  src: "../../app/fonts/MonumentExtended-Regular.ttf",
  variable: "--font-monument-extended",
  weight: "400",
});

// Dynamically import Lottie to ensure it only runs on the client side
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const { bookmarks, removeBookmark } = useBookmarkStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".bookmarks-dropdown") &&
        !target.closest(".bookmark-button")
      ) {
        setBookmarksOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleBookmarks = () => {
    setBookmarksOpen(!bookmarksOpen);
  };

  // Don't render bookmarks until after hydration
  if (!mounted) return null;

  return (
    <nav
      className={`${MonumentExtended.className} flex relative justify-between px-16 h-[8rem] bg-[#0C041F] backdrop-blur-sm z-50`}
    >
      <div className="flex items-center">
        <Image
          src="/AutoExplorer.svg"
          alt="Auto Explorer"
          width={77}
          height={80}
          className="object-contain"
        />
        <div className="flex text-white">
          <a href="/" className="text-2xl">
            Auto Explorer
          </a>
        </div>
      </div>
      <div className="flex absolute top-24 right-[55%] items-center">
        <Link href="/calculator" className="flex items-center">
          <h3 className="text-white mr-2">EMI Calculator</h3>
          <div className="relative cursor-pointer">
            <Image
              className="mr-6"
              src="/calculator.svg"
              alt="calculator icon"
              width={30}
              height={30}
            />
          </div>
        </Link>
        <h3 className="text-white mr-2">News, Reviews/Videos</h3>
        <div className="relative cursor-pointer">
          <Image src="/youtube.svg" alt="yotube icon" width={30} height={30} />
        </div>
      </div>
      <div className="flex items-center gap-8 text-white">
        <div className="absolute right-1/3 top-[4.5rem]">
          <input
            type="search"
            className="w-[360px] h-14 bg-[#7129a1] rounded-t-3xl px-6 tracking-widest"
            placeholder="Search vehicle"
          />
        </div>
        <div className="cursor-pointer [&>div]:invert">
          <Lottie
            options={{
              animationData: location,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
              autoplay: true,
              loop: true,
            }}
            height={50}
            width={50}
          />
          <p>
            <span className="text-[#8A63F0]">Location</span>
          </p>
        </div>

        {/* Bookmarks dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-[#7129a1] rounded-lg hover:bg-[#8A63F0] transition-colors bookmark-button"
            onClick={toggleBookmarks}
          >
            <Bookmark className="h-5 w-5" />
            <span className="hidden md:inline">Bookmarks</span>
            {bookmarks.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4 ml-1" />
          </button>

          {bookmarksOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a0533] border border-[#7129a1] rounded-lg shadow-lg z-50 bookmarks-dropdown">
              <div className="p-3 border-b border-[#7129a1] flex justify-between items-center">
                <h3 className="font-semibold">Your Bookmarks</h3>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setBookmarksOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {bookmarks.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No bookmarked vehicles
                  </div>
                ) : (
                  bookmarks.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border-b border-[#7129a1]/30 hover:bg-[#7129a1]/20 flex items-center gap-3"
                    >
                      <div className="h-12 w-12 relative rounded-md overflow-hidden bg-black/20">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/${item.slug}`}
                          className="text-white hover:text-[#8A63F0] font-medium text-sm"
                          onClick={() => setBookmarksOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeBookmark(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Remove from bookmarks"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {bookmarks.length > 0 && (
                <div className="p-3 flex justify-center">
                  <Link
                    href="/bookmarks"
                    className="text-[#8A63F0] hover:text-white text-sm"
                    onClick={() => setBookmarksOpen(false)}
                  >
                    View all bookmarks
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {status === "authenticated" && session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
