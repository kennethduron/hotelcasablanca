import { Camera, Leaf, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { TourismMapDynamic } from "@/components/maps/tourism-map-dynamic";
import { LinkButton } from "@/components/ui/button";
import { destinationsRepository } from "@/lib/repositories/destinations-repository";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Entorno",
  description: "Turismo, rutas y atracciones cerca de Hotel Casa Blanca en Yoro.",
  path: "/entorno",
});

const benefits = [
  { title: "Ubicación estratégica", icon: MapPin, text: "A solo minutos del centro de El Progreso y con fácil acceso a las principales vías." },
  { title: "Naturaleza abundante", icon: Leaf, text: "Rodeado de montañas, ríos y paisajes naturales que invitan al descanso." },
  { title: "Turismo cercano", icon: Camera, text: "Playas, parques, sitios históricos y pueblos encantadores a poca distancia." },
  { title: "Cultura y tradición", icon: Users, text: "Descubre la calidez de nuestra gente y la riqueza cultural de Yoro." },
];

export default async function EnvironmentPage() {
  const destinations = await destinationsRepository.getAll();

  return (
    <main>
      <PageHero
        eyebrow="Nuestro entorno"
        title="Naturaleza, cultura y aventura te esperan"
        description="Descubre la belleza de El Progreso, Yoro y sus alrededores. Un destino lleno de experiencias únicas para todos los gustos."
        images={["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=88", "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=2200&q=88"]}
        active="Entorno"
      />
      <section className="py-16" id="turismo">
        <div className="hotel-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading align="left" eyebrow="Nuestro entorno" title="Un lugar privilegiado en el corazón de Yoro" description="Hotel Casa Blanca se encuentra estratégicamente ubicado en El Progreso, Yoro, rodeado de naturaleza, historia y atracciones turísticas que hacen de su estancia una experiencia inolvidable." />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {benefits.map((benefit) => <div className="border-hotel-line text-center md:border-r md:px-4" key={benefit.title}><div className="mx-auto grid size-16 place-items-center rounded-full bg-hotel-sage text-hotel-forest"><benefit.icon className="size-8" /></div><h3 className="mt-4 text-sm font-bold text-hotel-forest">{benefit.title}</h3><p className="mt-2 text-xs leading-6 text-hotel-muted">{benefit.text}</p></div>)}
          </div>
        </div>
      </section>
      <section className="bg-hotel-ivory py-16" id="atracciones">
        <div className="hotel-container">
          <SectionHeading align="left" eyebrow="Destinos destacados" title="Explora lo mejor de Honduras" description="Desde playas paradisíacas hasta sitios históricos y naturales impresionantes." />
          <div className="mt-8 scroll-mt-28" id="mapa"><TourismMapDynamic destinations={destinations} /></div>
          {destinations.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {destinations.map((destination) => <article className="overflow-hidden rounded-[8px] border border-hotel-line bg-white shadow-hotel-soft" key={destination.id}><Image alt={destination.title} className="h-44 w-full object-cover" height={220} src={destination.image} width={420} /><div className="p-5"><h3 className="hotel-serif text-2xl font-bold text-hotel-forest">{destination.title}</h3><p className="text-sm text-hotel-muted">Honduras</p><p className="mt-3 text-sm leading-7 text-hotel-muted">{destination.description}</p><div className="mt-4 flex justify-between gap-4 text-sm"><strong>{destination.estimatedDistance}</strong><strong>{destination.estimatedTime}</strong></div><LinkButton className="mt-5 w-full" href="#mapa" variant="forest">Ver detalles / Ver ruta</LinkButton></div></article>)}
            </div>
          ) : <p className="mt-10 rounded-[8px] border border-hotel-line bg-white p-6 text-center text-sm text-hotel-muted">Los destinos públicos no están disponibles en este momento.</p>}
        </div>
      </section>
    </main>
  );
}
