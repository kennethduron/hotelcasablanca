import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { destinations } from "@/data/destinations";
import { galleryImages } from "@/data/gallery";
import { rooms } from "@/data/rooms";
import { mainServices } from "@/data/services";
import { getAdminDb } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";

export async function seedFirebaseDemoData() {
  const db = getAdminDb(); const batch = db.batch();
  for (const room of rooms) batch.set(db.collection(firestoreCollections.rooms).doc(room.id), { ...room, active: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  for (const destination of destinations) batch.set(db.collection(firestoreCollections.destinations).doc(destination.id), { ...destination, active: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  for (const image of galleryImages) batch.set(db.collection(firestoreCollections.gallery).doc(image.id), { ...image, active: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  for (const service of mainServices) batch.set(db.collection(firestoreCollections.services).doc(service.id), { id: service.id, name: service.name, description: service.description, image: service.image, active: true, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  await batch.commit();
}