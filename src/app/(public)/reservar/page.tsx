import type { Metadata } from "next";

import { ReservationWizard } from "@/components/reservations/reservation-wizard";
import { getRooms } from "@/lib/repositories/hotel-repository";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Reservar",
  description: "Solicita una reserva en Hotel Casa Blanca. La reserva queda pendiente de revisión.",
  path: "/reservar",
});

export default async function ReservePage({ searchParams }: { searchParams: Promise<{ room?: string; checkIn?: string; checkOut?: string; adults?: string; children?: string }> }) {
  const { room, checkIn, checkOut, adults, children } = await searchParams;
  const rooms = await getRooms();
  const initialRoomId = rooms.some((item) => item.id === room) ? room : rooms[0]?.id;

  return (
    <main className="bg-hotel-cream">
      <section className="border-b border-hotel-line bg-hotel-ivory py-12 md:py-16">
        <div className="hotel-container">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-hotel-gold-700">Reserva</p>
          <h1 className="hotel-serif mt-3 text-5xl font-bold text-hotel-forest md:text-6xl">Confirma tu reserva</h1>
          <p className="mt-3 max-w-2xl leading-7 text-hotel-muted">Revisa los detalles de tu estancia y completa tu solicitud. Nuestro equipo la validará antes de enviar el link de pago.</p>
        </div>
      </section>
      <ReservationWizard rooms={rooms} initialRoomId={initialRoomId} initialCheckIn={checkIn} initialCheckOut={checkOut} initialAdults={Number(adults) || 2} initialChildren={Number(children) || 0} />
    </main>
  );
}
