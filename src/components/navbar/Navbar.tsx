"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import location from "../../app/location.json";
import localFont from "next/font/local";
import Link from "next/link";

const MonumentExtended = localFont({
  src: "../../app/fonts/MonumentExtended-Regular.ttf",
  variable: "--font-monument-extended",
  weight: "400",
});

// Dynamically import Lottie to ensure it only runs on the client side
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function Navbar() {
  return (
    <nav
      className={`${MonumentExtended.className} flex relative justify-between px-16 h-[8rem] bg-[#0C041F] backdrop-blur-sm`}
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
          <a href="#home" className="text-2xl">
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
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 border border-[#AF52DE] text-white rounded-lg font-abril">
            Login
          </button>
          <Link href="/register">
            <button className="px-5 py-2 bg-[#8A63F0] border border-[#AF52DE] text-[#D0BCFF] font-abel tracking-wider">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
