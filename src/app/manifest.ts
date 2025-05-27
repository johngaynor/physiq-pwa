import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PhysiQ",
    short_name: "PhysiQ",
    description: "Bodybuilding Redefined.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}
