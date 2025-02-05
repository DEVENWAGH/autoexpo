"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        form.setError("root", { message: data.error || "Registration failed" });
      }
    } catch {
      form.setError("root", {
        message: "An error occurred during registration",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    // Implement Google login logic here
    try {
      const res = await fetch("/api/auth/google", {
        method: "GET",
      });
      if (res.ok) {
        router.push("/"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800/50 backdrop-blur-sm p-6 shadow-xl border border-gray-700">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/AutoExplorer.svg"
              alt="Auto Explorer"
              width={80}
              height={80}
              className="object-contain"
            />
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="text-center text-gray-400">
              Join Auto Explorer and explore the world of automotive excellence
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-white block text-sm font-medium mb-1" htmlFor="firstName">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  className="bg-gray-700 text-white w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-white block text-sm font-medium mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  className="bg-gray-700 text-white w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="bg-gray-700 text-white"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-gray-700 text-white"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {form.formState.errors.root && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
            <p className="text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">Or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-white hover:bg-gray-100 text-gray-900 flex items-center justify-center gap-2 py-2 rounded"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
