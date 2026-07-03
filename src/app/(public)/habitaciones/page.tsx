import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { LinkButton } from "@/components/ui/button";
import { RoomCard } from "@/components/ui/room-card";
import { getRooms } from "@/lib/repositories/hotel-repository";

export const metadata: Metadata = {
  title: "Habitaciones",
  description: "Habitaciones ejecutivas, dobles y suites en Hotel Casa Blanca.",
};

const filters = ["Todas", "Ejecutivas", "Dobles", "Suites", "Familiares"];

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <main>
      <PageHero
        eyebrow="Habitaciones & Suites"
        title="Descanso para cada ocasión"
        description="Espacios diseñados para su confort, rodeados de naturaleza y equipados con todo lo que necesita."
        image="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2200&q=90"
        active="Habitaciones"
        showWeather={false}
      />
      <section className="py-16">
        <div className="hotel-container">
          <SectionHeading eyebrow="Nuestras habitaciones" title="Elija su espacio ideal" />
          <div className="my-9 flex flex-wrap justify-center gap-2">
            {filters.map((filter, index) => <button className={`min-h-10 rounded-[999px] px-6 py-2 text-xs font-bold uppercase transition ${index === 0 ? "bg-hotel-forest text-white" : "border border-hotel-line bg-white text-hotel-forest hover:border-hotel-gold"}`} key={filter} type="button">{filter}</button>)}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
          <div className="mt-10 flex justify-center">
            <LinkButton href="/reservar" variant="outline">Ver todas las habitaciones <ArrowRight className="size-4" /></LinkButton>
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