/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    remotePatterns: [],
    unoptimized: true, // Allow unoptimized images for SVGs
  },
  // Ensure static files are properly served
  async headers() {
    return [
      {
        // Apply to all static files under public/brands
        source: "/brands/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
