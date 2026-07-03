import { Resend } from "resend";

import type { Reservation } from "@/types/hotel";

let resend: Resend | null = null;

export function hasResendConfig() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend no está configurado. Define RESEND_API_KEY.");
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

export async function sendReservationReceivedEmail(reservation: Reservation) {
  if (!hasResendConfig()) {
    return { status: "skipped" as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Hotel Casa Blanca <reservas@casablanca.hn>";
  const hotelEmail = process.env.HOTEL_RESERVATIONS_EMAIL ?? "reservas@casablanca.hn";
  const currencyTotal = `L ${reservation.total.toLocaleString("es-HN")}.00`;
  const stay = `${reservation.checkIn} al ${reservation.checkOut}`;

  await getResend().emails.send({
    from,
    to: [reservation.guestEmail],
    bcc: [hotelEmail],
    subject: "Recibimos tu solicitud de reserva - Hotel Casa Blanca",
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2a24;line-height:1.6">
        <h1 style="color:#003322">Solicitud recibida</h1>
        <p>Hola ${reservation.guestName},</p>
        <p>Recibimos tu solicitud para ${reservation.roomName}. Nuestro equipo revisará disponibilidad antes de enviarte el enlace de pago.</p>
        <ul>
          <li><strong>Estadía:</strong> ${stay}</li>
          <li><strong>Huéspedes:</strong> ${reservation.adults} adultos, ${reservation.children} niños</li>
          <li><strong>Total estimado:</strong> ${currencyTotal}</li>
          <li><strong>Estado:</strong> Pendiente de revisión</li>
        </ul>
        <p>Esta solicitud no confirma ni bloquea la habitación hasta que el administrador confirme el pago.</p>
        <p>Hotel Casa Blanca<br/>El Progreso, Yoro, Honduras</p>
      </div>
    `,
  });

  return { status: "sent" as const };
}