import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Footer() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme-aware styles
  const textClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-gray-300"
      : "text-gray-600";

  const headingClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "text-white"
      : "text-gray-900";

  const borderClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "border-gray-800"
      : "border-gray-200";

  const buttonClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-gray-800 text-white hover:bg-gray-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  const inputClass =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-gray-800 border-gray-300";

  return (
    <footer className={`p-6 mt-12 border-t ${borderClass}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Image
            src="AutoExplorer.svg"
            alt="LogoImage"
            width={60}
            height={60}
            className="rounded-full mb-4"
          />
          <p className={textClass}>Let&apos;s connect with us social</p>
        </div>
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${headingClass}`}>
            Company
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className={textClass}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/support" className={textClass}>
                Support
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={textClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={textClass}>
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${headingClass}`}>
            Get in Touch
          </h3>
          <ul className={`space-y-2 ${textClass}`}>
            <li>+91 7866406077</li>
            <li>+91 7775883925</li>
            <li>autoexplorer@gmail.com</li>
            <li>Panvel Navi Mumbai Maharashtra, 410206</li>
          </ul>
        </div>
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${headingClass}`}>
            Stay Updated
          </h3>
          <div className="flex gap-2">
            <Input type="email" placeholder="Email" className={inputClass} />
            <button
              className={`px-4 py-2 rounded transition-colors ${buttonClass}`}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div
        className={`text-center mt-8 pt-8 border-t ${borderClass} ${textClass}`}
      >
        <p>Copyright © 2024 AutoExplorer Pvt.Ltd.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
