"use client";
import Image from "next/image";
import Lottie from "react-lottie";
import location from "../../app/location.json";
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-16 h-[117px] bg-[#0C041F] backdrop-blur-sm">
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

      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            type="search"
            className="w-[360px] h-14 bg-[#ECE6F0] rounded-full px-12"
            placeholder="Search"
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
        </div>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 border border-[#AF52DE] text-white rounded-lg font-abril">
            Login
          </button>
          <button className="px-5 py-2 bg-[#8A63F0] border border-[#AF52DE] text-[#D0BCFF] font-abel tracking-wider">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
