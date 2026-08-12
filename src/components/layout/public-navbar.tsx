"use client";

import { CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { LinkButton } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pathFor } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { PublicRoom, PublicService } from "@/types/public-content";

type NavChild = { label: string; href: string };
type NavItem = { href: string; label: string; children?: NavChild[] };

export function PublicNavbar({ locale, dictionary, rooms = [], services = [] }: { locale: Locale; dictionary: Dictionary; rooms?: PublicRoom[]; services?: PublicService[] }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const labels = dictionary.navbar;

  const navItems = useMemo<NavItem[]>(() => [
    { href: pathFor(locale, "home"), label: labels.home },
    { href: pathFor(locale, "rooms"), label: labels.rooms, children: rooms.map((room) => ({ label: room.title, href: `${pathFor(locale, "book")}?room=${room.slug}` })) },
    { href: pathFor(locale, "services"), label: labels.services, children: services.map((service) => ({ label: service.title, href: `${pathFor(locale, "services")}#${service.slug}` })) },
    { href: pathFor(locale, "surroundings"), label: labels.surroundings, children: [
      { label: labels.tourism, href: `${pathFor(locale, "surroundings")}#turismo` },
      { label: labels.interactiveMap, href: `${pathFor(locale, "surroundings")}#mapa` },
      { label: labels.nearbyAttractions, href: `${pathFor(locale, "surroundings")}#atracciones` },
      { label: labels.directions, href: `${pathFor(locale, "contact")}#mapa` },
    ] },
    { href: pathFor(locale, "contact"), label: labels.contact },
  ], [labels, locale, rooms, services]);

  useEffect(() => {
    const click = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setDropdown(null); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setDropdown(null); setMobile(false); } };
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, []);

  return (
    <header className="sticky top-0 z-[1000] bg-hotel-forest-900/98 text-white shadow-lg backdrop-blur" ref={root}>
      <nav aria-label={labels.primaryNavigation} className="hotel-container flex min-h-20 items-center justify-between gap-3 py-2">
        <HotelLogo className="size-16 md:size-18" href={pathFor(locale, "home")} priority />
        <div className="hidden items-center gap-4 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <div className="relative" key={item.href}>
              {item.children?.length ? (
                <button aria-expanded={dropdown === item.href} aria-haspopup="menu" className={cn("flex min-h-16 items-center gap-1 border-b-2 border-transparent text-sm font-bold uppercase hover:text-hotel-gold", pathname === item.href && "border-hotel-gold text-hotel-gold")} onClick={() => setDropdown(dropdown === item.href ? null : item.href)} type="button">{item.label}<ChevronDown aria-hidden className="size-4" /></button>
              ) : <Link className={cn("flex min-h-16 items-center border-b-2 border-transparent text-sm font-bold uppercase hover:text-hotel-gold", pathname === item.href && "border-hotel-gold text-hotel-gold")} href={item.href}>{item.label}</Link>}
              {item.children?.length && dropdown === item.href ? <div className="absolute left-1/2 top-full z-[1100] min-w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-hotel-forest p-2 shadow-hotel-card" role="menu">{item.children.map((child) => <Link className="block rounded px-4 py-3 text-sm text-white hover:bg-white/10 hover:text-hotel-gold" href={child.href} key={child.href} onClick={() => setDropdown(null)} role="menuitem">{child.label}</Link>)}</div> : null}
            </div>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher labels={labels} locale={locale} />
          <LinkButton href={pathFor(locale, "book")} variant="gold"><CalendarDays className="size-4" />{dictionary.common.bookNow}</LinkButton>
        </div>
        <button aria-controls="public-mobile-menu" aria-expanded={mobile} aria-label={mobile ? labels.closeMenu : labels.openMenu} className="grid size-11 place-items-center rounded border border-white/25 lg:hidden" onClick={() => setMobile(!mobile)} type="button">{mobile ? <X /> : <Menu />}</button>
      </nav>
      {mobile ? <div className="border-t border-white/10 bg-hotel-forest lg:hidden" id="public-mobile-menu"><div className="hotel-container max-h-[calc(100vh-5rem)] overflow-y-auto py-4">{navItems.map((item) => item.children?.length ? <details key={item.href}><summary className="flex cursor-pointer list-none items-center justify-between rounded px-3 py-3 text-sm font-bold uppercase">{item.label}<ChevronDown className="size-4" /></summary><div className="mb-2 grid gap-1 pl-4">{item.children.map((child) => <Link className="rounded px-3 py-2 text-sm text-white/85 hover:bg-white/10" href={child.href} key={child.href} onClick={() => setMobile(false)}>{child.label}</Link>)}</div></details> : <Link className="block rounded px-3 py-3 text-sm font-bold uppercase" href={item.href} key={item.href} onClick={() => setMobile(false)}>{item.label}</Link>)}<LinkButton className="mt-3 w-full" href={pathFor(locale, "book")} variant="gold">{dictionary.common.bookNow}</LinkButton><LanguageSwitcher labels={labels} locale={locale} mobile onNavigate={() => setMobile(false)} /></div></div> : null}
    </header>
  );
}
