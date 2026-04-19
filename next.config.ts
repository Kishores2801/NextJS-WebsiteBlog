import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    qualities: [25, 50, 75, 100],
  },

  output: 'standalone',
};

export default nextConfig;

