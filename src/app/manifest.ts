import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Sweet Kitty",
    description: "Natural, secret-recipe feminine rituals. The 7-Day Sweet Kitty Kit.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDCDE7",
    theme_color: "#73062C",
    lang: "en-KE",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
