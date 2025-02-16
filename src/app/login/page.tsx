"use client";

import { signIn } from "next-auth/react";
import { signInWithGoogle } from "@/actions/auth";
import { Alert } from "@/components/ui/Alert";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Validate the form data
      const result = loginSchema.safeParse(data);
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          errors[issue.path[0]] = issue.message;
        });
        setValidationErrors(errors);
        return;
      }

      setValidationErrors({});
      
      const loginResult = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (loginResult?.error) {
        setError('Invalid email or password');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030712] fixed inset-0">
      <div className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-xl w-96 transform transition-all hover:scale-[1.01]">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 blur opacity-20"></div>
        <div className="relative bg-gray-950 p-8 rounded-xl border border-gray-800/50">
          <div className="flex justify-center mb-6">
            <Image
              src="/autoExplorer.svg"
              alt="AutoExplorer Logo"
              width={120}
              height={120}
              className="animate-pulse"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Auto Explorer
          </h2>
          {error && <Alert type="error" message={error} />}
          <form className="space-y-6" action={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <Input
                id="email"
                placeholder="email@mail.com"
                name="email"
                type="email"
                required
                className={`w-full px-4 py-2 text-gray-300 bg-gray-700/50 border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                placeholder="••••••••"
                name="password"
                type="password"
                required
                className={`w-full px-4 py-2 text-gray-300 bg-gray-700/50 border ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-300">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition-colors inline-block"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
            >
              <span>Sign in</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-gray-950">
                Or continue with
              </span>
            </div>
          </div>
          <button
            onClick={() => signInWithGoogle()}
            type="button"
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-700"
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
            <span>Continue with Google</span>
          </button>
          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
