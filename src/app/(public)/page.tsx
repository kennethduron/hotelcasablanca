import { ArrowRight, Bell, Car, Leaf, ShieldCheck, Utensils, Wifi } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { TourismMapDynamic } from "@/components/maps/tourism-map-dynamic";
import { LinkButton } from "@/components/ui/button";
import { RoomCard } from "@/components/ui/room-card";
import { destinationsRepository } from "@/lib/repositories/destinations-repository";
import { roomsRepository } from "@/lib/repositories/rooms-repository";
import { servicesRepository } from "@/lib/repositories/services-repository";
import { settingsRepository } from "@/lib/repositories/settings-repository";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Inicio",
  description: "Hotel Casa Blanca, su oasis de descanso en El Progreso, Yoro.",
  path: "/",
});

const icons = [Leaf, ShieldCheck, Wifi, Car, Utensils, Bell];

export default async function HomePage() {
  const [rooms, destinations, services, settings] = await Promise.all([
    roomsRepository.getAll(),
    destinationsRepository.getAll(),
    servicesRepository.getAll(),
    settingsRepository.get(),
  ]);

  return (
    <main>
      <PageHero
        eyebrow="Exclusividad & Naturaleza"
        title="Su oasis de descanso en El Progreso, Yoro"
        description={settings?.slogan ?? "Naturaleza, confort y hospitalidad en perfecta armonía."}
        images={["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=88"]}
        showActions
        bookingRooms={rooms}
      />

      <section className="border-b border-hotel-line bg-hotel-ivory py-10">
        <div className="hotel-container grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {services.slice(0, 6).map((service, index) => {
            const Icon = icons[index] ?? ShieldCheck;
            return (
              <div className="flex items-center gap-3 md:border-r md:border-hotel-line md:pr-4" key={service.slug}>
                <Icon className="size-8 shrink-0 text-hotel-forest" />
                <div>
                  <h3 className="text-xs font-bold uppercase text-hotel-forest">{service.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-hotel-muted">Servicio cálido y dedicado a cada detalle.</p>
                </div>
              </div>
            );
          })}
          {!services.length ? <p className="text-sm text-hotel-muted lg:col-span-6">Los servicios públicos no están disponibles en este momento.</p> : null}
        </div>
      </section>

      <section className="py-14 md:py-16" id="turismo">
        <div className="hotel-container grid gap-9 lg:grid-cols-[0.55fr_1.45fr] lg:items-start xl:grid-cols-[0.62fr_1.38fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-hotel-gold-700">Descubre Honduras</p>
            <h2 className="hotel-serif text-4xl font-bold leading-tight text-hotel-forest md:text-5xl">Explora destinos cerca de nosotros</h2>
            <p className="mt-5 leading-8 text-hotel-muted">Conéctate con los principales atractivos turísticos de Honduras. Selecciona un destino y conoce la distancia y el tiempo estimado desde el hotel.</p>
            <LinkButton className="mt-7" href="/entorno#turismo" variant="forest">Explorar todos los destinos <ArrowRight className="size-4" /></LinkButton>
          </div>
          <TourismMapDynamic destinations={destinations} />
        </div>
      </section>

      <section className="bg-hotel-ivory py-16">
        <div className="hotel-container">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeading align="left" eyebrow="Nuestras habitaciones" title="Descanso para cada ocasión" />
            <LinkButton href="/habitaciones" variant="outline">Ver todas las habitaciones <ArrowRight className="size-4" /></LinkButton>
          </div>
          {rooms.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {rooms.map((room) => <RoomCard compact key={room.id} room={room} />)}
            </div>
          ) : <p className="rounded-[8px] border border-hotel-line bg-white p-6 text-center text-sm text-hotel-muted">Las habitaciones públicas no están disponibles en este momento.</p>}
        </div>
      </section>

      <section className="hotel-dark-gradient text-white">
        <div className="hotel-container grid gap-8 py-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="hotel-serif text-4xl font-bold leading-tight md:text-5xl">Vive una experiencia que nutre cuerpo y alma</h2>
            <p className="mt-4 text-white/80">Reserva directamente con nosotros y obtén los mejores beneficios y tarifas garantizadas.</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}
