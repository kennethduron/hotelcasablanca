export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";
export const localeCookie = "hotel_locale";

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function intlLocale(locale: Locale) {
  return locale === "es" ? "es-HN" : "en-US";
}
