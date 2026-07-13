import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/metadata";

const routes = [
  "",
  "/habitaciones",
  "/servicios",
  "/entorno",
  "/contacto",
  "/reservar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}