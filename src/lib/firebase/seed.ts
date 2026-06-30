import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { destinations } from "@/data/destinations";
import { galleryImages } from "@/data/gallery";
import { rooms } from "@/data/rooms";
import { mainServices } from "@/data/services";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getFirebaseDb, hasFirebaseConfig } from "@/lib/firebase/client";

export async function seedFirebaseDemoData() {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase no está configurado para sembrar datos demo.");
  }

  const db = getFirebaseDb();
  const now = serverTimestamp();

  await Promise.all([
    ...rooms.map((room) =>
      setDoc(doc(db, firestoreCollections.rooms, room.id), {
        ...room,
        createdAt: now,
        updatedAt: now,
      }),
    ),
    ...destinations.map((destination) =>
      setDoc(doc(db, firestoreCollections.destinations, destination.id), {
        ...destination,
        createdAt: now,
        updatedAt: now,
      }),
    ),
    ...galleryImages.map((image) =>
      setDoc(doc(db, firestoreCollections.gallery, image.id), {
        ...image,
        createdAt: now,
        updatedAt: now,
      }),
    ),
    ...mainServices.map((service) =>
      setDoc(doc(db, firestoreCollections.services, service.id), {
        id: service.id,
        name: service.name,
        description: service.description,
        image: service.image,
        createdAt: now,
        updatedAt: now,
      }),
    ),
  ]);
}