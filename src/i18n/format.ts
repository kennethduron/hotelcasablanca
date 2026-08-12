import { intlLocale, type Locale } from "@/i18n/config";

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "HNL",
    currencyDisplay: locale === "es" ? "narrowSymbol" : "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLongDate(value: string, locale: Locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Tegucigalpa",
  }).format(new Date(`${value}T12:00:00Z`));
}
