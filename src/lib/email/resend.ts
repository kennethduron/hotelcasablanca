import "server-only";

import { Resend } from "resend";

import { formatCurrency } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import type { Reservation } from "@/types/hotel";

let resend: Resend | null = null;
const copy = {
  es: { room: "Habitación", stay: "Estadía", guests: "Huéspedes", adults: "adultos", children: "niños", total: "Total", receivedSubject: "Recibimos tu solicitud de reserva - Hotel Casa Blanca", receivedTitle: "Solicitud recibida", hello: "Hola", received: "Recibimos tu solicitud. Nuestro equipo revisará disponibilidad antes de enviarte el enlace de pago.", status: "Estado", pending: "Pendiente de revisión", notConfirmed: "Esta solicitud no confirma ni bloquea la habitación hasta que el administrador confirme el pago.", paymentSubject: "Enlace de pago de tu reserva - Hotel Casa Blanca", approved: "Reserva aprobada", paymentIntro: "Tu solicitud fue revisada. Para continuar, completa el pago desde este enlace seguro:", pay: "Pagar reserva", held: "La habitación se bloqueará únicamente cuando el hotel confirme el pago.", confirmedSubject: "Reserva confirmada - Hotel Casa Blanca", confirmed: "Reserva confirmada", confirmedIntro: "Tu pago fue confirmado y la habitación quedó bloqueada para tu estadía.", welcome: "Te esperamos en Hotel Casa Blanca, El Progreso, Yoro." },
  en: { room: "Room", stay: "Stay", guests: "Guests", adults: "adults", children: "children", total: "Total", receivedSubject: "We received your reservation request - Hotel Casa Blanca", receivedTitle: "Request received", hello: "Hello", received: "We received your request. Our team will review availability before sending a payment link.", status: "Status", pending: "Pending review", notConfirmed: "This request does not confirm or hold the room until the hotel confirms payment.", paymentSubject: "Your reservation payment link - Hotel Casa Blanca", approved: "Reservation approved", paymentIntro: "Your request has been reviewed. To continue, complete payment using this secure link:", pay: "Pay for your stay", held: "The room will be held only after the hotel confirms payment.", confirmedSubject: "Reservation confirmed - Hotel Casa Blanca", confirmed: "Reservation confirmed", confirmedIntro: "Your payment has been confirmed and the room is now held for your stay.", welcome: "We look forward to welcoming you to Hotel Casa Blanca in El Progreso, Yoro." },
};

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!); }
function reservationLocale(reservation: Reservation): Locale { return reservation.locale === "en" ? "en" : "es"; }
function getMailSettings() { return { from: process.env.RESEND_FROM_EMAIL ?? "Hotel Casa Blanca <reservas@casablanca.hn>", hotelEmail: process.env.HOTEL_RESERVATIONS_EMAIL ?? "reservas@casablanca.hn" }; }
function reservationDetails(reservation: Reservation, locale: Locale) { const t = copy[locale]; return `<ul><li><strong>${t.room}:</strong> ${escapeHtml(reservation.roomName)}</li><li><strong>${t.stay}:</strong> ${escapeHtml(reservation.checkIn)} – ${escapeHtml(reservation.checkOut)}</li><li><strong>${t.guests}:</strong> ${reservation.adults} ${t.adults}, ${reservation.children} ${t.children}</li><li><strong>${t.total}:</strong> ${formatCurrency(reservation.total, locale)}</li></ul>`; }
function shell(content: string) { return `<div style="font-family:Arial,sans-serif;color:#1f2a24;line-height:1.6">${content}</div>`; }

export function hasResendConfig() { return Boolean(process.env.RESEND_API_KEY); }
export function getResend() { if (!process.env.RESEND_API_KEY) throw new Error("Resend is not configured."); if (!resend) resend = new Resend(process.env.RESEND_API_KEY); return resend; }

export async function sendReservationReceivedEmail(reservation: Reservation) {
  if (!hasResendConfig()) return { status: "skipped" as const };
  const locale = reservationLocale(reservation); const t = copy[locale]; const { from, hotelEmail } = getMailSettings();
  await getResend().emails.send({ from, to: [reservation.guestEmail], bcc: [hotelEmail], subject: t.receivedSubject, html: shell(`<h1 style="color:#003322">${t.receivedTitle}</h1><p>${t.hello} ${escapeHtml(reservation.guestName)},</p><p>${t.received}</p>${reservationDetails(reservation, locale)}<p><strong>${t.status}:</strong> ${t.pending}</p><p>${t.notConfirmed}</p><p>Hotel Casa Blanca<br/>El Progreso, Yoro, Honduras</p>`) });
  return { status: "sent" as const };
}

export async function sendPaymentLinkEmail(reservation: Reservation) {
  if (!hasResendConfig()) return { status: "skipped" as const };
  if (!reservation.paymentLink || new URL(reservation.paymentLink).protocol !== "https:") throw new Error("The payment link must use HTTPS.");
  const locale = reservationLocale(reservation); const t = copy[locale]; const { from, hotelEmail } = getMailSettings();
  await getResend().emails.send({ from, to: [reservation.guestEmail], bcc: [hotelEmail], subject: t.paymentSubject, html: shell(`<h1 style="color:#003322">${t.approved}</h1><p>${t.hello} ${escapeHtml(reservation.guestName)},</p><p>${t.paymentIntro}</p><p><a href="${escapeHtml(reservation.paymentLink)}" style="display:inline-block;background:#003322;color:white;padding:12px 18px;text-decoration:none;border-radius:6px">${t.pay}</a></p>${reservationDetails(reservation, locale)}<p>${t.held}</p>`) });
  return { status: "sent" as const };
}

export async function sendReservationConfirmedEmail(reservation: Reservation) {
  if (!hasResendConfig()) return { status: "skipped" as const };
  const locale = reservationLocale(reservation); const t = copy[locale]; const { from, hotelEmail } = getMailSettings();
  await getResend().emails.send({ from, to: [reservation.guestEmail], bcc: [hotelEmail], subject: t.confirmedSubject, html: shell(`<h1 style="color:#003322">${t.confirmed}</h1><p>${t.hello} ${escapeHtml(reservation.guestName)},</p><p>${t.confirmedIntro}</p>${reservationDetails(reservation, locale)}<p>${t.welcome}</p>`) });
  return { status: "sent" as const };
}
