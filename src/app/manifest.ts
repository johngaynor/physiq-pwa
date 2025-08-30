import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PhysiQ",
    short_name: "PhysiQ",
    description: "Intelligent Bodybuilding.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/icon-light-bg-192x192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icon-light-bg-512x512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/icon-light-bg-1024x1024.jpg",
        sizes: "1024x1024",
        type: "image/jpeg",
      },
    ],
  };
}
