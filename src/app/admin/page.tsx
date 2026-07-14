import type { ReactNode } from "react";
import {
  BedDouble,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  DoorOpen,
  Users,
} from "lucide-react";

import { AdminShell } from "@/components/layout/admin-shell";
import { cn } from "@/lib/utils";
import { createPageMetadata } from "@/lib/metadata";
import { requireAdminSession } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/repositories/hotel-repository";
import type { Reservation } from "@/types/hotel";

const statusLabels: Record<string, string> = {
  pending_review: "Pendiente de revisión",
  awaiting_payment: "En espera de pago",
  confirmed: "Confirmada",
  paid: "Confirmada",
  checked_in: "Check-in realizado",
  checked_out: "Check-out realizado",
  cancelled: "Cancelada",
};

const currency = new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("es-HN", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Tegucigalpa" });

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Administración",
  description: "Panel administrativo de Hotel Casa Blanca.",
  path: "/admin",
  noIndex: true,
});

function formatDate(value: string) {
  if (!value) return "Sin fecha";
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function statusLabel(status: Reservation["status"]) {
  return statusLabels[String(status).toLowerCase()] ?? String(status);
}

export default async function AdminPage() {
  await requireAdminSession();
  const dashboard = await getAdminDashboardData();
  const metrics: Array<{
    label: ReactNode;
    value: string;
    helper: string;
    icon: typeof CalendarCheck;
    tone: "green" | "red";
  }> = [
    { label: <>Reservas hoy</>, value: String(dashboard.metrics.reservationsToday), helper: "Solicitudes y entradas del día", icon: CalendarCheck, tone: "green" },
    { label: <>Check-ins hoy</>, value: String(dashboard.metrics.checkInsToday), helper: "Llegadas programadas", icon: Users, tone: "green" },
    { label: <>Check-outs hoy</>, value: String(dashboard.metrics.checkOutsToday), helper: "Salidas programadas", icon: DoorOpen, tone: "red" },
    { label: <>Ocupación actual</>, value: `${dashboard.metrics.occupancyPercent}%`, helper: "Según reservas confirmadas", icon: BedDouble, tone: "green" },
    { label: <>Ingresos del mes</>, value: currency.format(dashboard.metrics.monthlyRevenue), helper: "Pagos confirmados", icon: CircleDollarSign, tone: "green" },
  ];

  return (
    <AdminShell unreadMessages={dashboard.unreadMessages}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ label, value, helper, icon: Icon, tone }, index) => (
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
            <p className={cn("mt-3 text-sm", tone === "red" ? "text-red-700" : "text-emerald-700")}>{helper}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <article className="rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
          <h2 className="text-lg font-bold">Reservas recientes</h2>
          <div className="mt-5 space-y-4">
            {dashboard.recentReservations.length ? dashboard.recentReservations.map((item) => (
              <div className="flex items-start justify-between gap-3 border-b border-hotel-line pb-4 last:border-0 last:pb-0" key={item.id}>
                <div>
                  <p className="font-semibold">{item.guestName}</p>
                  <p className="text-sm text-hotel-muted">{item.roomName}</p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatDate(item.checkIn)}</p>
                  <span className="mt-1 inline-flex rounded-full bg-hotel-sage px-2 py-1 text-xs font-semibold text-hotel-forest">
                    {statusLabel(item.status)}
                  </span>
                </div>
              </div>
            )) : <p className="text-sm text-hotel-muted">Aún no hay reservas registradas.</p>}
          </div>
        </article>

        <article className="rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
          <h2 className="text-lg font-bold">Habitaciones por estado</h2>
          <div className="mt-5 space-y-4">
            {dashboard.roomStates.length ? dashboard.roomStates.map((item) => (
              <div className="flex items-center justify-between gap-4 border-b border-hotel-line pb-3 last:border-0 last:pb-0" key={item.label}>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-hotel-muted">{item.detail}</p>
                </div>
                <span className={cn("text-xl font-bold", item.color)}>{item.value}</span>
              </div>
            )) : <p className="text-sm text-hotel-muted">No hay habitaciones registradas.</p>}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[8px] border border-hotel-line bg-white p-6 shadow-hotel-soft">
        <h2 className="text-lg font-bold">Actividad reciente</h2>
        <div className="mt-5 space-y-4">
          {dashboard.activity.length ? dashboard.activity.map((item, index) => (
            <div className="flex items-start gap-3" key={`${item}-${index}`}>
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-hotel-sage text-hotel-forest">
                {index < 2 ? <Clock className="size-4" /> : <ClipboardCheck className="size-4" />}
              </span>
              <p className="font-medium">{item}</p>
            </div>
          )) : <p className="text-sm text-hotel-muted">Aún no hay actividad registrada.</p>}
        </div>
      </section>
    </AdminShell>
  );
}