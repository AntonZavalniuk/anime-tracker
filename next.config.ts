import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shikimori.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "anime-bit.ru",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
