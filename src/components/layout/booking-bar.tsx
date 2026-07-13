import { BedDouble, CalendarDays, UserRound } from "lucide-react";

import { LinkButton } from "@/components/ui/button";

const bookingItems = [
  { label: "Check-in", value: "Seleccionar fecha", icon: CalendarDays },
  { label: "Check-out", value: "Seleccionar fecha", icon: CalendarDays },
  { label: "Huéspedes", value: "2 Adultos, 0 Niños", icon: UserRound },
  { label: "Habitación", value: "Todas las habitaciones", icon: BedDouble },
];

export function BookingBar() {
  return (
    <div className="hotel-container relative z-20 -mt-10 grid gap-0 overflow-hidden rounded-[8px] border border-hotel-line bg-hotel-ivory p-3 shadow-hotel-card md:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto]">
      {bookingItems.map((item) => (
        <div
          className="flex min-h-20 items-center gap-4 border-b border-hotel-line px-4 py-4 md:odd:border-r lg:border-b-0 lg:border-r"
          key={item.label}
        >
          <item.icon className="size-6 shrink-0 text-hotel-forest" />
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-hotel-gold-700">
              {item.label}
            </span>
            <span className="block truncate text-sm font-medium text-hotel-ink">{item.value}</span>
          </span>
        </div>
      ))}
      <LinkButton className="m-1 min-h-14 whitespace-nowrap" href="/reservar" variant="forest">
        Buscar disponibilidad
      </LinkButton>
    </div>
  );
}