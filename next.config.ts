import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/waghDev/**',
      },
    ],
  },
  experimental: {
    serverActions: {},
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this to handle mongoose/mongodb compatibility
  webpack: (config) => {
    // Allow default exports from ES modules
    config.module.rules.push({
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    });
    return config;
  },
};

export default nextConfig;
