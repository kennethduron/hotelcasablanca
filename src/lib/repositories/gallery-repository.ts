import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import { cachedActiveCollection } from "@/lib/repositories/public-repository-utils";
import type { PublicGalleryImage } from "@/types/public-content";

const getGalleryCollection = cachedActiveCollection<PublicGalleryImage>(firestoreCollections.gallery, "public-gallery");

export async function getAll() {
  return getGalleryCollection();
}

export const galleryRepository = { getAll };
