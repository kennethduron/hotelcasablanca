import { BedDouble, CalendarDays, UserRound } from "lucide-react";

import { LinkButton } from "@/components/ui/button";

const bookingItems = [
  { label: "Check-in", value: "24 Mayo 2026", icon: CalendarDays },
  { label: "Check-out", value: "25 Mayo 2026", icon: CalendarDays },
  { label: "Huespedes", value: "2 Adultos, 0 Ninos", icon: UserRound },
  { label: "Habitacion", value: "Todas las habitaciones", icon: BedDouble },
];

export function BookingBar() {
  return (
    <form className="hotel-container -mt-10 relative z-20 grid gap-0 overflow-hidden rounded-[8px] border border-hotel-line bg-hotel-ivory p-3 shadow-hotel-card lg:grid-cols-[repeat(4,1fr)_auto]">
      {bookingItems.map((item) => (
        <label
          className="flex items-center gap-4 border-b border-hotel-line px-4 py-4 lg:border-b-0 lg:border-r"
          key={item.label}
        >
          <item.icon className="size-6 shrink-0 text-hotel-forest" />
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-hotel-gold-700">
              {item.label}
            </span>
            <span className="text-sm font-medium text-hotel-ink">{item.value}</span>
          </span>
        </label>
      ))}
      <LinkButton className="m-1 h-auto min-h-14" href="/reservar" variant="forest">
        Buscar disponibilidad
      </LinkButton>
    </form>
  );
}