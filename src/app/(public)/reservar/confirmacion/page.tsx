import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Solicitud recibida",
  description: "Confirmación de recepción de solicitud de reserva.",
};

export default function ReservationConfirmationPage() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-16">
      <section className="max-w-2xl rounded-[8px] border border-hotel-line bg-hotel-ivory p-8 text-center shadow-hotel-card">
        <CheckCircle2 className="mx-auto size-16 text-hotel-forest" />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-hotel-gold-700">Solicitud recibida</p>
        <h1 className="hotel-serif mt-3 text-4xl font-bold text-hotel-forest md:text-5xl">Gracias por contactarnos</h1>
        <p className="mt-4 leading-8 text-hotel-muted">
          Tu solicitud quedó como pendiente de revisión. El equipo de Hotel Casa Blanca revisará disponibilidad y te contactará con el siguiente paso.
        </p>
        <p className="mt-4 rounded-[8px] bg-hotel-sage/60 px-4 py-3 text-sm font-semibold text-hotel-forest">
          La habitación no queda bloqueada hasta que el administrador confirme el pago.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/" variant="forest">Volver al inicio</LinkButton>
          <LinkButton href="/contacto" variant="outline">Contactar al hotel</LinkButton>
        </div>
      </section>
    </main>
  );
}