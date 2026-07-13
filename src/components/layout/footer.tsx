import { CalendarDays, Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const quickLinks = [
  { label: "Inicio", href: "/" },
  { label: "Habitaciones", href: "/habitaciones" },
  { label: "Servicios", href: "/servicios" },
  { label: "Entorno", href: "/entorno" },
  { label: "Contacto", href: "/contacto" },
];
const services = ["Restaurante", "Piscina", "Jardines", "Gimnasio", "Eventos"].map(
  (label) => ({ label, href: "/servicios" }),
);

export function Footer() {
  return (
    <footer className="hotel-dark-gradient mt-auto text-white">
      <div className="hotel-container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.1fr_1fr]">
        <div>
          <HotelLogo className="size-24" />
          <p className="mt-4 max-w-56 text-sm leading-7 text-white/80">
            Tu refugio en El Progreso, Yoro. Naturaleza, confort y hospitalidad
            en perfecta armonía.
          </p>
          <div className="mt-5 flex gap-3 text-hotel-gold">
            <MessageCircle className="size-5" />
            <Camera className="size-5" />
            <Phone className="size-5" />
          </div>
        </div>
        <FooterColumn title="Enlaces rápidos" items={quickLinks} />
        <FooterColumn title="Servicios" items={services} />
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase">Contacto</h3>
          <div className="space-y-3 text-sm text-white/80">
            <p className="flex gap-3">
              <MapPin className="size-4 shrink-0 text-hotel-gold" />
              {siteConfig.address}
            </p>
            <p className="flex gap-3">
              <Phone className="size-4 shrink-0 text-hotel-gold" />
              {siteConfig.phone}
            </p>
            <p className="flex gap-3">
              <Mail className="size-4 shrink-0 text-hotel-gold" />
              {siteConfig.email}
            </p>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase">Horario</h3>
          <p className="text-sm leading-7 text-white/80">
            Lunes a Domingo
            <br />
            7:00 AM - 10:00 PM
          </p>
          <LinkButton className="mt-5" href="/reservar" variant="gold">
            <CalendarDays className="size-4" />
            Reservar ahora
          </LinkButton>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="hotel-container flex flex-col gap-3 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Hotel Casa Blanca. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-4">
            <span>Términos y Condiciones</span>
            <span>Política de Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase">{title}</h3>
      <ul className="space-y-2 text-sm text-white/80">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}