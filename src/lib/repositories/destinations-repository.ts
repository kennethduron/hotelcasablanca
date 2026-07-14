import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicDestination } from "@/types/public-content";

const getDestinationsCollection = cachedActiveCollection<PublicDestination>(firestoreCollections.destinations, "public-destinations");

export async function getAll() {
  return getDestinationsCollection();
}

export const destinationsRepository = { getAll };
