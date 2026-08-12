import type { MetadataRoute } from "next";

import { localizedPaths, publicRouteKeys } from "@/i18n/routing";
import { siteUrl } from "@/lib/metadata";

const indexableRoutes = publicRouteKeys.filter((route) => route !== "confirmation");

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.flatMap((route) => (["es", "en"] as const).map((locale) => ({
    url: `${siteUrl}${localizedPaths[locale][route]}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "home" ? 1 : route === "book" ? 0.7 : 0.8,
    alternates: { languages: { es: `${siteUrl}${localizedPaths.es[route]}`, en: `${siteUrl}${localizedPaths.en[route]}`, "x-default": `${siteUrl}${localizedPaths.es[route]}` } },
  })));
}
