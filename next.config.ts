import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Cấu hình PWA
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

// Cấu hình Next.js
const nextConfig: NextConfig = {
  trailingSlash: true, // Thêm dòng này để fix lỗi đường dẫn
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
  devIndicators: {
    // @ts-ignore - Next.js 16 types might be missing this, but it works at runtime
    appIsrStatus: false,
  },
};

// Bọc cấu hình nextConfig bằng PWA
export default withPWA(nextConfig);
