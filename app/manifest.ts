import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Appo Matrix",
    short_name: "Appo Matrix",
    description: "Software studio in Gilgit-Baltistan. Web, mobile, and SaaS for teams worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f9",
    theme_color: "#1B7FBB",
    lang: "en",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
