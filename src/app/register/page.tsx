'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from 'next/image';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).regex(
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
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                form.setError("root", { message: data.error || 'Registration failed' });
            }
        } catch {
            form.setError("root", { message: 'An error occurred during registration' });
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        // Implement Google login logic here
        try {
            const res = await fetch('/api/auth/google', {
                method: 'GET',
            });
            if (res.ok) {
                router.push('/'); // Redirect after successful login
            }
        } catch (error) {
            console.error('Google login failed:', error);
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
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                            <Input
                                {...form.register("email")}
                                type="email"
                                placeholder="email@example.com"
                                className="bg-gray-700 text-white"
                            />
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                            <Input
                                {...form.register("password")}
                                type="password"
                                placeholder="Enter your password"
                                className="bg-gray-700 text-white"
                            />
                            {form.formState.errors.password && (
                                <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        {form.formState.errors.root && (
                            <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
                        )}

                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
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
                        <Image
                            src="/google.svg"
                            alt="Google"
                            width={20}
                            height={20}
                            className="object-contain"
                        />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
