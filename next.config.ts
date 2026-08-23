import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimize build performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Reduce memory usage during build
  typescript: {
    // Only run type checking in dev, skip during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Only run ESLint in dev, skip during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
