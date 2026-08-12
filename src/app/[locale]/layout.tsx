import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/public-shell";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { fontClasses } from "@/lib/fonts";
import { siteUrl } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import "../globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = { metadataBase: new URL(siteUrl), icons: { icon: "/favicon.ico" } };

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocalizedLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);
  const jsonLd = { "@context": "https://schema.org", "@type": "Hotel", name: siteConfig.name, description: dictionary.seo.homeDescription, inLanguage: locale, url: `${siteUrl}/${locale}`, telephone: siteConfig.phone, address: { "@type": "PostalAddress", streetAddress: siteConfig.address, addressLocality: "El Progreso", addressRegion: "Yoro", addressCountry: "HN" }, geo: { "@type": "GeoCoordinates", latitude: siteConfig.coordinates.lat, longitude: siteConfig.coordinates.lng } };
  return <html className={fontClasses} lang={locale}><body className="flex min-h-full flex-col hotel-surface"><script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" /><PublicShell dictionary={dictionary} locale={locale}>{children}</PublicShell></body></html>;
}
