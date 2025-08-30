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
        source: "/training/gyms/gym",
        destination: "/training/gyms",
        permanent: true,
      },
      {
        source: "/training/exercises/exercise",
        destination: "/training/exercises",
        permanent: true,
      },
      {
        source: "/checkins/checkin",
        destination: "/checkins",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
