import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import type { Locale } from "@/i18n/config";
import { localizeGallery } from "@/i18n/content";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicGalleryImage } from "@/types/public-content";

const getGalleryCollection = cachedActiveCollection<PublicGalleryImage>(firestoreCollections.gallery, "public-gallery");

export async function getAll(locale: Locale = "es") {
  return (await getGalleryCollection()).map((image) => localizeGallery(image, locale));
}

export const galleryRepository = { getAll };
