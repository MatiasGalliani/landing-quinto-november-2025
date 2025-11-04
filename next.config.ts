import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "creditplan.it",
      },
      {
        protocol: "https",
        hostname: "www.organismo-am.it",
      },
    ],
  },
};

export default nextConfig;
