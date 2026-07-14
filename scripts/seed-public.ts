import { FieldValue } from "firebase-admin/firestore";

import { publicDestinations, publicGallery, publicRooms, publicServices, publicSettings } from "../src/data/public-seed.ts";
import { firestoreCollections } from "../src/lib/firebase/collections.ts";
import { getScriptDb } from "./firebase-admin.ts";

type SeedStats = { created: number; updated: number; skipped: number; failed: number };
type SeedableDocument = Record<string, unknown> & { id: string };

function emptyStats(): SeedStats {
  return { created: 0, updated: 0, skipped: 0, failed: 0 };
}

function normalizeForCompare(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeForCompare);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "createdAt" && key !== "updatedAt")
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, entry]) => [key, normalizeForCompare(entry)]),
    );
  }
  return value;
}

function hasChanged(existing: Record<string, unknown>, next: Record<string, unknown>) {
  const existingSeedFields = Object.fromEntries(Object.keys(next).map((key) => [key, existing[key]]));
  return JSON.stringify(normalizeForCompare(existingSeedFields)) !== JSON.stringify(normalizeForCompare(next));
}

async function upsertDocument(collection: string, document: SeedableDocument, stats: SeedStats) {
  const db = getScriptDb();
  const { id, ...payload } = document;
  const ref = db.collection(collection).doc(id);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    await ref.set({ ...payload, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    stats.created += 1;
    return;
  }

  if (hasChanged(snapshot.data() ?? {}, payload)) {
    await ref.set({ ...payload, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    stats.updated += 1;
    return;
  }

  stats.skipped += 1;
}

async function seedCollection(collection: string, documents: SeedableDocument[]) {
  const stats = emptyStats();
  for (const document of documents) {
    try {
      await upsertDocument(collection, document, stats);
    } catch {
      stats.failed += 1;
    }
  }
  return stats;
}

function printStats(label: string, stats: SeedStats) {
  console.log(`${label}:`);
  console.log(`Created: ${stats.created}`);
  console.log(`Updated: ${stats.updated}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Failed: ${stats.failed}`);
  console.log("");
}

function totalFailures(stats: SeedStats[]) {
  return stats.reduce((total, item) => total + item.failed, 0);
}

async function main() {
  const rooms = await seedCollection(firestoreCollections.rooms, publicRooms as unknown as SeedableDocument[]);
  const services = await seedCollection(firestoreCollections.services, publicServices as unknown as SeedableDocument[]);
  const destinations = await seedCollection(firestoreCollections.destinations, publicDestinations as unknown as SeedableDocument[]);
  const gallery = await seedCollection(firestoreCollections.gallery, publicGallery as unknown as SeedableDocument[]);
  const settings = await seedCollection(firestoreCollections.publicSettings, [publicSettings as unknown as SeedableDocument]);
  const allStats = [rooms, services, destinations, gallery, settings];

  printStats("Rooms", rooms);
  printStats("Services", services);
  printStats("Destinations", destinations);
  printStats("Gallery", gallery);
  printStats("Settings", settings);

  if (totalFailures(allStats) > 0) process.exit(1);
}

main().catch((error: unknown) => {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "unknown";
  const category = error instanceof Error ? error.name : "unknown";
  console.error(`Seed public failed: ${category}:${code}`);
  process.exit(1);
});