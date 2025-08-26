import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['@prisma/client'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
