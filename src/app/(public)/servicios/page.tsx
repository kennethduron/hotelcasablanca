import { Bell, ConciergeBell, ShieldCheck, Shirt, Wifi } from "lucide-react";
import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { LinkButton } from "@/components/ui/button";
import { ServiceCard } from "@/components/ui/service-card";
import { roomsRepository } from "@/lib/repositories/rooms-repository";
import { servicesRepository } from "@/lib/repositories/services-repository";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Servicios",
  description: "Restaurante, piscina, eventos, gimnasio, jardines y parqueo privado.",
  path: "/servicios",
});

const extras = [
  { label: "Wi-Fi de alta velocidad", icon: Wifi },
  { label: "Seguridad 24/7", icon: ShieldCheck },
  { label: "Atención personalizada", icon: Bell },
  { label: "Lavandería", icon: Shirt },
  { label: "Servicio a la habitación", icon: ConciergeBell },
];

export default async function ServicesPage() {
  const [mainServices, rooms] = await Promise.all([servicesRepository.getAll(), roomsRepository.getAll()]);

  return (
    <main>
      <PageHero
        eyebrow="Nuestros servicios"
        title="Todo lo que necesitas para una estancia perfecta"
        description="Disfruta de instalaciones diseñadas para tu confort, negocios, descanso y experiencias memorables."
        images={["https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2200&q=88"]}
        active="Servicios"
        bookingRooms={rooms}
      />
      <section className="py-16">
        <div className="hotel-container">
          <SectionHeading eyebrow="Nuestros servicios" title="Comodidad, bienestar y experiencias" description="Descubre todo lo que Hotel Casa Blanca tiene para ofrecerte." />
          {mainServices.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mainServices.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
          ) : <p className="mt-10 rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 text-center text-sm text-hotel-muted">Los servicios públicos no están disponibles en este momento.</p>}
          <div className="mt-10 grid gap-4 rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 shadow-hotel-soft md:grid-cols-2 lg:grid-cols-5">
            {extras.map((item) => <div className="flex gap-3 lg:border-r lg:border-hotel-line lg:pr-4" key={item.label}><item.icon className="size-8 shrink-0 text-hotel-forest" /><div><h3 className="text-sm font-bold text-hotel-forest">{item.label}</h3><p className="mt-1 text-xs leading-5 text-hotel-muted">Disponible para huéspedes.</p></div></div>)}
          </div>
        </div>
      </section>
      <section className="hotel-dark-gradient py-14 text-white"><div className="hotel-container flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><h2 className="hotel-serif text-4xl font-bold">Vive una experiencia única en Hotel Casa Blanca</h2><LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton></div></section>
    </main>
  );
}
