"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookingBar } from "@/components/layout/booking-bar";
import { WeatherTimeCard } from "@/components/layout/weather-time-card";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeroProps { eyebrow: string; title: string; description: string; image?: string; images?: string[]; showWeather?: boolean; showActions?: boolean; bookingVariant?: "floating" | "below"; active?: string }
export function PageHero({ eyebrow, title, description, image, images, showWeather = true, showActions = false, bookingVariant = "floating", active }: PageHeroProps) {
  const slides = images?.length ? images.slice(0, 4) : image ? [image] : [];
  const [current, setCurrent] = useState(0); const [paused, setPaused] = useState(false); const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches); const touch = useRef<number | null>(null);
  useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(media.matches); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  useEffect(() => { if (paused || reducedMotion || slides.length < 2) return; const timer = window.setInterval(() => setCurrent((value) => (value + 1) % slides.length), 4000); return () => window.clearInterval(timer); }, [paused, reducedMotion, slides.length]);
  const move = (delta: number) => setCurrent((value) => (value + delta + slides.length) % slides.length);
  return <section className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => { touch.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touch.current === null) return; const delta = (event.changedTouches[0]?.clientX ?? touch.current) - touch.current; if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1); touch.current = null; }}>
    <div className="relative min-h-[520px] overflow-hidden bg-hotel-forest-900 text-white">
      {slides.map((src, index) => <Image alt="" aria-hidden className={cn("object-cover transition-opacity duration-1000", index === current ? "opacity-70" : "opacity-0")} fill key={src} priority={index === 0} sizes="100vw" src={src} />)}
      <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-hotel-forest-900/55 to-black/15" />
      <div className="hotel-container relative z-10 grid min-h-[520px] items-center gap-10 py-20 lg:grid-cols-[1fr_230px]">
        <div className="max-w-3xl"><p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-hotel-gold">{eyebrow}</p><h1 className="hotel-serif text-4xl font-bold leading-[0.98] sm:text-5xl md:text-7xl">{title}</h1><p className="mt-6 max-w-xl text-base leading-8 text-white/90 md:text-lg">{description}</p>
          {active ? <div className="mt-6 flex items-center gap-2 text-sm text-white/85"><Link href="/">Inicio</Link><ChevronRight className="size-4 text-hotel-gold" /><span className="text-hotel-gold">{active}</span></div> : null}
          {showActions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row"><LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton><LinkButton className="border-white text-white hover:border-hotel-gold hover:bg-hotel-gold hover:text-hotel-forest" href="/habitaciones" variant="outline">Conoce más</LinkButton></div> : null}
        </div>{showWeather ? <WeatherTimeCard /> : null}
      </div>
      {slides.length > 1 ? <><button aria-label="Imagen anterior" className="absolute left-3 top-1/2 z-20 grid size-10 place-items-center rounded-full bg-black/35 text-white hover:bg-black/60" onClick={() => move(-1)} type="button"><ChevronLeft /></button><button aria-label="Imagen siguiente" className="absolute right-3 top-1/2 z-20 grid size-10 place-items-center rounded-full bg-black/35 text-white hover:bg-black/60" onClick={() => move(1)} type="button"><ChevronRight /></button><div className="absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 gap-2">{slides.map((_, index) => <button aria-label={`Mostrar imagen ${index + 1}`} aria-current={index === current} className={cn("size-2.5 rounded-full border border-white", index === current ? "bg-hotel-gold" : "bg-black/30")} key={index} onClick={() => setCurrent(index)} type="button" />)}</div></> : null}
    </div><div className={cn(bookingVariant === "below" && "pt-16")}><BookingBar /></div>
  </section>;
}