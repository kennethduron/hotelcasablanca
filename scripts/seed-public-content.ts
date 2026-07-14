import { FieldValue } from "firebase-admin/firestore";

import { destinations } from "../src/data/destinations.ts";
import { galleryImages } from "../src/data/gallery.ts";
import { rooms } from "../src/data/rooms.ts";
import { mainServices } from "../src/data/services.ts";
import { firestoreCollections } from "../src/lib/firebase/collections.ts";
import { getScriptDb } from "./firebase-admin.ts";

const db = getScriptDb();
const results = {
  created: [] as string[],
  omitted: [] as string[],
  updated: [] as string[],
};

async function createIfMissing(collection: string, id: string, data: object) {
  const reference = db.collection(collection).doc(id);
  const snapshot = await reference.get();
  if (snapshot.exists) {
    results.omitted.push(`${collection}/${id}`);
    return;
  }

  await reference.set({
    ...data,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  results.created.push(`${collection}/${id}`);
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
await createIfMissing(firestoreCollections.settings, "public", {
  visibility: "public",
  hotelName: "Hotel Casa Blanca",
  location: "El Progreso, Yoro",
});

process.stdout.write(`Seed público completado. Creados: ${results.created.length}. Omitidos: ${results.omitted.length}. Actualizados: ${results.updated.length}.\n`);
for (const item of results.created) process.stdout.write(`created ${item}\n`);
for (const item of results.omitted) process.stdout.write(`omitted ${item}\n`);