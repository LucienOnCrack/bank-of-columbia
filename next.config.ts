import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Build optimizations for faster deployments
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Bundle analyzer and optimization
  experimental: {
    optimizeCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Output optimizations
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.roblox.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bdykshcyvozkfovisqkg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Image optimization for faster builds
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

export default nextConfig;
