import { ArrowRight, Bell, Car, ShieldCheck, Utensils, Wifi, Leaf } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { TourismMapDynamic } from "@/components/maps/tourism-map-dynamic";
import { RoomCard } from "@/components/ui/room-card";
import { LinkButton } from "@/components/ui/button";
import { getDestinations, getRooms } from "@/lib/repositories/hotel-repository";
import { quickBenefits } from "@/data/services";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Hotel Casa Blanca, su oasis de descanso en El Progreso, Yoro.",
};

const icons = [Leaf, ShieldCheck, Wifi, Car, Utensils, Bell];

export default async function HomePage() {
  const [rooms, destinations] = await Promise.all([getRooms(), getDestinations()]);
  return (
    <main>
      <PageHero
        eyebrow="Exclusividad & Naturaleza"
        title="Su oasis de descanso en El Progreso, Yoro"
        description="Naturaleza, confort y hospitalidad en perfecta armonía."
        image="https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?auto=format&fit=crop&w=2200&q=90"
        showActions
      />

      <section className="border-b border-hotel-line bg-hotel-ivory py-10">
        <div className="hotel-container grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {quickBenefits.map((benefit, index) => {
            const Icon = icons[index];
            return (
              <div className="flex items-center gap-3 md:border-r md:border-hotel-line md:pr-4" key={benefit}>
                <Icon className="size-8 shrink-0 text-hotel-forest" />
                <div>
                  <h3 className="text-xs font-bold uppercase text-hotel-forest">{benefit}</h3>
                  <p className="mt-1 text-xs leading-5 text-hotel-muted">Servicio cálido y dedicado a cada detalle.</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16">
        <div className="hotel-container grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-hotel-gold-700">Descubre Honduras</p>
            <h2 className="hotel-serif text-5xl font-bold leading-tight text-hotel-forest">Explora destinos cerca de nosotros</h2>
            <p className="mt-5 leading-8 text-hotel-muted">Conéctate con los principales atractivos turísticos de Honduras. Selecciona un destino y conoce la distancia y el tiempo estimado desde el hotel.</p>
            <LinkButton className="mt-7" href="/entorno" variant="forest">Explorar todos los destinos <ArrowRight className="size-4" /></LinkButton>
          </div>
          <TourismMapDynamic compact destinations={destinations} />
        </div>
      </section>

      <section className="bg-hotel-ivory py-16">
        <div className="hotel-container">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeading align="left" eyebrow="Nuestras habitaciones" title="Descanso para cada ocasión" />
            <LinkButton href="/habitaciones" variant="outline">Ver todas las habitaciones <ArrowRight className="size-4" /></LinkButton>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => <RoomCard compact key={room.id} room={room} />)}
          </div>
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