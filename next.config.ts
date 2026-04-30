import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oroazul.maat.work',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 512000,
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three-vendor',
            chunks: 'all',
            priority: 40,
            reuseExistingChunk: true,
          },
          framer: {
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            name: 'framer-vendor',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|@phosphor-icons)[\\/]/,
            name: 'icons-vendor',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
