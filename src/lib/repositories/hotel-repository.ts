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