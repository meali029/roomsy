import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', // Allow Cloudinary images
      'via.placeholder.com', // Allow placeholder images for development
      'images.unsplash.com', // Unsplash images (common for demo content)
      'picsum.photos', // Lorem Picsum placeholder service
    ],
  },
};

export default nextConfig;
