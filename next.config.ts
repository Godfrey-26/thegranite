import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.thegranite.co.zw', // fixed - remove the markdown link format
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.thegranite.co.zw/api/v1/:path*', // removed trailing slash - trailingSlash:true handles it
      },
    ];
  },
};

export default nextConfig;