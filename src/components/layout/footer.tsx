import { CalendarDays, Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { PublicService, PublicSettings } from "@/types/public-content";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Habitaciones", href: "/habitaciones" },
  { label: "Servicios", href: "/servicios" },
  { label: "Entorno", href: "/entorno" },
  { label: "Contacto", href: "/contacto" },
];

export function Footer({ settings, services = [] }: { settings: PublicSettings | null; services?: PublicService[] }) {
  const contact = {
    address: settings?.address ?? siteConfig.address,
    phone: settings?.phone ?? siteConfig.phone,
    email: settings?.email ?? siteConfig.email,
    slogan: settings?.slogan ?? "Tu refugio en El Progreso, Yoro. Naturaleza, confort y hospitalidad en perfecta armonía.",
    checkIn: settings?.checkInTime ?? siteConfig.checkIn,
    checkOut: settings?.checkOutTime ?? siteConfig.checkOut,
  };
  const serviceLinks = services.slice(0, 5).map((service) => ({ label: service.title, href: `/servicios#${service.slug}` }));

  return (
    <footer className="hotel-dark-gradient mt-auto text-white">
      <div className="hotel-container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr_1fr]">
        <div>
          <HotelLogo className="size-24" />
          <p className="mt-4 max-w-56 text-sm leading-7 text-white/80">{contact.slogan}</p>
          <div className="mt-5 flex gap-3 text-hotel-gold">
            <MessageCircle className="size-5" />
            <Camera className="size-5" />
            <Phone className="size-5" />
          </div>
        </div>
        <FooterColumn title="Enlaces rápidos" items={quickLinks} />
        <FooterColumn title="Servicios" items={serviceLinks} />
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase">Contacto</h3>
          <div className="space-y-3 text-sm text-white/80">
            <p className="flex gap-3"><MapPin className="size-4 shrink-0 text-hotel-gold" />{contact.address}</p>
            <p className="flex gap-3"><Phone className="size-4 shrink-0 text-hotel-gold" />{contact.phone}</p>
            <p className="flex gap-3"><Mail className="size-4 shrink-0 text-hotel-gold" />{contact.email}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase">Horario</h3>
          <p className="text-sm leading-7 text-white/80">
            Check-in: {contact.checkIn}
            <br />
            Check-out: {contact.checkOut}
          </p>
          <LinkButton className="mt-5" href="/reservar" variant="gold"><CalendarDays className="size-4" />Reservar ahora</LinkButton>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="hotel-container flex flex-col gap-3 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hotel Casa Blanca. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-4">
            <span>Términos y condiciones</span>
            <span>Política de privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase">{title}</h3>
      {items.length ? (
        <ul className="space-y-2 text-sm text-white/80">
          {items.map((item) => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}
        </ul>
      ) : <p className="text-sm text-white/70">Contenido no disponible.</p>}
    </div>
  );
}
