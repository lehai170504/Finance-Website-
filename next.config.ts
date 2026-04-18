import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Cấu hình PWA
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

// Cấu hình Next.js (chứa các settings cũ của ông)
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Thêm các config khác ở đây nếu có (ví dụ: env, redirects...)
};

// Bọc cấu hình nextConfig bằng PWA
export default withPWA(nextConfig);
