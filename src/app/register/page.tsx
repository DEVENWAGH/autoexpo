"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { register } from "action/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';
import { Alert } from "@/components/ui/Alert";
import { registerSchema } from "@/lib/validations/auth";

const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { errors, setError: setFormError, clearErrors, formData, setFormData } = useFormStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Validate the form data
      const result = registerSchema.safeParse(data);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setValidationErrors(errors);
        return;
      }

      setValidationErrors({});

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrorMessage('Email already registered');
        } else if (responseData.error) {
          setErrorMessage(responseData.error);
        } else {
          setErrorMessage('An error occurred during registration');
        }
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration');
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

          {errorMessage && <Alert type="error" message={errorMessage} />}
          {success && <Alert type="success" message={success} />}

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
                  className={`bg-gray-700 text-white w-full ${validationErrors.firstName ? 'border-red-500' : 'border-gray-600'}`}
                  required
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.firstName}</p>
                )}
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
                  className={`bg-gray-700 text-white w-full ${validationErrors.lastName ? 'border-red-500' : 'border-gray-600'}`}
                  required
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.lastName}</p>
                )}
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
                className={`bg-gray-700 text-white w-full ${validationErrors.email ? 'border-red-500' : 'border-gray-600'}`}
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
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
                  className={`w-full px-4 py-2 text-gray-300 bg-gray-700/50 border ${validationErrors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-lg transition-all duration-200">
              Create Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center w-full border-t border-gray-700">
              </div>
            </div>

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
