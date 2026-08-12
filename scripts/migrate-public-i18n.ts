import { FieldValue } from "firebase-admin/firestore";

import { publicDestinations, publicGallery, publicRooms, publicServices, publicSettings } from "../src/data/public-seed.ts";
import { firestoreCollections } from "../src/lib/firebase/collections.ts";
import { getScriptDb } from "./firebase-admin.ts";

type Stats = { created: number; updated: number; skipped: number; failed: number };
type SeedDocument = Record<string, unknown> & { id: string };

function translationPatch(existing: Record<string, unknown>, seed: SeedDocument) {
  const patch: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(seed)) {
    if (!field.endsWith("I18n") || !value || typeof value !== "object") continue;
    const current = existing[field] && typeof existing[field] === "object" ? existing[field] as Record<string, unknown> : {};
    const additions = Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([locale]) => current[locale] === undefined || current[locale] === ""));
    if (Object.keys(additions).length) patch[field] = { ...current, ...additions };
  }
  return patch;
}

async function migrateCollection(collection: string, documents: SeedDocument[]) {
  const stats: Stats = { created: 0, updated: 0, skipped: 0, failed: 0 };
  for (const document of documents) {
    try {
      const { id, ...seed } = document;
      const ref = getScriptDb().collection(collection).doc(id);
      const snapshot = await ref.get();
      if (!snapshot.exists) {
        await ref.set({ ...seed, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
        stats.created += 1;
        continue;
      }
      const patch = translationPatch(snapshot.data() ?? {}, document);
      if (!Object.keys(patch).length) {
        stats.skipped += 1;
        continue;
      }
      await ref.set({ ...patch, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      stats.updated += 1;
    } catch (error: unknown) {
      stats.failed += 1;
      const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "unknown";
      const category = error instanceof Error ? error.name : "unknown";
      const message = error instanceof Error ? error.message.replace(/[\r\n]+/g, " ").slice(0, 240) : "No diagnostic message";
      console.error(`${collection}/${document.id}: ${category}:${code} ${message}`);
    }
  }
  return stats;
}

async function main() {
  const jobs: Array<[string, SeedDocument[]]> = [
    [firestoreCollections.rooms, publicRooms as unknown as SeedDocument[]],
    [firestoreCollections.services, publicServices as unknown as SeedDocument[]],
    [firestoreCollections.destinations, publicDestinations as unknown as SeedDocument[]],
    [firestoreCollections.gallery, publicGallery as unknown as SeedDocument[]],
    [firestoreCollections.publicSettings, [publicSettings as unknown as SeedDocument]],
  ];
  let failures = 0;
  for (const [collection, documents] of jobs) {
    const stats = await migrateCollection(collection, documents);
    failures += stats.failed;
    console.log(`${collection}: created=${stats.created} updated=${stats.updated} skipped=${stats.skipped} failed=${stats.failed}`);
  }
  if (failures) process.exit(1);
}

main().catch((error: unknown) => {
  const category = error instanceof Error ? error.name : "unknown";
  console.error(`Public i18n migration failed: ${category}`);
  process.exit(1);
});
