"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import location from "../../app/location.json";
import localFont from "next/font/local";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Bookmark,
  Heart,
  X,
  ChevronDown,
  Menu,
  Search,
  MapPin,
} from "lucide-react";
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
  const [searchActive, setSearchActive] = useState(false);
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const toggleBookmarks = () => {
    setBookmarksOpen(!bookmarksOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

  // Don't render bookmarks until after hydration
  if (!mounted) return null;

  return (
    <nav
      className={`${MonumentExtended.className} flex relative justify-between px-4 sm:px-6 lg:px-16 py-4 h-auto sm:h-auto lg:h-[8rem] bg-[#0C041F] backdrop-blur-sm z-50`}
    >
      {/* Logo and brand name */}
      <div className="flex items-center">
        <Image
          src="/AutoExplorer.svg"
          alt="Auto Explorer"
          width={50}
          height={50}
          className="object-contain lg:w-[77px] lg:h-[80px]"
        />
        <div className="flex text-white ml-2">
          <a href="/" className="text-lg sm:text-xl lg:text-2xl">
            Auto Explorer
          </a>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center lg:hidden">
        <button
          className="text-white p-2 menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex absolute top-24 right-[55%] items-center">
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
        <Link href="/news-reviews" className="flex items-center">
          <h3 className="text-white mr-2">News, Reviews/Videos</h3>
          <div className="relative cursor-pointer">
            <Image
              src="/youtube.svg"
              alt="youtube icon"
              width={30}
              height={30}
            />
          </div>
        </Link>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden lg:flex items-center gap-8 text-white">
        <div className="absolute right-1/3 top-[4.5rem]">
          <input
            type="search"
            className="w-[360px] h-14 bg-[#7129a1] rounded-t-3xl px-6 tracking-widest"
            placeholder="Search vehicle"
          />
        </div>

        {/* Location (Desktop) */}
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

        {/* Bookmarks dropdown (Desktop) */}
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

          {/* Bookmarks dropdown content (Both desktop and mobile) */}
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

        {/* Auth buttons (Desktop) */}
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-[#1a0533] shadow-lg mobile-menu overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#7129a1]">
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              <button
                className="text-white p-2"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="search"
                  className="w-full h-12 bg-[#7129a1]/50 rounded-lg pl-10 pr-4 text-white placeholder-gray-300"
                  placeholder="Search vehicle"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                  size={18}
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4 border-b border-[#7129a1]/50">
              <Link
                href="/calculator"
                className="flex items-center py-3 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/calculator.svg"
                  alt="calculator icon"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span>EMI Calculator</span>
              </Link>
              <Link
                href="/news-reviews"
                className="flex items-center py-3 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/youtube.svg"
                  alt="youtube icon"
                  width={24}
                  height={24}
                  className="mr-3"
                />
                <span>News, Reviews/Videos</span>
              </Link>
            </div>

            {/* Mobile Location */}
            <div className="p-4 border-b border-[#7129a1]/50">
              <div className="flex items-center text-white py-2">
                <MapPin size={20} className="mr-3 text-[#8A63F0]" />
                <span>Location</span>
              </div>
            </div>

            {/* Mobile Bookmarks */}
            <div className="p-4 border-b border-[#7129a1]/50">
              <button
                className="flex items-center gap-2 w-full text-left py-3 text-white"
                onClick={() => setBookmarksOpen(!bookmarksOpen)}
              >
                <Bookmark className="h-5 w-5 mr-3 text-[#8A63F0]" />
                <span>Bookmarks</span>
                {bookmarks.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {bookmarks.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4 ml-auto" />
              </button>
            </div>

            {/* Mobile Auth */}
            <div className="p-4">
              {status === "authenticated" && session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg border border-[#7129a1] text-white text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
