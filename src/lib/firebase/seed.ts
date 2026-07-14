import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { destinations } from "@/data/destinations";
import { galleryImages } from "@/data/gallery";
import { rooms } from "@/data/rooms";
import { mainServices } from "@/data/services";
import { getAdminDb } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";

export async function seedFirebaseDemoData() {
  const db = getAdminDb();
  const created: string[] = [];
  const omitted: string[] = [];

  async function createIfMissing(collection: string, id: string, data: object) {
    const reference = db.collection(collection).doc(id);
    const snapshot = await reference.get();
    if (snapshot.exists) {
      omitted.push(`${collection}/${id}`);
      return;
    }
    await reference.set({
      ...data,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    created.push(`${collection}/${id}`);
  }

  for (const room of rooms) await createIfMissing(firestoreCollections.rooms, room.id, room);
  for (const destination of destinations) await createIfMissing(firestoreCollections.destinations, destination.id, destination);
  for (const image of galleryImages) await createIfMissing(firestoreCollections.gallery, image.id, image);
  for (const service of mainServices) {
    await createIfMissing(firestoreCollections.services, service.id, {
      id: service.id,
      name: service.name,
      description: service.description,
      image: service.image,
    });
  }

  return { created, omitted, updated: [] as string[] };
}