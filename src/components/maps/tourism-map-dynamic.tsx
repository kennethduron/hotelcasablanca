"use client";

import dynamic from "next/dynamic";

import type { PublicDestination } from "@/types/public-content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export const TourismMapDynamic = dynamic<{
  compact?: boolean;
  destinations?: PublicDestination[];
  locale: Locale;
  dictionary: Dictionary;
}>(() => import("@/components/maps/tourism-map").then((mod) => mod.TourismMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-[clamp(420px,52vw,560px)] place-items-center rounded-[8px] border border-hotel-line bg-hotel-ivory text-sm text-hotel-muted shadow-hotel-card">
      <span aria-hidden>•••</span>
    </div>
  ),
});
