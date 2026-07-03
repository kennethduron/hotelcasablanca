"use client";

import dynamic from "next/dynamic";

import type { Destination } from "@/types/hotel";

export const TourismMapDynamic = dynamic<{
  compact?: boolean;
  destinations?: Destination[];
}>(() => import("@/components/maps/tourism-map").then((mod) => mod.TourismMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-[520px] place-items-center rounded-[8px] border border-hotel-line bg-hotel-ivory text-sm text-hotel-muted shadow-hotel-card">
      Cargando mapa interactivo...
    </div>
  ),
});