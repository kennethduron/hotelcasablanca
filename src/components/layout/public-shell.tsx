import { Footer } from "@/components/layout/footer";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";
import { roomsRepository } from "@/lib/repositories/rooms-repository";
import { servicesRepository } from "@/lib/repositories/services-repository";
import { settingsRepository } from "@/lib/repositories/settings-repository";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [settings, rooms, services] = await Promise.all([
    settingsRepository.get(),
    roomsRepository.getAll(),
    servicesRepository.getAll(),
  ]);

  return (
    <>
      <PublicNavbar rooms={rooms} services={services} />
      {children}
      <Footer settings={settings} services={services} />
      <WhatsAppFloating />
    </>
  );
}
