"use client";

import { CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicRoom, PublicService } from "@/types/public-content";

type NavChild = { label: string; href: string };
type NavItem = { href: string; label: string; children?: NavChild[] };

const staticEnvironmentChildren = [
  { label: "Turismo", href: "/entorno#turismo" },
  { label: "Mapa interactivo", href: "/entorno#mapa" },
  { label: "Atracciones cercanas", href: "/entorno#atracciones" },
  { label: "Cómo llegar", href: "/contacto#mapa" },
];

export function PublicNavbar({ rooms = [], services = [] }: { rooms?: PublicRoom[]; services?: PublicService[] }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);

  const navItems = useMemo<NavItem[]>(() => [
    { href: "/", label: "Inicio" },
    {
      href: "/habitaciones",
      label: "Habitaciones",
      children: rooms.map((room) => ({ label: room.title, href: `/reservar?room=${room.slug}` })),
    },
    {
      href: "/servicios",
      label: "Servicios",
      children: services.map((service) => ({ label: service.title, href: `/servicios#${service.slug}` })),
    },
    { href: "/entorno", label: "Entorno", children: staticEnvironmentChildren },
    { href: "/contacto", label: "Contacto" },
  ], [rooms, services]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setDropdown(null);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdown(null);
        setMobile(false);
      }
    };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", click);
      document.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[1000] bg-hotel-forest-900/98 text-white shadow-lg backdrop-blur" ref={root}>
      <nav aria-label="Navegación principal" className="hotel-container flex min-h-20 items-center justify-between gap-4 py-2">
        <HotelLogo className="size-16 md:size-18" priority />
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          {navItems.map((item) => (
            <div className="relative" key={item.href}>
              {item.children?.length ? (
                <button aria-expanded={dropdown === item.label} className={cn("flex min-h-16 items-center gap-1 border-b-2 border-transparent text-sm font-bold uppercase hover:text-hotel-gold", pathname === item.href && "border-hotel-gold text-hotel-gold")} onClick={() => setDropdown(dropdown === item.label ? null : item.label)} type="button">
                  {item.label}<ChevronDown className="size-4" />
                </button>
              ) : (
                <Link className={cn("flex min-h-16 items-center border-b-2 border-transparent text-sm font-bold uppercase hover:text-hotel-gold", pathname === item.href && "border-hotel-gold text-hotel-gold")} href={item.href}>{item.label}</Link>
              )}
              {item.children?.length && dropdown === item.label ? (
                <div className="absolute left-1/2 top-full z-[1100] min-w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-hotel-forest p-2 shadow-hotel-card">
                  {item.children.map((child) => (
                    <Link className="block rounded px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-hotel-gold" href={child.href} key={child.href} onClick={() => setDropdown(null)}>{child.label}</Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <LinkButton href="/reservar" variant="gold"><CalendarDays className="size-4" />Reservar ahora</LinkButton>
        </div>
        <button aria-controls="public-mobile-menu" aria-expanded={mobile} aria-label={mobile ? "Cerrar menú" : "Abrir menú"} className="grid size-11 place-items-center rounded border border-white/25 lg:hidden" onClick={() => setMobile(!mobile)} type="button">
          {mobile ? <X /> : <Menu />}
        </button>
      </nav>
      {mobile ? (
        <div className="border-t border-white/10 bg-hotel-forest lg:hidden" id="public-mobile-menu">
          <div className="hotel-container max-h-[calc(100vh-5rem)] overflow-y-auto py-4">
            {navItems.map((item) => item.children?.length ? (
              <details key={item.href}>
                <summary className="flex cursor-pointer list-none items-center justify-between rounded px-3 py-3 text-sm font-bold uppercase">{item.label}<ChevronDown className="size-4" /></summary>
                <div className="mb-2 grid gap-1 pl-4">
                  {item.children.map((child) => <Link className="rounded px-3 py-2 text-sm text-white/85 hover:bg-white/10" href={child.href} key={child.href} onClick={() => setMobile(false)}>{child.label}</Link>)}
                </div>
              </details>
            ) : (
              <Link className="block rounded px-3 py-3 text-sm font-bold uppercase" href={item.href} key={item.href} onClick={() => setMobile(false)}>{item.label}</Link>
            ))}
            <LinkButton className="mt-3 w-full" href="/reservar" variant="gold">Reservar ahora</LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
