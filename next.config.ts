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
    // Optimize build performance
    // optimizeCss: true, // Disabled due to missing critters dependency
    // Speed up builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Output optimizations
  output: 'standalone',
  
  // Build performance optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize chunk splitting for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module: any) {
              return module.size() > 160000 && /node_modules[/\\]/.test(module.nameForCondition() || '');
            },
            name(module: any) {
              const hash = require('crypto').createHash('sha1');
              hash.update(module.libIdent ? module.libIdent({ context: config.context }) : module.nameForCondition());
              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: false,
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
      };
    }

    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };

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
