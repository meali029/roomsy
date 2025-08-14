import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Replaces deprecated `domains` with `remotePatterns`
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
