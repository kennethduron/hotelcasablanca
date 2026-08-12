"use client";

import L from "leaflet";
import { ArrowLeft, ArrowRight, Clock, Navigation } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

import { siteConfig } from "@/lib/site";
import { getDrivingRoute, type RouteResult } from "@/lib/routing-service";
import { cn } from "@/lib/utils";
import type { PublicDestination } from "@/types/public-content";

const hotelPosition: [number, number] = [siteConfig.coordinates.lat, siteConfig.coordinates.lng];

function createHotelIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="hotel-map-marker" style="display:grid;place-items:center;width:54px;height:54px;border-radius:999px;background:#fff;border:3px solid #d6a85f;box-shadow:0 12px 28px rgb(0 0 0 / .28);overflow:hidden;"><img src="${siteConfig.logo}" alt="" style="width:48px;height:48px;object-fit:contain;border-radius:999px;" /></div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    popupAnchor: [0, -24],
  });
}

function createDestinationIcon() {
  return L.divIcon({
    className: "",
    html: '<div style="display:grid;place-items:center;width:42px;height:42px;border-radius:999px;background:#d6a85f;border:3px solid white;box-shadow:0 8px 22px rgb(0 0 0 / .26);"><span style="display:block;width:9px;height:9px;border-radius:999px;background:white;"></span></div>',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -18],
  });
}

function categoryFor(destination: PublicDestination) {
  if (destination.slug.includes("tela")) return "Playa";
  if (destination.slug.includes("jardin") || destination.slug.includes("lancetilla")) return "Naturaleza";
  if (destination.slug.includes("cataratas")) return "Aventura";
  if (destination.slug.includes("san-pedro")) return "Ciudad";
  return "Destino turístico";
}

export function TourismMap({ compact = false, destinations = [] }: { compact?: boolean; destinations?: PublicDestination[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [routeState, setRouteState] = useState<{ key: string; route: RouteResult | null; error: string }>({ key: "", route: null, error: "" });
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touch = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const selected = destinations[selectedIndex];
  const routeKey = selected?.slug ?? "";
  const route = routeState.key === routeKey ? routeState.route : null;
  const routeError = routeState.key === routeKey ? routeState.error : "";
  const routeLoading = Boolean(selected && routeState.key !== routeKey);
  const hotelIcon = useMemo(() => createHotelIcon(), []);
  const destinationIcon = useMemo(() => createDestinationIcon(), []);

  const visibleDestinations = useMemo(() => {
    const count = Math.min(compact ? 2 : 3, destinations.length);
    return Array.from({ length: count }, (_, offset) => {
      const index = (selectedIndex + offset) % destinations.length;
      return { destination: destinations[index], index, active: offset === 0 };
    });
  }, [compact, destinations, selectedIndex]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || destinations.length < 2) return;
    const timer = window.setInterval(() => setSelectedIndex((value) => (value + 1) % destinations.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, destinations.length]);

  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    getDrivingRoute(hotelPosition, [selected.latitude, selected.longitude], controller.signal)
      .then((result) => setRouteState({ key: selected.slug, route: result, error: "" }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRouteState({ key: selected.slug, route: null, error: "La ruta no está disponible temporalmente." });
      });
    return () => controller.abort();
  }, [selected]);

  const pauseTemporarily = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 6000);
  }, []);

  const move = useCallback((delta: number) => {
    if (!destinations.length) return;
    pauseTemporarily();
    setSelectedIndex((value) => (value + delta + destinations.length) % destinations.length);
  }, [destinations.length, pauseTemporarily]);

  if (!selected) {
    return <div className="grid h-[420px] place-items-center rounded-[8px] border border-hotel-line bg-hotel-ivory text-sm text-hotel-muted">No hay destinos públicos disponibles en este momento.</div>;
  }

  const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${hotelPosition.join(",")}&destination=${selected.latitude},${selected.longitude}`;

  return (
    <section
      aria-label="Mapa turístico interactivo"
      className={cn("overflow-hidden rounded-[10px] bg-hotel-forest-900 text-white shadow-[0_28px_80px_rgb(0_31_22_/_0.2)]", compact ? "p-2.5" : "p-3")}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onFocus={() => setPaused(true)}
      onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchEnd={(event) => {
        setDragging(false);
        if (touch.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? touch.current) - touch.current;
        if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1);
        touch.current = null;
      }}
      onTouchStart={(event) => { setDragging(true); touch.current = event.touches[0]?.clientX ?? null; }}
    >
      <div className="flex items-center justify-between gap-3 px-2 py-2.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-hotel-gold">Explora cerca</p>
          <h3 className={cn("hotel-serif font-bold", compact ? "text-xl sm:text-2xl" : "text-3xl")}>{compact ? "Cerca del hotel" : "Destinos desde el hotel"}</h3>
        </div>
        <div className="flex shrink-0 gap-2">
          <button aria-label="Destino anterior" className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-hotel-gold hover:text-hotel-forest" onClick={() => move(-1)} type="button"><ArrowLeft aria-hidden className="size-4" /></button>
          <button aria-label="Destino siguiente" className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-hotel-gold hover:text-hotel-forest" onClick={() => move(1)} type="button"><ArrowRight aria-hidden className="size-4" /></button>
        </div>
      </div>

      <div className={cn("grid gap-3", compact ? "" : "min-[1024px]:grid-cols-[minmax(210px,0.72fr)_minmax(0,1.65fr)]")}>
        <div className="min-w-0 rounded-[8px] border border-white/10 bg-white/7 p-2.5">
          <div aria-label="Carrusel de destinos" aria-live="off" className={cn("flex gap-2.5 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", compact ? "" : "min-[1024px]:flex-col min-[1024px]:overflow-visible")} data-draggable="true" style={{ cursor: dragging ? "grabbing" : undefined, touchAction: "pan-y" }}>
            {visibleDestinations.map(({ destination, index, active }) => (
              <button
                aria-current={active ? "true" : undefined}
                className={cn("group relative w-[84%] shrink-0 overflow-hidden rounded-[8px] border text-left transition duration-300 sm:w-[48%]", compact ? "h-28 xl:h-24" : active ? "h-48 min-[1024px]:h-44" : "h-40 min-[1024px]:h-[7.25rem]", !compact && "min-[1024px]:!w-full", active ? "border-hotel-gold shadow-hotel-card" : "border-white/15 opacity-78 hover:opacity-100")}
                key={`${destination.id}-${index}`}
                onClick={() => { pauseTemporarily(); setSelectedIndex(index); }}
                type="button"
              >
                <Image alt={destination.title} className="object-cover transition duration-500 group-hover:scale-105" fill sizes={compact ? "(max-width: 1023px) 82vw, 360px" : "(max-width: 1023px) 84vw, 300px"} src={destination.image} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/22 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 block p-3.5">
                  <span className="mb-1.5 inline-flex rounded-full bg-hotel-gold px-2.5 py-1 text-[9px] font-bold uppercase text-hotel-forest">{categoryFor(destination)}</span>
                  <span className={cn("block hotel-serif font-bold text-white", compact ? "line-clamp-2 text-lg" : active ? "line-clamp-2 text-xl" : "line-clamp-2 text-lg")}>{destination.title}</span>
                  <span className="mt-1 flex items-center gap-2 text-[11px] text-white/88"><Clock aria-hidden className="size-3" />{destination.estimatedTime}<span>{destination.estimatedDistance}</span></span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div aria-label={`Mapa con la ruta desde Hotel Casa Blanca hasta ${selected.title}`} className={cn("overflow-hidden rounded-[8px] border border-white/10 bg-hotel-ivory", compact ? "h-[300px] xl:h-[240px]" : "h-[clamp(380px,42vw,500px)] md:min-h-[420px] min-[1024px]:h-[430px] min-[1280px]:h-[450px]")} role="region">
            <MapContainer center={[selected.latitude, selected.longitude]} className="h-full w-full" scrollWheelZoom={false} zoom={9}>
              <MapSync destination={selected} route={route} />
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker icon={hotelIcon} position={hotelPosition}><Popup>Hotel Casa Blanca</Popup></Marker>
              <Marker icon={destinationIcon} position={[selected.latitude, selected.longitude]}><Popup>{selected.title}</Popup></Marker>
              {route ? <Polyline color="#002f22" opacity={0.92} positions={route.coordinates} weight={5} /> : null}
            </MapContainer>
          </div>

          <div aria-live="polite" className={cn("mt-3 rounded-[8px] border border-white/10 bg-hotel-ivory text-hotel-forest shadow-hotel-card", compact ? "p-3" : "p-4")}>
            <div className={cn("grid gap-3", compact ? "sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end" : "sm:grid-cols-[1fr_auto] sm:items-end min-[1024px]:!grid-cols-[minmax(0,1fr)_auto_auto]")}>
              <div className="min-w-0">
                {!compact ? <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hotel-gold-700">{categoryFor(selected)}</p> : null}
                <h3 className={cn("hotel-serif mt-0.5 font-bold", compact ? "line-clamp-2 text-xl" : "text-3xl")}>{selected.title}</h3>
                {!compact ? <p className="mt-1 line-clamp-1 text-sm leading-6 text-hotel-muted">{selected.description}</p> : null}
              </div>
              <div className={cn("grid grid-cols-2 gap-2 text-xs", !compact && "sm:min-w-64")}>
                <span className="rounded-[6px] bg-hotel-sage/70 p-2.5">Distancia<br /><strong>{route ? `${route.distanceKm.toFixed(1)} km` : selected.estimatedDistance}</strong></span>
                <span className="rounded-[6px] bg-hotel-sage/70 p-2.5">Tiempo estimado<br /><strong>{route ? `${Math.round(route.durationMinutes)} min` : selected.estimatedTime}</strong></span>
              </div>
              <a className={cn("inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-hotel-forest px-4 text-xs font-bold uppercase text-white transition hover:bg-hotel-forest-800", compact ? "sm:col-span-2" : "min-[1024px]:w-auto")} href={routeUrl} rel="noopener noreferrer" target="_blank">
                Ver ruta <Navigation aria-hidden className="size-4" />
              </a>
            </div>
            {routeLoading ? <p className="mt-2 text-xs text-hotel-muted">Calculando ruta por carretera...</p> : null}
            {routeError ? <p className="mt-2 text-xs font-semibold text-red-700">{routeError}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSync({ destination, route }: { destination: PublicDestination; route: RouteResult | null }) {
  const map = useMap();
  useEffect(() => {
    const invalidate = window.setTimeout(() => map.invalidateSize(), 120);
    const points = route?.coordinates.length ? route.coordinates : [hotelPosition, [destination.latitude, destination.longitude] as [number, number]];
    map.fitBounds(L.latLngBounds(points), { padding: [42, 42], maxZoom: 11, animate: true });
    return () => window.clearTimeout(invalidate);
  }, [destination, route, map]);
  return null;
}
