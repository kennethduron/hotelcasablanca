import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicRoom } from "@/types/public-content";

const getRoomsCollection = cachedActiveCollection<PublicRoom>(firestoreCollections.rooms, "public-rooms");

export async function getAll() {
  return getRoomsCollection();
}

export async function getFeatured() {
  const rooms = await getAll();
  return rooms.filter((room) => room.featured);
}

export async function getBySlug(slug: string) {
  const rooms = await getAll();
  return rooms.find((room) => room.slug === slug) ?? null;
}

export const roomsRepository = { getAll, getFeatured, getBySlug };
