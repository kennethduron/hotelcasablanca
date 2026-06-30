"use client";

import { Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function WeatherTimeCard() {
  const [time, setTime] = useState("05:57 pm");
  const [date, setDate] = useState("Martes, 20 de mayo de 2026");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("es-HN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Tegucigalpa",
    });
    const dateFormatter = new Intl.DateTimeFormat("es-HN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "America/Tegucigalpa",
    });

    const tick = () => {
      const now = new Date();
      setTime(formatter.format(now).replace("a. m.", "am").replace("p. m.", "pm"));
      setDate(dateFormatter.format(now));
    };

    tick();
    const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <aside className="rounded-[8px] border border-hotel-gold/35 bg-hotel-forest-900/92 p-6 text-center text-white shadow-hotel-card backdrop-blur">
      <Sun className="mx-auto mb-2 size-7 text-hotel-gold" />
      <p className="text-3xl font-bold">29°C</p>
      <p className="text-sm text-white/80">Soleado</p>
      <p className="mt-3 text-sm font-semibold">El Progreso, Yoro</p>
      <div className="my-5 h-px bg-white/15" />
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-hotel-gold">
        Hora local
      </p>
      <p className="hotel-serif mt-2 text-3xl font-semibold">{time}</p>
      <p className="mt-1 text-xs capitalize text-white/70">{date}</p>
    </aside>
  );
}