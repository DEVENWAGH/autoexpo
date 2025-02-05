"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { register } from "action/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { errors, setError, clearErrors, formData, setFormData } = useFormStore();

  const handleSubmit = async (formData: FormData) => {
    clearErrors();
    
    // Save form data to store
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
    };
    setFormData(data);

    const result = await register(formData);
    
    if (result.error) {
      if (result.error.includes('email')) {
        setError('email', result.error);
        return; // Prevent form reset
      } else if (result.error.includes('password')) {
        setError('password', result.error);
        return; // Prevent form reset
      } else {
        setError('general', result.error);
        return; // Prevent form reset
      }
    }

    if (result.success) {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] fixed inset-0">
      <div className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-xl w-[450px] transform transition-all hover:scale-[1.01]">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 blur opacity-20"></div>
        <div className="relative bg-gray-950 p-8 rounded-xl border border-gray-800/50">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/autoExplorer.svg"
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

          <form action={handleSubmit} className="mt-8 space-y-6">
            {errors.general && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                {errors.general}
              </div>
            )}
            
            {/* Name Fields */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-white block text-sm font-medium mb-1" htmlFor="firstName">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  defaultValue={formData.firstName}
                  placeholder="Enter first name"
                  className="bg-gray-700 text-white w-full"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-white block text-sm font-medium mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  defaultValue={formData.lastName}
                  placeholder="Enter last name"
                  className="bg-gray-700 text-white w-full"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={formData.email}
                placeholder="email@example.com"
                className="bg-gray-700 text-white w-full"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-lg transition-all duration-200">
              Create Account
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400 bg-gray-950">Or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button type="button" className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
