"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712]">
      <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-xl w-[450px] border border-gray-800/50">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access this page. Please contact an
            administrator if you believe this is an error.
          </p>
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
