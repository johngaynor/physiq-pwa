import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/diet/log",
        destination: "/diet",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
