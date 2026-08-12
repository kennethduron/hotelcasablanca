import { notFound } from "next/navigation";

import { BookingPublicPage, ConfirmationPublicPage, ContactPublicPage, HomePublicPage, RoomsPublicPage, ServicesPublicPage, SurroundingsPublicPage } from "@/components/pages/public-pages";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { publicRouteKeys, routeFromSegments } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/metadata";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.flatMap((locale) => publicRouteKeys.map((route) => {
    const localized = routeFromSegments(locale, []);
    void localized;
    const paths = { es: { home: [], rooms: ["habitaciones"], services: ["servicios"], surroundings: ["entorno"], contact: ["contacto"], book: ["reservar"], confirmation: ["reservar", "confirmacion"] }, en: { home: [], rooms: ["rooms"], services: ["services"], surroundings: ["surroundings"], contact: ["contact"], book: ["book"], confirmation: ["book", "confirmation"] } } as const;
    return { locale, slug: [...paths[locale][route]] };
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug?: string[] }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) return {};
  const route = routeFromSegments(locale, slug);
  if (!route) return {};
  return createLocalizedMetadata(locale, route, await getDictionary(locale));
}

export default async function LocalizedPublicPage({ params, searchParams }: { params: Promise<{ locale: string; slug?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const route = routeFromSegments(locale, slug);
  if (!route) notFound();
  const dictionary = await getDictionary(locale);
  const context = { locale, dictionary };
  if (route === "home") return <HomePublicPage {...context} />;
  if (route === "rooms") return <RoomsPublicPage {...context} />;
  if (route === "services") return <ServicesPublicPage {...context} />;
  if (route === "surroundings") return <SurroundingsPublicPage {...context} />;
  if (route === "contact") return <ContactPublicPage {...context} />;
  if (route === "book") return <BookingPublicPage {...context} searchParams={await searchParams} />;
  return <ConfirmationPublicPage {...context} />;
}
