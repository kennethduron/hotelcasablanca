import { Bell, CalendarDays, Hotel, Menu, Search } from "lucide-react";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { cn } from "@/lib/utils";

const adminItems = [
  "Dashboard",
  "Reservaciones",
  "Calendario",
  "Habitaciones",
  "Disponibilidad",
  "Huespedes",
  "Servicios",
  "Eventos",
  "Entorno Turistico",
  "Galeria",
  "Mensajes",
  "Reportes",
  "Usuarios",
  "Configuracion",
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hotel-cream text-hotel-ink lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden hotel-dark-gradient p-6 text-white lg:block">
        <HotelLogo imageClassName="w-40" />
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
          El Progreso, Yoro
        </p>
        <nav className="mt-8 space-y-1">
          {adminItems.map((item, index) => (
            <a
              className={cn(
                "flex items-center rounded-[6px] px-4 py-3 text-sm text-white/85 hover:bg-white/10",
                index === 0 && "bg-white/15 text-white",
              )}
              href="#"
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-20 items-center justify-between border-b border-hotel-line bg-hotel-ivory px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              aria-label="Abrir menu administrativo"
              className="grid size-10 place-items-center rounded-[6px] border border-hotel-line lg:hidden"
              type="button"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Bienvenido, Administrador</h1>
              <p className="text-sm text-hotel-muted">
                Aqui tienes un resumen general de tu hotel.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <label className="flex h-12 w-80 items-center gap-3 rounded-[8px] border border-hotel-line bg-white px-4">
              <Search className="size-5 text-hotel-muted" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Buscar reservas, huespedes..."
              />
            </label>
            <Bell className="size-6 text-hotel-forest" />
            <div className="h-8 w-px bg-hotel-line" />
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Hotel className="size-5 text-hotel-gold-700" />
              Hotel Casa Blanca
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export const adminQuickActions = [
  { label: "Nueva Reservacion", icon: CalendarDays },
  { label: "Bloquear Fechas", icon: CalendarDays },
  { label: "Reporte de Ingresos", icon: Hotel },
];