import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove API routes since we'll use external API
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
};

export default nextConfig;