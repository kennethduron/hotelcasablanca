import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { destinations as localDestinations } from "@/data/destinations";
import { galleryImages as localGalleryImages } from "@/data/gallery";
import { rooms as localRooms } from "@/data/rooms";
import { mainServices as localServices } from "@/data/services";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getFirebaseDb, hasFirebaseConfig } from "@/lib/firebase/client";
import type { Destination, PreferredContactMethod, Reservation, Room } from "@/types/hotel";

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface CreateReservationInput {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  guestDocumentNumber: string;
  guestDocumentType: string;
  guestAddress?: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  plan: string;
  ratePerNight: number;
  taxes: number;
  notes?: string;
  total: number;
  preferredContactMethod: PreferredContactMethod;
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image: string;
  active: boolean;
}

export async function getRooms(): Promise<Room[]> {
  if (!hasFirebaseConfig()) return localRooms;

  const snapshot = await getDocs(collection(getFirebaseDb(), firestoreCollections.rooms));
  if (snapshot.empty) return localRooms;

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Room);
}

export async function getDestinations(): Promise<Destination[]> {
  if (!hasFirebaseConfig()) return localDestinations;

  const snapshot = await getDocs(collection(getFirebaseDb(), firestoreCollections.destinations));
  if (snapshot.empty) return localDestinations;

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Destination);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!hasFirebaseConfig()) return localGalleryImages;

  const snapshot = await getDocs(collection(getFirebaseDb(), firestoreCollections.gallery));
  if (snapshot.empty) return localGalleryImages;

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as GalleryImage);
}

export async function getServices() {
  return localServices;
}

export async function getRecentMessages() {
  if (!hasFirebaseConfig()) return [];

  const messagesQuery = query(
    collection(getFirebaseDb(), firestoreCollections.messages),
    orderBy("createdAt", "desc"),
    limit(20),
  );
  const snapshot = await getDocs(messagesQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createContactMessage(input: ContactMessageInput) {
  if (!hasFirebaseConfig()) {
    return {
      id: `demo-message-${Date.now()}`,
      status: "demo",
    };
  }

  const result = await addDoc(collection(getFirebaseDb(), firestoreCollections.messages), {
    ...input,
    status: "Nuevo",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: result.id,
    status: "created",
  };
}

export async function createReservation(input: CreateReservationInput) {
  const now = new Date().toISOString();
  const reservationBase = {
    ...input,
    status: "Pendiente de revisión" as const,
    paymentStatus: "Pendiente" as const,
    paymentLink: "",
    approvedBy: "",
    confirmedBy: "",
  };

  if (!hasFirebaseConfig()) {
    return {
      reservation: {
        id: `demo-reservation-${Date.now()}`,
        ...reservationBase,
        createdAt: now,
        updatedAt: now,
      } satisfies Reservation,
      status: "demo",
    };
  }

  const result = await addDoc(collection(getFirebaseDb(), firestoreCollections.reservations), {
    ...reservationBase,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    reservation: {
      id: result.id,
      ...reservationBase,
      createdAt: now,
      updatedAt: now,
    } satisfies Reservation,
    status: "created",
  };
}