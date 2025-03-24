import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["file.weweknow.com"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "zeelink-campus.weweknow.com",
        "zeelink-campus.weweknow.com:80",
      ],
    },
  },
};

export default nextConfig;
