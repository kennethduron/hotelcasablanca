import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { LinkButton } from "@/components/ui/button";
import { RoomCard } from "@/components/ui/room-card";
import { roomsRepository } from "@/lib/repositories/rooms-repository";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Habitaciones",
  description: "Habitaciones ejecutivas, dobles y suites en Hotel Casa Blanca.",
  path: "/habitaciones",
});

const filters = ["Todas", "Ejecutivas", "Dobles", "Suites", "Familiares"];

export default async function RoomsPage() {
  const rooms = await roomsRepository.getAll();

  return (
    <main>
      <PageHero
        eyebrow="Habitaciones & Suites"
        title="Descanso para cada ocasión"
        description="Espacios diseñados para su confort, rodeados de naturaleza y equipados con todo lo que necesita."
        images={["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2200&q=88"]}
        active="Habitaciones"
        showWeather={false}
        bookingRooms={rooms}
      />
      <section className="py-16">
        <div className="hotel-container">
          <SectionHeading eyebrow="Nuestras habitaciones" title="Elija su espacio ideal" />
          <div className="my-9 flex flex-wrap justify-center gap-2">
            {filters.map((filter, index) => <span className={`rounded-[999px] px-6 py-2 text-xs font-bold uppercase ${index === 0 ? "bg-hotel-forest text-white" : "border border-hotel-line bg-white text-hotel-forest"}`} key={filter}>{filter}</span>)}
          </div>
          {rooms.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {rooms.map((room) => <div className="scroll-mt-28" id={room.slug} key={room.id}><RoomCard room={room} /></div>)}
            </div>
          ) : <p className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 text-center text-sm text-hotel-muted">Las habitaciones públicas no están disponibles en este momento.</p>}
          <div className="mt-10 flex justify-center">
            <LinkButton href="#habitacion-ejecutiva" variant="outline">Ver todas las habitaciones <ArrowRight className="size-4" /></LinkButton>
          </div>
        </div>
      </section>
      <section className="hotel-dark-gradient py-14 text-white">
        <div className="hotel-container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <h2 className="hotel-serif text-4xl font-bold">Viva una experiencia única en Hotel Casa Blanca</h2>
          <LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton>
        </div>
      </section>
    </main>
  );
}
