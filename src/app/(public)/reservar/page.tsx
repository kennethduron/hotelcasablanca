import type { Metadata } from "next";

import { ReservationWizard } from "@/components/reservations/reservation-wizard";

export const metadata: Metadata = {
  title: "Reservar",
  description: "Solicita una reserva en Hotel Casa Blanca. La reserva queda pendiente de revisión.",
};

export default function ReservePage() {
  return (
    <main className="bg-hotel-cream">
      <section className="border-b border-hotel-line bg-hotel-ivory py-10">
        <div className="hotel-container">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-hotel-gold-700">Reserva</p>
          <h1 className="hotel-serif mt-3 text-5xl font-bold text-hotel-forest">Confirma tu reserva</h1>
          <p className="mt-3 max-w-2xl text-hotel-muted">Revisa los detalles de tu estancia y completa tu solicitud. Nuestro equipo la validará antes de enviar el link de pago.</p>
        </div>
      </section>
      <ReservationWizard />
    </main>
  );
}