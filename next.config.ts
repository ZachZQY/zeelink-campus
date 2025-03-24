import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'file.weweknow.com',
        port: '',
        pathname: '/**',
      },
    ],
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
