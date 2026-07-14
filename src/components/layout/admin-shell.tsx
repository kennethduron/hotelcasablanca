import {
  Bell,
  CalendarDays,
  Hotel,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { HotelLogo } from "@/components/brand/hotel-logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const adminItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Reservaciones", icon: CalendarDays },
  { label: "Calendario", icon: CalendarDays },
  { label: "Habitaciones", icon: Hotel },
  { label: "Disponibilidad", icon: CalendarDays },
  { label: "Huéspedes", icon: Users },
  { label: "Servicios", icon: Settings },
  { label: "Eventos", icon: CalendarDays },
  { label: "Entorno Turístico", icon: LayoutDashboard },
  { label: "Galería", icon: LayoutDashboard },
  { label: "Mensajes", icon: Mail },
  { label: "Reportes", icon: LayoutDashboard },
  { label: "Usuarios", icon: Users },
  { label: "Configuración", icon: Settings },
];

export function AdminShell({ children, unreadMessages = 0 }: { children: React.ReactNode; unreadMessages?: number }) {
  return (
    <div className="min-h-screen bg-hotel-cream text-hotel-ink lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden hotel-dark-gradient p-6 text-white lg:block">
        <HotelLogo className="mx-auto size-28" href="/admin" priority />
        <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-white/75">
          El Progreso, Yoro
        </p>
        <nav className="mt-8 space-y-1">
          {adminItems.map(({ label, icon: Icon }, index) => (
            <div
              className={cn(
                "flex items-center gap-3 rounded-[6px] px-4 py-3 text-sm text-white/85 transition hover:bg-white/10 hover:text-white",
                index === 0 && "bg-white/15 text-white",
              )}
              key={label}
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between border-b border-hotel-line bg-hotel-ivory/95 px-4 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <details className="relative shrink-0 lg:hidden">
              <summary
                aria-label="Abrir menú administrativo"
                className="grid size-10 cursor-pointer list-none place-items-center rounded-[6px] border border-hotel-line bg-white"
              >
                <Menu className="size-5" />
              </summary>
              <nav className="absolute left-0 top-12 z-50 w-64 rounded-[8px] border border-hotel-line bg-hotel-forest p-2 text-white shadow-hotel-card">
                {adminItems.map(({ label, icon: Icon }, index) => (
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm text-white/85",
                      index === 0 && "bg-white/15 text-white",
                    )}
                    key={label}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </nav>
            </details>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold md:text-xl">¡Bienvenido, Administrador!</h1>
              <p className="hidden text-sm text-hotel-muted sm:block">
                Aquí tienes un resumen general de tu hotel.
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <label className="flex h-12 w-72 items-center gap-3 rounded-[8px] border border-hotel-line bg-white px-4 xl:w-80">
              <Search className="size-5 text-hotel-muted" />
              <input
                aria-label="Buscar en el panel administrativo"
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Buscar reservas, huéspedes..."
              />
            </label>
            <div className="relative">
              <Bell className="size-6 text-hotel-forest" />
              {unreadMessages > 0 ? (
                <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              ) : null}
            </div>
            <div className="h-8 w-px bg-hotel-line" />
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Hotel className="size-5 text-hotel-gold-700" />
              Hotel Casa Blanca
            </div>
            <LogoutButton />
          </div>
          <div className="md:hidden"><LogoutButton /></div>
        </header>
        <main className="p-4 sm:p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
