import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.klevenjaktogfiske.no",
        pathname: "/**",
      },
    ],
    formats: ["image/webp"],
    qualities: [68, 70, 72, 75, 80, 82],
    minimumCacheTTL: 86400,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
