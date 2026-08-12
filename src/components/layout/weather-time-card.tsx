"use client";

import { Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { intlLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function WeatherTimeCard({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  useEffect(() => {
    const timeFormatter = new Intl.DateTimeFormat(intlLocale(locale), { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/Tegucigalpa" });
    const dateFormatter = new Intl.DateTimeFormat(intlLocale(locale), { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "America/Tegucigalpa" });
    const tick = () => { const now = new Date(); setTime(timeFormatter.format(now)); setDate(dateFormatter.format(now)); };
    tick();
    const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  }, [locale]);
  return <aside className="rounded-[8px] border border-hotel-gold/35 bg-hotel-forest-900/92 p-6 text-center text-white shadow-hotel-card backdrop-blur"><Sun className="mx-auto mb-2 size-7 text-hotel-gold" /><p className="text-3xl font-bold">29°C</p><p className="text-sm text-white/80">{dictionary.weather.sunny}</p><p className="mt-3 text-sm font-semibold">El Progreso, Yoro</p><div className="my-5 h-px bg-white/15" /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-hotel-gold">{dictionary.weather.localTime}</p><p className="hotel-serif mt-2 text-3xl font-semibold">{time}</p><p className="mt-1 text-xs text-white/70">{date}</p></aside>;
}
