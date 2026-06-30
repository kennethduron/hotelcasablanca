import type { MetadataRoute } from "next";

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
    url: `https://hotelcasablanca.hn${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}