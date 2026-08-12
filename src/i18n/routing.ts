import type { Locale } from "@/i18n/config";

export type PublicRouteKey = "home" | "rooms" | "services" | "surroundings" | "contact" | "book" | "confirmation";

export const localizedPaths: Record<Locale, Record<PublicRouteKey, string>> = {
  es: {
    home: "/es",
    rooms: "/es/habitaciones",
    services: "/es/servicios",
    surroundings: "/es/entorno",
    contact: "/es/contacto",
    book: "/es/reservar",
    confirmation: "/es/reservar/confirmacion",
  },
  en: {
    home: "/en",
    rooms: "/en/rooms",
    services: "/en/services",
    surroundings: "/en/surroundings",
    contact: "/en/contact",
    book: "/en/book",
    confirmation: "/en/book/confirmation",
  },
};

export const publicRouteKeys = Object.keys(localizedPaths.es) as PublicRouteKey[];

export function pathFor(locale: Locale, route: PublicRouteKey) {
  return localizedPaths[locale][route];
}

export function routeFromPath(pathname: string): PublicRouteKey | null {
  const cleanPath = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  for (const locale of ["es", "en"] as const) {
    const match = publicRouteKeys.find((key) => localizedPaths[locale][key] === cleanPath);
    if (match) return match;
  }
  return null;
}

export function switchLocalePath(pathname: string, locale: Locale) {
  const route = routeFromPath(pathname);
  return route ? pathFor(locale, route) : pathFor(locale, "home");
}

export function routeFromSegments(locale: Locale, segments?: string[]): PublicRouteKey | null {
  const pathname = `/${locale}${segments?.length ? `/${segments.join("/")}` : ""}`;
  return routeFromPath(pathname);
}
