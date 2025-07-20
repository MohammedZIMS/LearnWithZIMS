import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "learn-with-zims.t3.storage.dev",
        port: "",
        protocol: "https"
      }
    ]
  }
};

export default nextConfig;
