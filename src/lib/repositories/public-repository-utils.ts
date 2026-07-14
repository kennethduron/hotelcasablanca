import "server-only";

import { unstable_cache } from "next/cache";

import { getAdminDb } from "@/lib/firebase/admin";

const PUBLIC_CONTENT_REVALIDATE_SECONDS = 300;

type PublicDocument = { id: string; active?: boolean; order?: number };

function sortByOrder<T extends PublicDocument>(items: T[]) {
  return [...items].sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
}

function serializeFirestoreValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(serializeFirestoreValue);
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, serializeFirestoreValue(entry)]));
  }
  return value;
}

function serializeDocument<T extends { id: string }>(id: string, data: FirebaseFirestore.DocumentData): T {
  return { id, ...serializeFirestoreValue(data) as Record<string, unknown> } as T;
}

async function readActiveCollection<T extends PublicDocument>(collection: string): Promise<T[]> {
  try {
    const snapshot = await getAdminDb().collection(collection).where("active", "==", true).get();
    return sortByOrder(snapshot.docs.map((doc) => serializeDocument<T>(doc.id, doc.data())));
  } catch {
    return [];
  }
}

async function readDocument<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
  try {
    const doc = await getAdminDb().collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return serializeDocument<T>(doc.id, doc.data() ?? {});
  } catch {
    return null;
  }
}

export function cachedActiveCollection<T extends PublicDocument>(collection: string, cacheKey: string) {
  return unstable_cache(() => readActiveCollection<T>(collection), [cacheKey], {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [cacheKey],
  });
}

export function cachedDocument<T extends { id: string }>(collection: string, id: string, cacheKey: string) {
  return unstable_cache(() => readDocument<T>(collection, id), [cacheKey, id], {
    revalidate: PUBLIC_CONTENT_REVALIDATE_SECONDS,
    tags: [cacheKey],
  });
}