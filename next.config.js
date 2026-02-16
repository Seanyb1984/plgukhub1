const nextConfig = {
  typescript: {
    // !! WARN !!
    // This allows production builds to complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}