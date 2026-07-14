import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import { cachedDocument } from "@/lib/repositories/public-repository-utils";
import type { PublicSettings } from "@/types/public-content";

const getSettingsDocument = cachedDocument<PublicSettings>(firestoreCollections.publicSettings, "main", "public-settings");

export async function get() {
  return getSettingsDocument();
}

export const settingsRepository = { get };
