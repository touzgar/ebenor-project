/** @type {import('next').NextConfig} */
// Bundle analyzer - only load if package is available (dev environment)
let withBundleAnalyzer;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  // @next/bundle-analyzer not installed (production build)
  withBundleAnalyzer = (config) => config;
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+216XXXXXXXX',
  },
  // ✅ REMOVED: No proxy rewrites needed - API routes are now in Next.js
  async headers() {
    return [
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets (images, fonts, etc.)
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public images
        source: '/logo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache videos with shorter TTL
        source: '/video/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Cache Next.js static files
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js images
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Suppress all output in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Disable TypeScript and ESLint checks during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Suppress all logs and warnings
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react', 'framer-motion'],
  },
  // Completely suppress all webpack output and warnings
  webpack: (config, { dev, isServer }) => {
    // Fix BSON/Mongoose compatibility issue in Next.js
    if (isServer) {
      config.externals = [...(config.externals || [])];
    }
    
    // Suppress all webpack output
    config.infrastructureLogging = {
      level: 'none',
    };
    
    // Suppress all warnings
    config.ignoreWarnings = [
      /./,  // Ignore all warnings
    ];
    
    // Suppress stats
    if (dev && !isServer) {
      config.stats = 'none';
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);