import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import type { Locale } from "@/i18n/config";
import { localizeService } from "@/i18n/content";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicService } from "@/types/public-content";

const getServicesCollection = cachedActiveCollection<PublicService>(firestoreCollections.services, "public-services");

export async function getAll(locale: Locale = "es") {
  return (await getServicesCollection()).map((service) => localizeService(service, locale));
}

export const servicesRepository = { getAll };
