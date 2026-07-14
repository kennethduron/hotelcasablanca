import "server-only";

import { FieldValue, type DocumentSnapshot } from "firebase-admin/firestore";
import { z } from "zod";

import { checkAvailability } from "@/lib/availability-service";
import { getAdminDb } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import type { Reservation } from "@/types/hotel";

const httpsUrlSchema = z.url().refine((value) => new URL(value).protocol === "https:", "El enlace debe usar HTTPS.");

function occupiedNights(checkIn: string, checkOut: string) {
  const values: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    values.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return values;
}

function serializeDate(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return new Date().toISOString();
}

function reservationFromSnapshot(snapshot: DocumentSnapshot, overrides: Partial<Reservation> = {}) {
  const data = snapshot.data() ?? {};
  return {
    id: snapshot.id,
    ...data,
    createdAt: serializeDate(data.createdAt),
    updatedAt: serializeDate(data.updatedAt),
    ...overrides,
  } as Reservation;
}

export async function setReservationPaymentLink(reservationId: string, paymentLink: string, actorId: string) {
  const validatedLink = httpsUrlSchema.parse(paymentLink);
  const db = getAdminDb();
  const reference = db.collection(firestoreCollections.reservations).doc(reservationId);
  let updatedReservation: Reservation | null = null;

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("Reserva no encontrada.");
    updatedReservation = reservationFromSnapshot(snapshot, {
      paymentLink: validatedLink,
      status: "En espera de pago" as Reservation["status"],
      approvedBy: actorId,
      updatedAt: new Date().toISOString(),
    });
    transaction.update(reference, {
      paymentLink: validatedLink,
      status: "awaiting_payment",
      approvedBy: actorId,
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.set(db.collection(firestoreCollections.activityLogs).doc(), {
      actorId,
      action: "reservation.payment_link_set",
      reservationId,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  if (!updatedReservation) throw new Error("No fue posible actualizar la reserva.");
  return updatedReservation;
}

export async function confirmReservationPayment(reservationId: string, actorId: string) {
  const db = getAdminDb();
  const reference = db.collection(firestoreCollections.reservations).doc(reservationId);
  let confirmedReservation: Reservation | null = null;

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) throw new Error("Reserva no encontrada.");
    const reservation = snapshot.data()!;
    if (!reservation.paymentLink || !httpsUrlSchema.safeParse(reservation.paymentLink).success) throw new Error("La reserva no tiene un enlace HTTPS válido.");

    const availability = await checkAvailability({
      roomId: reservation.roomId,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      adults: reservation.adults,
      children: reservation.children,
    });
    if (!availability.available) throw new Error("La habitación ya no está disponible para esas fechas.");

    const nights = occupiedNights(reservation.checkIn, reservation.checkOut);
    const lockReferences = nights.map((date) => db.collection("inventory_locks").doc(`${reservation.roomId}_${date}`));
    const locks = await Promise.all(lockReferences.map((lock) => transaction.get(lock)));
    if (locks.some((lock) => lock.exists && lock.data()?.reservationId !== reservationId)) throw new Error("Conflicto de inventario detectado.");

    lockReferences.forEach((lock, index) => transaction.set(lock, {
      roomId: reservation.roomId,
      reservationId,
      date: nights[index],
      createdAt: FieldValue.serverTimestamp(),
    }));
    confirmedReservation = reservationFromSnapshot(snapshot, {
      status: "Confirmada" as Reservation["status"],
      paymentStatus: "Pagado" as Reservation["paymentStatus"],
      confirmedBy: actorId,
      updatedAt: new Date().toISOString(),
    });
    transaction.update(reference, {
      status: "confirmed",
      paymentStatus: "paid",
      confirmedBy: actorId,
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.set(db.collection(firestoreCollections.activityLogs).doc(), {
      actorId,
      action: "reservation.payment_confirmed",
      reservationId,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  if (!confirmedReservation) throw new Error("No fue posible confirmar la reserva.");
  return confirmedReservation;
}
