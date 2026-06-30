"use client";

import { CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio" },
  {
    href: "/habitaciones",
    label: "Habitaciones",
    children: [
      "Habitacion Ejecutiva",
      "Suite Premium",
      "Habitacion Doble",
      "Suite Familiar",
    ],
  },
  {
    href: "/servicios",
    label: "Servicios",
    children: [
      "Restaurante",
      "Eventos y Negocios",
      "Piscina",
      "Jardines Naturales",
      "Gimnasio",
      "Parqueo Privado",
    ],
  },
  {
    href: "/entorno",
    label: "Entorno",
    children: ["Turismo", "Mapa Interactivo", "Atracciones Cercanas", "Como Llegar"],
  },
  { href: "/contacto", label: "Contacto" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-hotel-forest-900/95 text-white shadow-lg shadow-black/10 backdrop-blur">
      <nav className="hotel-container flex h-20 items-center justify-between gap-6">
        <HotelLogo imageClassName="w-24" priority />
        <div className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <div className="group relative" key={item.href}>
                <Link
                  className={cn(
                    "flex h-20 items-center gap-1 border-b-2 border-transparent text-sm font-bold uppercase transition",
                    active && "border-hotel-gold text-hotel-gold",
                  )}
                  href={item.href}
                >
                  {item.label}
                  {item.children ? <ChevronDown className="size-4" /> : null}
                </Link>
                {item.children ? (
                  <div className="invisible absolute left-0 top-full min-w-64 translate-y-2 rounded-[8px] border border-white/10 bg-hotel-forest p-2 opacity-0 shadow-hotel-card transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        className="block rounded-[6px] px-4 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-hotel-gold"
                        href={item.href}
                        key={child}
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="hidden lg:block">
          <LinkButton href="/reservar" variant="gold">
            <CalendarDays className="size-4" />
            Reservar ahora
          </LinkButton>
        </div>
        <button
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
          className="grid size-11 place-items-center rounded-[6px] border border-white/20 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open ? (
        <div className="border-t border-white/10 bg-hotel-forest lg:hidden">
          <div className="hotel-container py-4">
            {navItems.map((item) => (
              <Link
                className="block rounded-[6px] px-3 py-3 text-sm font-bold uppercase text-white/90 hover:bg-white/10"
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <LinkButton className="mt-3 w-full" href="/reservar" variant="gold">
              <CalendarDays className="size-4" />
              Reservar ahora
            </LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}