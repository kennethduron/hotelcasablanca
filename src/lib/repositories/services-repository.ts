import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicService } from "@/types/public-content";

const getServicesCollection = cachedActiveCollection<PublicService>(firestoreCollections.services, "public-services");

export async function getAll() {
  return getServicesCollection();
}

export const servicesRepository = { getAll };
