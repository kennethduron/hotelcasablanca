import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import type { Metadata } from "next";

import { createContactMessageAction } from "@/app/(public)/contacto/actions";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { TourismMapDynamic } from "@/components/maps/tourism-map-dynamic";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta a Hotel Casa Blanca en El Progreso, Yoro.",
};

const contactItems = [
  { label: "Ubicación", value: siteConfig.address, icon: MapPin },
  { label: "Teléfono", value: siteConfig.phone, icon: Phone },
  { label: "Correo electrónico", value: siteConfig.email, icon: Mail },
  { label: "WhatsApp", value: siteConfig.whatsapp, icon: MessageCircle },
  { label: "Horario de atención", value: "Lunes a Domingo · 7:00 AM - 10:00 PM", icon: Clock },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contáctanos"
        title="Estamos aquí para ti"
        description="Será un placer atenderte y ayudarte a planificar una experiencia inolvidable en Hotel Casa Blanca."
        image="https://images.unsplash.com/photo-1601919051950-bb9f3ffb3fee?auto=format&fit=crop&w=2200&q=90"
        active="Contacto"
        showWeather={false}
      />
      <section className="py-16">
        <div className="hotel-container">
          <SectionHeading eyebrow="Contacto" title="Ponte en contacto con nosotros" description="Estamos listos para atender tus consultas, reservas o cualquier solicitud especial." />
          <div className="mt-10 grid gap-8 xl:grid-cols-[0.75fr_1fr_0.95fr]">
            <aside className="space-y-5">
              <h2 className="hotel-serif text-3xl font-bold text-hotel-forest">Información de contacto</h2>
              {contactItems.map((item) => <div className="flex gap-4" key={item.label}><div className="grid size-14 shrink-0 place-items-center rounded-[8px] bg-hotel-forest text-hotel-gold"><item.icon className="size-6" /></div><div><h3 className="font-bold text-hotel-forest">{item.label}</h3><p className="mt-1 text-sm leading-6 text-hotel-muted">{item.value}</p></div></div>)}
            </aside>
            <form action={createContactMessageAction} className="rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 shadow-hotel-soft">
              <h2 className="hotel-serif mb-5 text-3xl font-bold text-hotel-forest">Envíanos un mensaje</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Nombre completo" name="name" placeholder="Tu nombre" />
                <Input label="Correo electrónico" name="email" placeholder="Tu correo" />
                <Input label="Teléfono" name="phone" placeholder="Tu teléfono" />
                <Input label="Asunto" name="subject" placeholder="¿En qué podemos ayudarte?" />
              </div>
              <label className="mt-4 block text-sm font-medium text-hotel-ink">Mensaje<textarea className="mt-2 h-36 w-full rounded-[6px] border border-hotel-line bg-white p-3 outline-none transition focus:border-hotel-gold" name="message" placeholder="Escribe tu mensaje aquí..." /></label>
              <Button className="mt-5 w-full" type="submit" variant="forest">Enviar mensaje <Send className="size-4" /></Button>
            </form>
            <TourismMapDynamic compact />
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({ label, placeholder, name }: { label: string; placeholder: string; name: string }) {
  return <label className="text-sm font-medium text-hotel-ink">{label}<input className="mt-2 h-12 w-full rounded-[6px] border border-hotel-line bg-white px-3 outline-none transition focus:border-hotel-gold" name={name} placeholder={placeholder} /></label>;
}