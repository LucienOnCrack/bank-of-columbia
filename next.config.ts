import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Build optimizations for faster deployments
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Bundle analyzer and optimization  
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Output optimizations
  output: 'standalone',
  
  // Aggressive build speed optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  generateEtags: false,
  
  // Build performance optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };

    // Optimize build performance
    config.stats = 'minimal'; // Reduce build output verbosity
    
    return config;
  },
  
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
