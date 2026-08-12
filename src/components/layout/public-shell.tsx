import { Footer } from "@/components/layout/footer";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";
import { roomsRepository } from "@/lib/repositories/rooms-repository";
import { servicesRepository } from "@/lib/repositories/services-repository";
import { settingsRepository } from "@/lib/repositories/settings-repository";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export async function PublicShell({ children, locale, dictionary }: { children: React.ReactNode; locale: Locale; dictionary: Dictionary }) {
  const [settings, rooms, services] = await Promise.all([
    settingsRepository.get(locale),
    roomsRepository.getAll(locale),
    servicesRepository.getAll(locale),
  ]);

  return (
    <>
      <PublicNavbar dictionary={dictionary} locale={locale} rooms={rooms} services={services} />
      {children}
      <Footer dictionary={dictionary} locale={locale} settings={settings} services={services} />
      <WhatsAppFloating dictionary={dictionary} locale={locale} />
    </>
  );
}
