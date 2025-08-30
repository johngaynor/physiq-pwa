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
        src: "/icons/icon-filled-dark-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/icon-filled-dark-80x80.png",
        sizes: "80x80",
        type: "image/png",
      },
      {
        src: "/icons/icon-filled-dark-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/icon-filled-dark-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-filled-dark-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
