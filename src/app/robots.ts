import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/reservar/confirmacion", "/es/reservar/confirmacion", "/en/book/confirmation"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
