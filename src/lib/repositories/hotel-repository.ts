import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { destinations as localDestinations } from "@/data/destinations";
import { galleryImages as localGalleryImages } from "@/data/gallery";
import { rooms as localRooms } from "@/data/rooms";
import { mainServices as localServices } from "@/data/services";
import { getAdminDb } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getDataMode } from "@/lib/firebase/mode";
import type { Destination, PreferredContactMethod, Reservation, Room } from "@/types/hotel";

export interface ContactMessageInput { name: string; email: string; phone?: string; subject: string; message: string }
export interface CreateReservationInput {
  guestName: string; guestEmail: string; guestPhone: string; guestCountry: string; guestDocumentNumber: string;
  guestDocumentType: string; guestAddress?: string; roomId: string; roomName: string; checkIn: string; checkOut: string;
  adults: number; children: number; nights: number; plan: string; ratePerNight: number; taxes: number; notes?: string;
  total: number; preferredContactMethod: PreferredContactMethod; termsAccepted: boolean; dataProcessingAccepted: boolean;
}
export interface GalleryImage { id: string; title: string; category: string; image: string; active: boolean }

export async function getRooms(): Promise<Room[]> {
  if (getDataMode() === "demo") return localRooms;
  const snapshot = await getAdminDb().collection(firestoreCollections.rooms).where("active", "==", true).get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Room);
}
export async function getDestinations(): Promise<Destination[]> {
  if (getDataMode() === "demo") return localDestinations;
  const snapshot = await getAdminDb().collection(firestoreCollections.destinations).where("active", "==", true).get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Destination);
}
export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (getDataMode() === "demo") return localGalleryImages;
  const snapshot = await getAdminDb().collection(firestoreCollections.gallery).where("active", "==", true).get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as GalleryImage);
}
export async function getServices() {
  if (getDataMode() === "demo") return localServices;
  const snapshot = await getAdminDb().collection(firestoreCollections.services).where("active", "==", true).get();
  return snapshot.docs.map((item) => {
    const fallback = localServices.find((service) => service.id === item.id);
    return fallback ? { ...fallback, ...item.data(), id: item.id, icon: fallback.icon } : null;
  }).filter((item): item is (typeof localServices)[number] => item !== null);
}
export async function getRecentMessages() {
  if (getDataMode() === "demo") return [];
  const snapshot = await getAdminDb().collection(firestoreCollections.messages).orderBy("createdAt", "desc").limit(20).get();
  return snapshot.docs.map((item) => {
    const fallback = localServices.find((service) => service.id === item.id);
    return fallback ? { ...fallback, ...item.data(), id: item.id, icon: fallback.icon } : null;
  }).filter((item): item is (typeof localServices)[number] => item !== null);
}
export async function createContactMessage(input: ContactMessageInput) {
  if (getDataMode() === "demo") return { id: `demo-message-${Date.now()}`, status: "demo" as const };
  const result = await getAdminDb().collection(firestoreCollections.messages).add({ ...input, status: "new", createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  return { id: result.id, status: "created" as const };
}
export async function createReservation(input: CreateReservationInput) {
  const now = new Date().toISOString();
  const reservationBase = { ...input, status: "pending_review" as const, paymentStatus: "pending" as const, paymentLink: null, approvedBy: null, confirmedBy: null };
  if (getDataMode() === "demo") return { reservation: { id: `demo-reservation-${Date.now()}`, ...reservationBase, createdAt: now, updatedAt: now } as unknown as Reservation, status: "demo" as const };
  const result = await getAdminDb().collection(firestoreCollections.reservations).add({ ...reservationBase, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  return { reservation: { id: result.id, ...reservationBase, createdAt: now, updatedAt: now } as unknown as Reservation, status: "created" as const };
}
function serializeTimestamp(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return "";
}

function todayInHonduras() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Tegucigalpa" });
}

export async function getAdminDashboardData() {
  const empty = {
    metrics: {
      reservationsToday: 0,
      checkInsToday: 0,
      checkOutsToday: 0,
      occupancyPercent: 0,
      monthlyRevenue: 0,
    },
    recentReservations: [] as Array<Reservation>,
    roomStates: [] as Array<{ label: string; detail: string; value: string; color: string }>,
    activity: [] as string[],
    unreadMessages: 0,
  };
  if (getDataMode() === "demo") return empty;

  const db = getAdminDb();
  const [reservationSnapshot, roomSnapshot, messageSnapshot, activitySnapshot] = await Promise.all([
    db.collection(firestoreCollections.reservations).orderBy("createdAt", "desc").limit(50).get(),
    db.collection(firestoreCollections.rooms).get(),
    db.collection(firestoreCollections.messages).where("status", "==", "new").get(),
    db.collection(firestoreCollections.activityLogs).orderBy("createdAt", "desc").limit(5).get(),
  ]);

  const reservations = reservationSnapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
    createdAt: serializeTimestamp(item.data().createdAt),
    updatedAt: serializeTimestamp(item.data().updatedAt),
  }) as Reservation);
  const rooms = roomSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Room);
  const today = todayInHonduras();
  const activeReservations = reservations.filter((item) => ["confirmed", "paid", "checked_in"].includes(String(item.status).toLowerCase()));
  const totalUnits = rooms.reduce((sum, room) => sum + (room.totalUnits ?? 1), 0);
  const occupiedUnits = activeReservations.filter((item) => item.checkIn <= today && item.checkOut > today).length;
  const currentMonth = today.slice(0, 7);
  const monthlyRevenue = reservations
    .filter((item) => String(item.paymentStatus).toLowerCase() === "paid" && item.checkIn?.startsWith(currentMonth))
    .reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const roomStates = [
    { label: "Disponibles", count: rooms.filter((room) => room.active !== false && room.status === "Disponible").length, color: "text-emerald-700" },
    { label: "Ocupadas", count: occupiedUnits, color: "text-amber-700" },
    { label: "Reservadas", count: activeReservations.length, color: "text-blue-700" },
    { label: "Mantenimiento", count: rooms.filter((room) => room.status === "Mantenimiento").length, color: "text-red-700" },
    { label: "Fuera de servicio", count: rooms.filter((room) => room.status === "Fuera de servicio").length, color: "text-hotel-muted" },
  ].map((item) => ({
    label: item.label,
    detail: `${item.count} habitaciones`,
    value: totalUnits ? `${Math.round((item.count / totalUnits) * 100)}%` : "0%",
    color: item.color,
  }));

  return {
    metrics: {
      reservationsToday: reservations.filter((item) => item.createdAt?.startsWith(today) || item.checkIn === today).length,
      checkInsToday: reservations.filter((item) => item.checkIn === today).length,
      checkOutsToday: reservations.filter((item) => item.checkOut === today).length,
      occupancyPercent: totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
      monthlyRevenue,
    },
    recentReservations: reservations.slice(0, 8),
    roomStates,
    activity: activitySnapshot.docs.map((item) => String(item.data().action ?? "Actividad registrada")),
    unreadMessages: messageSnapshot.size,
  };
}
