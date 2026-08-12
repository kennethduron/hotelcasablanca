import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizedPaths, pathFor, type PublicRouteKey } from "@/i18n/routing";

export const siteUrl = "https://hotelcasablancahn.vercel.app";
const socialImage = { url: "/brand/Casa_Blanca_Hotel_Logo.png", width: 897, height: 847, alt: "Hotel Casa Blanca" };

const seoKeys: Record<PublicRouteKey, [keyof Dictionary["seo"], keyof Dictionary["seo"]]> = {
  home: ["homeTitle", "homeDescription"], rooms: ["roomsTitle", "roomsDescription"], services: ["servicesTitle", "servicesDescription"], surroundings: ["surroundingsTitle", "surroundingsDescription"], contact: ["contactTitle", "contactDescription"], book: ["bookTitle", "bookDescription"], confirmation: ["confirmationTitle", "confirmationDescription"],
};

export function createLocalizedMetadata(locale: Locale, route: PublicRouteKey, dictionary: Dictionary): Metadata {
  const [titleKey, descriptionKey] = seoKeys[route];
  const title = dictionary.seo[titleKey];
  const description = dictionary.seo[descriptionKey];
  const path = pathFor(locale, route);
  const languages = { es: localizedPaths.es[route], en: localizedPaths.en[route], "x-default": localizedPaths.es[route] };
  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: { title, description, url: path, locale: locale === "es" ? "es_HN" : "en_US", alternateLocale: locale === "es" ? ["en_US"] : ["es_HN"], siteName: "Hotel Casa Blanca", type: "website", images: [socialImage] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage.url] },
    ...(route === "confirmation" ? { robots: { index: false, follow: false } } : {}),
  };
}

export function createPageMetadata({ title, description, path, noIndex = false }: { title: string; description: string; path: string; noIndex?: boolean }): Metadata {
  return { title, description, alternates: { canonical: path }, ...(noIndex ? { robots: { index: false, follow: false } } : {}) };
}
