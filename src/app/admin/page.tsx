import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  DoorOpen,
  Users,
} from "lucide-react";

import { AdminShell, adminQuickActions } from "@/components/layout/admin-shell";
import { cn } from "@/lib/utils";
import { createPageMetadata } from "@/lib/metadata";

const metrics: Array<{
  label: ReactNode;
  value: string;
  change: string;
  icon: typeof CalendarCheck;
  tone: "green" | "red";
}> = [
  { label: <>Reservaciones Hoy</>, value: "8", change: "14% vs ayer", icon: CalendarCheck, tone: "green" },
  { label: <>Check-ins Hoy</>, value: "6", change: "20% vs ayer", icon: Users, tone: "green" },
  { label: <>Check-outs Hoy</>, value: "3", change: "10% vs ayer", icon: DoorOpen, tone: "red" },
  { label: <>Ocupaci&oacute;n Actual</>, value: "72%", change: "8% vs ayer", icon: BedDouble, tone: "green" },
  { label: <>Ingresos del Mes</>, value: "L 328,450", change: "18% vs mes anterior", icon: CircleDollarSign, tone: "green" },
];

const recentReservations: Array<{
  guest: ReactNode;
  room: ReactNode;
  date: string;
  status: ReactNode;
}> = [
  { guest: <>Mar&iacute;a Fernanda L&oacute;pez</>, room: <>Suite Premium</>, date: "20 May 2026", status: <>Confirmada</> },
  { guest: <>Carlos Eduardo Medina</>, room: <>Habitaci&oacute;n Ejecutiva</>, date: "20 May 2026", status: <>Check-in</> },
  { guest: <>Ana Patricia Torres</>, room: <>Habitaci&oacute;n Doble</>, date: "21 May 2026", status: <>Pendiente de revisi&oacute;n</> },
  { guest: <>Jos&eacute; Antonio Rivera</>, room: <>Suite Familiar</>, date: "21 May 2026", status: <>Confirmada</> },
];

const roomStates = [
  { label: "Disponibles", detail: "18 habitaciones", value: "45%", color: "text-emerald-700" },
  { label: "Ocupadas", detail: "26 habitaciones", value: "30%", color: "text-amber-700" },
  { label: "Reservadas", detail: "12 habitaciones", value: "15%", color: "text-blue-700" },
  { label: "Mantenimiento", detail: "4 habitaciones", value: "5%", color: "text-red-700" },
  { label: "Fuera de Servicio", detail: "0 habitaciones", value: "0%", color: "text-hotel-muted" },
];

const activity: ReactNode[] = [
  <>Nueva reservaci&oacute;n realizada por Mar&iacute;a Fernanda L&oacute;pez</>,
  <>Check-in completado: Carlos Eduardo Medina</>,
  <>Nueva consulta de evento corporativo</>,
  <>Pago registrado de L 4,200 por Jos&eacute; Antonio Rivera</>,
  <>Mensaje nuevo de Luc&iacute;a Mart&iacute;nez</>,
];

export const metadata = createPageMetadata({
  title: "Administración",
  description: "Panel administrativo de Hotel Casa Blanca.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <AdminShell>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ label, value, change, icon: Icon, tone }, index) => (
          <article className="rounded-[8px] border border-hotel-line bg-white p-5 shadow-hotel-soft" key={`${index}-${value}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-hotel-muted">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-hotel-ink">{value}</p>
              </div>
              <span className="grid size-14 place-items-center rounded-[8px] bg-hotel-sage text-hotel-forest">
                <Icon className="size-7" />
              </span>
            </div>
            <p className={cn("mt-3 flex items-center gap-1 text-sm", tone === "red" ? "text-red-700" : "text-emerald-700")}>
              <ArrowUpRight className="size-4" /> {change}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr_1fr]">
        <article className="rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Ocupaci&oacute;n de Habitaciones</h2>
            <span className="rounded-full bg-hotel-sage px-3 py-1 text-xs font-bold text-hotel-forest">Este mes</span>
          </div>
          <div className="mt-6 h-64 rounded-[8px] bg-gradient-to-b from-hotel-sage/60 to-white p-5">
            <div className="flex h-full items-end gap-3 border-b border-l border-hotel-line px-2 pb-2">
              {[32, 38, 48, 40, 56, 50, 44, 62, 58, 72, 64, 52, 61, 68, 60].map((height, index) => (
                <div className="flex flex-1 items-end" key={`${height}-${index}`}>
                  <span
                    className="w-full rounded-t bg-hotel-forest"
                    style={{ height: `${height}%` }}
                    title={`${height}%`}
                  />
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
          <h2 className="text-lg font-bold">Reservaciones Recientes</h2>
          <div className="mt-5 space-y-4">
            {recentReservations.map((item, index) => (
              <div className="flex items-start justify-between gap-3 border-b border-hotel-line pb-4 last:border-0 last:pb-0" key={index}>
                <div>
                  <p className="font-semibold">{item.guest}</p>
                  <p className="text-sm text-hotel-muted">{item.room}</p>
                </div>
                <div className="text-right text-sm">
                  <p>{item.date}</p>
                  <span className="mt-1 inline-flex rounded-full bg-hotel-sage px-2 py-1 text-xs font-semibold text-hotel-forest">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
          <h2 className="text-lg font-bold">Habitaciones por Estado</h2>
          <div className="mt-5 space-y-4">
            {roomStates.map((item) => (
              <div className="flex items-center justify-between gap-4 border-b border-hotel-line pb-3 last:border-0 last:pb-0" key={item.label}>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-hotel-muted">{item.detail}</p>
                </div>
                <span className={cn("text-xl font-bold", item.color)}>{item.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <article className="rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
          <h2 className="text-lg font-bold">Actividad Reciente</h2>
          <div className="mt-5 space-y-4">
            {activity.map((item, index) => (
              <div className="flex items-start gap-3" key={index}>
                <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-hotel-sage text-hotel-forest">
                  {index < 2 ? <Clock className="size-4" /> : <ClipboardCheck className="size-4" />}
                </span>
                <div>
                  <p className="font-medium">{item}</p>
                  <p className="text-sm text-hotel-muted">Hace {index + 1}0 min</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {adminQuickActions.map(({ label, helper, icon: Icon }) => (
            <article
              className="flex items-center gap-4 rounded-[8px] border border-hotel-line bg-white p-5 text-left shadow-hotel-soft transition hover:-translate-y-0.5 hover:border-hotel-gold hover:shadow-lg"
              key={label}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-hotel-sage text-hotel-forest">
                <Icon className="size-6" />
              </span>
              <span>
                <span className="block font-bold">{label}</span>
                <span className="text-sm text-hotel-muted">{helper}</span>
              </span>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}