import "server-only";

import type { Locale } from "@/i18n/config";

const dictionaries = {
  es: () => import("@/i18n/locales/es").then((module) => module.default),
  en: () => import("@/i18n/locales/en").then((module) => module.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type { Dictionary } from "@/i18n/locales/es";
