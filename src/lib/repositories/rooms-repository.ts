import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import type { Locale } from "@/i18n/config";
import { localizeRoom } from "@/i18n/content";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicRoom } from "@/types/public-content";

const getRoomsCollection = cachedActiveCollection<PublicRoom>(firestoreCollections.rooms, "public-rooms");

export async function getAll(locale: Locale = "es") {
  return (await getRoomsCollection()).map((room) => localizeRoom(room, locale));
}

export async function getFeatured(locale: Locale = "es") {
  const rooms = await getAll(locale);
  return rooms.filter((room) => room.featured);
}

export async function getBySlug(slug: string, locale: Locale = "es") {
  const rooms = await getAll(locale);
  return rooms.find((room) => room.slug === slug) ?? null;
}

export const roomsRepository = { getAll, getFeatured, getBySlug };
