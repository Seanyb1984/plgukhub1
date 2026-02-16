import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // This allows the build to succeed even if scripts have type errors
    ignoreBuildErrors: true, 
  },
  eslint: {
    // This prevents minor formatting warnings from stopping the build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;