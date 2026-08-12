import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import type { Locale } from "@/i18n/config";
import { localizeDestination } from "@/i18n/content";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicDestination } from "@/types/public-content";

const getDestinationsCollection = cachedActiveCollection<PublicDestination>(firestoreCollections.destinations, "public-destinations");

export async function getAll(locale: Locale = "es") {
  return (await getDestinationsCollection()).map((destination) => localizeDestination(destination, locale));
}

export const destinationsRepository = { getAll };
