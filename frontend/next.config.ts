import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API rewrites: use localhost in dev, backend URL in production
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
