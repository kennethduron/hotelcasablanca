import type { Metadata } from "next";
import { Bell, ShieldCheck, Shirt, Wifi, ConciergeBell } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { LinkButton } from "@/components/ui/button";
import { getServices } from "@/lib/repositories/hotel-repository";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Restaurante, piscina, eventos, gimnasio, jardines y parqueo privado.",
};

const extras = [
  { label: "Wi-Fi de Alta Velocidad", icon: Wifi },
  { label: "Seguridad 24/7", icon: ShieldCheck },
  { label: "Atención Personalizada", icon: Bell },
  { label: "Lavandería", icon: Shirt },
  { label: "Servicio a la Habitación", icon: ConciergeBell },
];

export default async function ServicesPage() {
  const mainServices = await getServices();
  return (
    <main>
      <PageHero
        eyebrow="Nuestros servicios"
        title="Todo lo que necesitas para una estancia perfecta"
        description="Disfruta de instalaciones diseñadas para tu confort, negocios, descanso y experiencias memorables."
        image="https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?auto=format&fit=crop&w=2200&q=90"
        active="Servicios"
      />
      <section className="py-16">
        <div className="hotel-container">
          <SectionHeading eyebrow="Nuestros servicios" title="Comodidad, bienestar y experiencias" description="Descubre todo lo que Hotel Casa Blanca tiene para ofrecerte." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mainServices.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
          <div className="mt-10 grid gap-4 rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 shadow-hotel-soft md:grid-cols-5">
            {extras.map((item) => <div className="flex gap-3 md:border-r md:border-hotel-line md:pr-4" key={item.label}><item.icon className="size-8 shrink-0 text-hotel-forest" /><div><h3 className="text-sm font-bold text-hotel-forest">{item.label}</h3><p className="mt-1 text-xs leading-5 text-hotel-muted">Disponible para huéspedes.</p></div></div>)}
          </div>
        </div>
      </section>
      <section className="hotel-dark-gradient py-14 text-white"><div className="hotel-container flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><h2 className="hotel-serif text-4xl font-bold">Vive una experiencia única en Hotel Casa Blanca</h2><LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton></div></section>
    </main>
  );
}