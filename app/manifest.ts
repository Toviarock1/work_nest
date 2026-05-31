import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WorkNest — Collaborate better, deliver faster",
    short_name: "WorkNest",
    description:
      "The all-in-one workspace for modern teams to manage projects, chat in real-time, and share files without the clutter.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#f5f7f9",
    theme_color: "#1d6d6b",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
