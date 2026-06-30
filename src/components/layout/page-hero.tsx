import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { BookingBar } from "@/components/layout/booking-bar";
import { WeatherTimeCard } from "@/components/layout/weather-time-card";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  showWeather?: boolean;
  showActions?: boolean;
  bookingVariant?: "floating" | "below";
  active?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  showWeather = true,
  showActions = false,
  bookingVariant = "floating",
  active,
}: PageHeroProps) {
  return (
    <section className="relative">
      <div className="relative min-h-[520px] overflow-hidden bg-hotel-forest-900 text-white">
        <Image
          alt={title}
          className="object-cover opacity-70"
          fill
          priority
          sizes="100vw"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-hotel-forest-900/55 to-black/15" />
        <div className="hotel-container relative z-10 grid min-h-[520px] items-center gap-10 py-20 lg:grid-cols-[1fr_230px]">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-hotel-gold">
              {eyebrow}
            </p>
            <h1 className="hotel-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">{description}</p>
            {active ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-white/85">
                <Link href="/">Inicio</Link>
                <ChevronRight className="size-4 text-hotel-gold" />
                <span className="text-hotel-gold">{active}</span>
              </div>
            ) : null}
            {showActions ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/reservar" variant="gold">Reservar ahora</LinkButton>
                <LinkButton href="/habitaciones" variant="outline" className="border-white text-white hover:border-hotel-gold hover:bg-hotel-gold hover:text-hotel-forest">
                  Conoce más
                </LinkButton>
              </div>
            ) : null}
          </div>
          {showWeather ? <WeatherTimeCard /> : null}
        </div>
      </div>
      <div className={cn(bookingVariant === "below" && "pt-16")}>
        <BookingBar />
      </div>
    </section>
  );
}