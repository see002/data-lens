import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // Add more remotePatterns here as needed
    ],
  },
  experimental: {
    optimizePackageImports: [], // Array of package names to optimize
  },
};

export default nextConfig;
