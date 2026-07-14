"use client";

import { BedDouble, CalendarDays, Search, UserRound } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { PublicRoom } from "@/types/public-content";

const defaultRooms = [
  { slug: "habitacion-ejecutiva", title: "Habitación Ejecutiva" },
  { slug: "suite-premium", title: "Suite Premium" },
  { slug: "habitacion-doble", title: "Habitación Doble" },
  { slug: "suite-familiar", title: "Suite Familiar" },
];

function todayInHonduras() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
}

function tomorrowFrom(value: string) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
}

export function BookingBar({ rooms = [] }: { rooms?: Pick<PublicRoom, "slug" | "title">[] }) {
  const today = useMemo(() => todayInHonduras(), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => tomorrowFrom(today));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState(rooms[0]?.slug ?? defaultRooms[0].slug);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const roomOptions = rooms.length ? rooms : defaultRooms;

  function submit() {
    setError("");
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError("Seleccione una fecha de salida posterior al check-in.");
      return;
    }
    startTransition(() => {
      const params = new URLSearchParams({ room, checkIn, checkOut, adults: String(adults), children: String(children) });
      window.location.href = `/reservar?${params.toString()}`;
    });
  }

  return (
    <div className="hotel-container relative z-20 -mt-12 rounded-[8px] border border-white/60 bg-hotel-ivory/98 p-3 shadow-[0_24px_70px_rgb(0_31_22_/_0.22)] backdrop-blur md:-mt-14">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr_0.8fr_1.15fr_auto]">
        <BarField icon={CalendarDays} label="Check-in">
          <input aria-label="Check-in" className="booking-input" min={today} onChange={(event) => setCheckIn(event.target.value)} type="date" value={checkIn} />
        </BarField>
        <BarField icon={CalendarDays} label="Check-out">
          <input aria-label="Check-out" className="booking-input" min={tomorrowFrom(checkIn)} onChange={(event) => setCheckOut(event.target.value)} type="date" value={checkOut} />
        </BarField>
        <BarField icon={UserRound} label="Adultos">
          <input aria-label="Adultos" className="booking-input" min={1} onChange={(event) => setAdults(Math.max(1, Number(event.target.value)))} type="number" value={adults} />
        </BarField>
        <BarField icon={UserRound} label="Niños">
          <input aria-label="Niños" className="booking-input" min={0} onChange={(event) => setChildren(Math.max(0, Number(event.target.value)))} type="number" value={children} />
        </BarField>
        <BarField icon={BedDouble} label="Habitación">
          <select aria-label="Habitación" className="booking-input" onChange={(event) => setRoom(event.target.value)} value={room}>
            {roomOptions.map((option) => <option key={option.slug} value={option.slug}>{option.title}</option>)}
          </select>
        </BarField>
        <Button className="min-h-16 w-full whitespace-nowrap px-6 text-white xl:w-auto" disabled={isPending} onClick={submit} type="button" variant="forest">
          <Search className="size-4" />{isPending ? "Buscando..." : "Buscar disponibilidad"}
        </Button>
      </div>
      {error ? <p className="mt-3 rounded-[6px] bg-red-50 px-4 py-2 text-sm font-semibold text-red-800" role="alert">{error}</p> : null}
    </div>
  );
}

function BarField({ icon: Icon, label, children }: { icon: typeof CalendarDays; label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-h-16 items-center gap-3 rounded-[8px] border border-hotel-line bg-white px-4 py-3 transition focus-within:border-hotel-gold focus-within:shadow-hotel-soft">
      <Icon className="size-5 shrink-0 text-hotel-gold-700" />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-hotel-gold-700">{label}</span>
        {children}
      </span>
    </label>
  );
}
