"use server";

import { z } from "zod";

import { requireAdminSession } from "@/lib/auth/session";
import { sendPaymentLinkEmail, sendReservationConfirmedEmail } from "@/lib/email/resend";
import { confirmReservationPayment, setReservationPaymentLink } from "@/lib/repositories/reservation-repository";

const idSchema = z.string().min(1).max(160);
const linkSchema = z.url().refine((value) => new URL(value).protocol === "https:");

export async function setPaymentLinkAction(reservationId: string, paymentLink: string) {
  const session = await requireAdminSession(["admin"]);
  const reservation = await setReservationPaymentLink(idSchema.parse(reservationId), linkSchema.parse(paymentLink), session.uid);
  await sendPaymentLinkEmail(reservation);
}

export async function confirmPaymentAction(reservationId: string) {
  const session = await requireAdminSession(["admin"]);
  const reservation = await confirmReservationPayment(idSchema.parse(reservationId), session.uid);
  await sendReservationConfirmedEmail(reservation);
}
