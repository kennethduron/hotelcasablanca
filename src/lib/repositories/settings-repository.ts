import "server-only";

import { firestoreCollections } from "@/lib/firebase/collections";
import type { Locale } from "@/i18n/config";
import { localizeSettings } from "@/i18n/content";
import { cachedDocument } from "@/lib/repositories/public-repository-utils";
import type { PublicSettings } from "@/types/public-content";

const getSettingsDocument = cachedDocument<PublicSettings>(firestoreCollections.publicSettings, "main", "public-settings");

export async function get(locale: Locale = "es") {
  const settings = await getSettingsDocument();
  return settings ? localizeSettings(settings, locale) : null;
}

export const settingsRepository = { get };
