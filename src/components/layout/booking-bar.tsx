"use client";

import { BedDouble, CalendarDays, Minus, Plus, Search, UserRound } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { pathFor } from "@/i18n/routing";
import type { PublicRoom } from "@/types/public-content";

const fallbackRooms = {
  es: [{ slug: "habitacion-ejecutiva", title: "Habitación Ejecutiva" }, { slug: "suite-premium", title: "Suite Premium" }, { slug: "habitacion-doble", title: "Habitación Doble" }, { slug: "suite-familiar", title: "Suite Familiar" }],
  en: [{ slug: "habitacion-ejecutiva", title: "Executive Room" }, { slug: "suite-premium", title: "Premium Suite" }, { slug: "habitacion-doble", title: "Double Room" }, { slug: "suite-familiar", title: "Family Suite" }],
};

function todayInHonduras() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
}

function tomorrowFrom(value: string) {
  const date = value ? new Date(`${value}T12:00:00`) : new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
}

export function BookingBar({ rooms = [], locale, dictionary }: { rooms?: Pick<PublicRoom, "slug" | "title">[]; locale: Locale; dictionary: Dictionary }) {
  const labels = dictionary.bookingBar;
  const today = useMemo(() => todayInHonduras(), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => tomorrowFrom(today));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState(rooms[0]?.slug ?? fallbackRooms[locale][0].slug);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const roomOptions = rooms.length ? rooms : fallbackRooms[locale];

  function submit() {
    setError("");
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError(labels.invalidDates);
      return;
    }
    startTransition(() => {
      const params = new URLSearchParams({ room, checkIn, checkOut, adults: String(adults), children: String(children) });
      window.location.href = `${pathFor(locale, "book")}?${params.toString()}`;
    });
  }

  return (
    <div className="hotel-container relative z-20 -mt-12 rounded-[8px] border border-white/60 bg-hotel-ivory/98 p-3 shadow-[0_24px_70px_rgb(0_31_22_/_0.22)] backdrop-blur md:-mt-14">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr_0.8fr_1.15fr_auto]">
        <BarField icon={CalendarDays} label={labels.checkIn}><input aria-label={labels.checkIn} className="booking-input" min={today} onChange={(event) => setCheckIn(event.target.value)} type="date" value={checkIn} /></BarField>
        <BarField icon={CalendarDays} label={labels.checkOut}><input aria-label={labels.checkOut} className="booking-input" min={tomorrowFrom(checkIn)} onChange={(event) => setCheckOut(event.target.value)} type="date" value={checkOut} /></BarField>
        <BarStepper decrease={labels.decrease} icon={UserRound} increase={labels.increase} label={labels.adults} min={1} max={10} value={adults} onChange={setAdults} />
        <BarStepper decrease={labels.decrease} icon={UserRound} increase={labels.increase} label={labels.children} min={0} max={6} value={children} onChange={setChildren} />
        <BarField icon={BedDouble} label={labels.room}><select aria-label={labels.room} className="booking-input" onChange={(event) => setRoom(event.target.value)} value={room}>{roomOptions.map((option) => <option key={option.slug} value={option.slug}>{option.title}</option>)}</select></BarField>
        <Button className="min-h-16 w-full whitespace-nowrap px-6 text-white xl:w-auto" disabled={isPending} onClick={submit} type="button" variant="forest"><Search className="size-4" />{isPending ? labels.searching : labels.search}</Button>
      </div>
      {error ? <p className="mt-3 rounded-[6px] bg-red-50 px-4 py-2 text-sm font-semibold text-red-800" role="alert">{error}</p> : null}
    </div>
  );
}

function BarField({ icon: Icon, label, children }: { icon: typeof CalendarDays; label: string; children: React.ReactNode }) {
  return <label className="flex min-h-16 items-center gap-3 rounded-[8px] border border-hotel-line bg-white px-4 py-3 transition focus-within:border-hotel-gold focus-within:shadow-hotel-soft"><Icon className="size-5 shrink-0 text-hotel-gold-700" /><span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-hotel-gold-700">{label}</span>{children}</span></label>;
}

function BarStepper({ icon: Icon, label, min, max, value, onChange, decrease, increase }: { icon: typeof UserRound; label: string; min: number; max: number; value: number; onChange: (value: number) => void; decrease: string; increase: string }) {
  return <div className="flex min-h-16 items-center gap-3 rounded-[8px] border border-hotel-line bg-white px-3 py-2 transition focus-within:border-hotel-gold focus-within:shadow-hotel-soft"><Icon aria-hidden className="size-5 shrink-0 text-hotel-gold-700" /><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-hotel-gold-700">{label}</p><div className="mt-1 flex items-center justify-between gap-2"><button aria-label={`${decrease} ${label}`} className="grid size-8 shrink-0 place-items-center rounded-full border border-hotel-line bg-hotel-ivory text-hotel-forest hover:border-hotel-gold hover:bg-hotel-sage disabled:opacity-45" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} type="button"><Minus aria-hidden className="size-3.5" /></button><output aria-label={label} className="min-w-5 text-center text-sm font-bold text-hotel-ink">{value}</output><button aria-label={`${increase} ${label}`} className="grid size-8 shrink-0 place-items-center rounded-full bg-hotel-forest text-white hover:bg-hotel-forest-800 disabled:opacity-45" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} type="button"><Plus aria-hidden className="size-3.5" /></button></div></div></div>;
}
