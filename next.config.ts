import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/diet/log",
        destination: "/diet",
        permanent: true,
      },
      {
        source: "/checkins/checkin",
        destination: "/checkin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
