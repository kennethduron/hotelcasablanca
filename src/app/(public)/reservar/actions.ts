"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { sendReservationReceivedEmail } from "@/lib/email/resend";
import { checkAvailability, type AvailabilityRequest } from "@/lib/availability-service";
import { createReservation, getRooms } from "@/lib/repositories/hotel-repository";
import type { PreferredContactMethod } from "@/types/hotel";

const reservationSchema = z.object({
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  roomId: z.string().min(1),
  adults: z.coerce.number().int().min(1).max(8),
  children: z.coerce.number().int().min(0).max(8),
  guestName: z.string().min(2),
  guestEmail: z.email(),
  guestPhone: z.string().min(8),
  guestCountry: z.string().min(2),
  guestDocumentNumber: z.string().min(4),
  guestDocumentType: z.string().min(2),
  guestAddress: z.string().optional(),
  notes: z.string().optional(),
  preferredContactMethod: z.enum(["WhatsApp", "Correo electrónico", "Llamada telefónica"]),
  termsAccepted: z.literal("on"),
  dataProcessingAccepted: z.literal("on"),
});

function getNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / 86_400_000);
}

export async function checkAvailabilityAction(request: AvailabilityRequest) {
  return checkAvailability(request);
}

export async function createReservationAction(formData: FormData) {
  const parsed = reservationSchema.safeParse({
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    roomId: formData.get("roomId"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    guestName: formData.get("guestName"),
    guestEmail: formData.get("guestEmail"),
    guestPhone: formData.get("guestPhone"),
    guestCountry: formData.get("guestCountry"),
    guestDocumentNumber: formData.get("guestDocumentNumber"),
    guestDocumentType: formData.get("guestDocumentType"),
    guestAddress: formData.get("guestAddress") || undefined,
    notes: formData.get("notes") || undefined,
    preferredContactMethod: formData.get("preferredContactMethod"),
    termsAccepted: formData.get("termsAccepted"),
    dataProcessingAccepted: formData.get("dataProcessingAccepted"),
  });

  if (!parsed.success) {
    redirect("/reservar?error=datos");
  }

  const data = parsed.data;
  const rooms = await getRooms();
  const room = rooms.find((item) => item.id === data.roomId);
  const nights = getNights(data.checkIn, data.checkOut);

  const availability = room ? await checkAvailability({ roomId: room.id, checkIn: data.checkIn, checkOut: data.checkOut, adults: data.adults, children: data.children }) : null;

  if (!room || nights < 1 || !availability?.available) {
    redirect("/reservar?error=disponibilidad");
  }

  const subtotal = room.price * nights;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;

  const { reservation } = await createReservation({
    guestName: data.guestName,
    guestEmail: data.guestEmail,
    guestPhone: data.guestPhone,
    guestCountry: data.guestCountry,
    guestDocumentNumber: data.guestDocumentNumber,
    guestDocumentType: data.guestDocumentType,
    guestAddress: data.guestAddress,
    roomId: room.id,
    roomName: room.name,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    adults: data.adults,
    children: data.children,
    nights,
    plan: "Solo hospedaje",
    ratePerNight: room.price,
    taxes,
    notes: data.notes,
    total,
    preferredContactMethod: data.preferredContactMethod as PreferredContactMethod,
    termsAccepted: true,
    dataProcessingAccepted: true,
  });

  await sendReservationReceivedEmail(reservation);

  redirect(`/reservar/confirmacion?id=${encodeURIComponent(reservation.id)}`);
}