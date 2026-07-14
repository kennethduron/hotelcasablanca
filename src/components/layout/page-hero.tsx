"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BookingBar } from "@/components/layout/booking-bar";
import { WeatherTimeCard } from "@/components/layout/weather-time-card";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicRoom } from "@/types/public-content";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  showWeather?: boolean;
  showActions?: boolean;
  bookingVariant?: "floating" | "below";
  active?: string;
  bookingRooms?: Pick<PublicRoom, "slug" | "title">[];
}

export function PageHero({ eyebrow, title, description, image, images, showWeather = true, showActions = false, bookingVariant = "floating", active, bookingRooms = [] }: PageHeroProps) {
  const slides = images?.length ? images.slice(0, 4) : image ? [image] : [];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || !visible || slides.length < 2) return;
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, visible, slides.length]);

  const move = (delta: number) => setCurrent((value) => (value + delta + slides.length) % slides.length);

  return (
    <section aria-label={title} className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => { touch.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touch.current === null) return; const delta = (event.changedTouches[0]?.clientX ?? touch.current) - touch.current; if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1); touch.current = null; }}>
      <div className="relative min-h-[620px] overflow-hidden bg-hotel-forest-900 text-white md:min-h-[680px] xl:min-h-[min(850px,92vh)]">
        {slides.map((src, index) => (
          <Image
            alt=""
            aria-hidden
            className={cn("object-cover transition-opacity duration-1000 ease-out", index === current ? "opacity-80" : "opacity-0")}
            fill
            key={src}
            loading={index === 0 ? "eager" : "lazy"}
            preload={index === 0}
            sizes="100vw"
            src={src}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_20_14/.88),rgb(0_47_34/.62)_48%,rgb(0_0_0/.18)),linear-gradient(180deg,rgb(0_0_0/.35),transparent_32%,rgb(0_0_0/.42))]" />
        <div className="hotel-container relative z-10 grid min-h-[620px] items-center gap-10 pb-28 pt-28 md:min-h-[680px] md:pt-32 xl:min-h-[min(850px,92vh)] lg:grid-cols-[1fr_250px]">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-hotel-gold">{eyebrow}</p>
            <h1 className="hotel-serif max-w-4xl text-5xl font-bold leading-[0.96] sm:text-6xl md:text-7xl xl:text-8xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/92 md:text-xl">{description}</p>
            {active ? <div className="mt-7 flex items-center gap-2 text-sm text-white/85"><Link href="/">Inicio</Link><ChevronRight className="size-4 text-hotel-gold" /><span className="text-hotel-gold">{active}</span></div> : null}
            {showActions ? <div className="mt-9 flex flex-col gap-3 sm:flex-row"><LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton><LinkButton href="/habitaciones" variant="outlineLight">Conoce más</LinkButton></div> : null}
          </div>
          {showWeather ? <WeatherTimeCard /> : null}
        </div>
        {slides.length > 1 ? <><button aria-label="Imagen anterior" className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur transition hover:bg-white hover:text-hotel-forest" onClick={() => move(-1)} type="button"><ChevronLeft /></button><button aria-label="Imagen siguiente" className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/35 text-white backdrop-blur transition hover:bg-white hover:text-hotel-forest" onClick={() => move(1)} type="button"><ChevronRight /></button><div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-28">{slides.map((_, index) => <button aria-label={`Mostrar imagen ${index + 1}`} aria-current={index === current} className={cn("h-2.5 rounded-full border border-white/80 transition-all", index === current ? "w-9 bg-hotel-gold" : "w-2.5 bg-black/35 hover:bg-white/70")} key={index} onClick={() => setCurrent(index)} type="button" />)}</div></> : null}
      </div>
      <div className={cn(bookingVariant === "below" && "pt-16")}><BookingBar rooms={bookingRooms} /></div>
    </section>
  );
}
