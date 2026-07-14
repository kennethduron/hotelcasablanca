import "server-only";

import { Resend } from "resend";

import type { Reservation } from "@/types/hotel";

let resend: Resend | null = null;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function formatCurrency(value: number) {
  return `L ${value.toLocaleString("es-HN")}.00`;
}

function getMailSettings() {
  return {
    from: process.env.RESEND_FROM_EMAIL ?? "Hotel Casa Blanca <reservas@casablanca.hn>",
    hotelEmail: process.env.HOTEL_RESERVATIONS_EMAIL ?? "reservas@casablanca.hn",
  };
}

function reservationDetails(reservation: Reservation) {
  return `
    <ul>
      <li><strong>Habitación:</strong> ${escapeHtml(reservation.roomName)}</li>
      <li><strong>Estadía:</strong> ${escapeHtml(reservation.checkIn)} al ${escapeHtml(reservation.checkOut)}</li>
      <li><strong>Huéspedes:</strong> ${reservation.adults} adultos, ${reservation.children} niños</li>
      <li><strong>Total:</strong> ${formatCurrency(reservation.total)}</li>
    </ul>
  `;
}

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
  if (!hasResendConfig()) return { status: "skipped" as const };

  const { from, hotelEmail } = getMailSettings();
  await getResend().emails.send({
    from,
    to: [reservation.guestEmail],
    bcc: [hotelEmail],
    subject: "Recibimos tu solicitud de reserva - Hotel Casa Blanca",
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2a24;line-height:1.6">
        <h1 style="color:#003322">Solicitud recibida</h1>
        <p>Hola ${escapeHtml(reservation.guestName)},</p>
        <p>Recibimos tu solicitud. Nuestro equipo revisará disponibilidad antes de enviarte el enlace de pago.</p>
        ${reservationDetails(reservation)}
        <p><strong>Estado:</strong> Pendiente de revisión</p>
        <p>Esta solicitud no confirma ni bloquea la habitación hasta que el administrador confirme el pago.</p>
        <p>Hotel Casa Blanca<br/>El Progreso, Yoro, Honduras</p>
      </div>
    `,
  });

  return { status: "sent" as const };
}

export async function sendPaymentLinkEmail(reservation: Reservation) {
  if (!hasResendConfig()) return { status: "skipped" as const };
  if (!reservation.paymentLink || new URL(reservation.paymentLink).protocol !== "https:") {
    throw new Error("El enlace de pago debe usar HTTPS.");
  }

  const { from, hotelEmail } = getMailSettings();
  await getResend().emails.send({
    from,
    to: [reservation.guestEmail],
    bcc: [hotelEmail],
    subject: "Enlace de pago de tu reserva - Hotel Casa Blanca",
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2a24;line-height:1.6">
        <h1 style="color:#003322">Reserva aprobada</h1>
        <p>Hola ${escapeHtml(reservation.guestName)},</p>
        <p>Tu solicitud fue revisada. Para continuar, completa el pago desde este enlace seguro:</p>
        <p><a href="${escapeHtml(reservation.paymentLink)}" style="display:inline-block;background:#003322;color:white;padding:12px 18px;text-decoration:none;border-radius:6px">Pagar reserva</a></p>
        ${reservationDetails(reservation)}
        <p>La habitación se bloqueará únicamente cuando el hotel confirme el pago.</p>
      </div>
    `,
  });

  return { status: "sent" as const };
}

export async function sendReservationConfirmedEmail(reservation: Reservation) {
  if (!hasResendConfig()) return { status: "skipped" as const };

  const { from, hotelEmail } = getMailSettings();
  await getResend().emails.send({
    from,
    to: [reservation.guestEmail],
    bcc: [hotelEmail],
    subject: "Reserva confirmada - Hotel Casa Blanca",
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2a24;line-height:1.6">
        <h1 style="color:#003322">Reserva confirmada</h1>
        <p>Hola ${escapeHtml(reservation.guestName)},</p>
        <p>Tu pago fue confirmado y la habitación quedó bloqueada para tu estadía.</p>
        ${reservationDetails(reservation)}
        <p>Te esperamos en Hotel Casa Blanca, El Progreso, Yoro.</p>
      </div>
    `,
  });

  return { status: "sent" as const };
}