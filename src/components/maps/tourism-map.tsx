"use client";

import L from "leaflet";
import { ArrowLeft, ArrowRight, Clock, Navigation } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

import { siteConfig } from "@/lib/site";
import { getDrivingRoute, type RouteResult } from "@/lib/routing-service";
import { cn } from "@/lib/utils";
import type { PublicDestination } from "@/types/public-content";

const hotelPosition: [number, number] = [siteConfig.coordinates.lat, siteConfig.coordinates.lng];

function createHotelIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="hotel-map-marker" style="display:grid;place-items:center;width:54px;height:54px;border-radius:999px;background:#fff;border:3px solid #d6a85f;box-shadow:0 12px 28px rgb(0 0 0 / .28);overflow:hidden;"><img src="${siteConfig.logo}" alt="Hotel Casa Blanca" style="width:48px;height:48px;object-fit:contain;border-radius:999px;" /></div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    popupAnchor: [0, -24],
  });
}

function createDestinationIcon(selected = false) {
  const size = selected ? 42 : 32;
  const background = selected ? "#d6a85f" : "#002f22";
  return L.divIcon({
    className: "",
    html: `<div style="display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:999px;background:${background};border:3px solid white;box-shadow:0 8px 22px rgb(0 0 0 / .26);"><span style="display:block;width:9px;height:9px;border-radius:999px;background:white;"></span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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
  const [reducedMotion, setReducedMotion] = useState(false);
  const touch = useRef<number | null>(null);
  const selected = destinations[selectedIndex];
  const routeKey = selected?.slug ?? "";
  const route = routeState.key === routeKey ? routeState.route : null;
  const routeError = routeState.key === routeKey ? routeState.error : "";
  const routeLoading = Boolean(selected && routeState.key !== routeKey);
  const hotelIcon = useMemo(() => createHotelIcon(), []);
  const destinationIcon = useMemo(() => createDestinationIcon(), []);
  const selectedIcon = useMemo(() => createDestinationIcon(true), []);

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

  useEffect(() => {
    if (!selected) return;
    let active = true;
    getDrivingRoute(hotelPosition, [selected.latitude, selected.longitude])
      .then((result) => { if (active) setRouteState({ key: selected.slug, route: result, error: "" }); })
      .catch(() => { if (active) setRouteState({ key: selected.slug, route: null, error: "Ruta no disponible temporalmente." }); });
    return () => { active = false; };
  }, [selected]);

  function move(delta: number) {
    if (!destinations.length) return;
    setPaused(true);
    setSelectedIndex((value) => (value + delta + destinations.length) % destinations.length);
  }

  if (!selected) {
    return <div className="grid h-[480px] place-items-center rounded-[8px] border border-hotel-line bg-hotel-ivory text-sm text-hotel-muted">No hay destinos públicos disponibles en este momento.</div>;
  }

  const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${hotelPosition.join(",")}&destination=${selected.latitude},${selected.longitude}`;

  return (
    <section
      aria-label="Mapa turístico interactivo"
      className={cn("overflow-hidden rounded-[8px] bg-hotel-forest-900 p-3 text-white shadow-[0_28px_80px_rgb(0_31_22_/_0.24)]", compact ? "" : "")}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => { touch.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => { if (touch.current === null) return; const delta = (event.changedTouches[0]?.clientX ?? touch.current) - touch.current; if (Math.abs(delta) > 45) move(delta > 0 ? -1 : 1); touch.current = null; }}
    >
      <div className={cn("grid gap-3", compact ? "" : "lg:grid-cols-[0.92fr_1.4fr]")}>
        <div className="min-w-0 rounded-[8px] border border-white/10 bg-white/7 p-3 backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-hotel-gold">Explora cerca</p>
              <h3 className="hotel-serif text-3xl font-bold">Destinos desde el hotel</h3>
            </div>
            <div className="flex gap-2">
              <button aria-label="Destino anterior" className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-hotel-gold hover:text-hotel-forest" onClick={() => move(-1)} type="button"><ArrowLeft className="size-4" /></button>
              <button aria-label="Destino siguiente" className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-hotel-gold hover:text-hotel-forest" onClick={() => move(1)} type="button"><ArrowRight className="size-4" /></button>
            </div>
          </div>
          <div className="grid auto-cols-[82%] grid-flow-col gap-3 overflow-x-auto pb-2 md:auto-cols-[46%] lg:grid-flow-row lg:auto-cols-auto lg:overflow-visible">
            {destinations.map((destination, index) => (
              <button
                aria-current={index === selectedIndex}
                className={cn("group relative h-48 overflow-hidden rounded-[8px] border text-left transition duration-300 lg:h-36", index === selectedIndex ? "border-hotel-gold shadow-hotel-card lg:h-48" : "border-white/15 opacity-80 hover:opacity-100")}
                key={destination.id}
                onClick={() => { setPaused(true); setSelectedIndex(index); }}
                type="button"
              >
                <Image alt={destination.title} className="object-cover transition duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 82vw, 420px" src={destination.image} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 block p-4">
                  <span className="mb-2 inline-flex rounded-full bg-hotel-gold px-3 py-1 text-[10px] font-bold uppercase text-hotel-forest">{categoryFor(destination)}</span>
                  <span className="block hotel-serif text-2xl font-bold text-white">{destination.title}</span>
                  <span className="mt-1 flex items-center gap-3 text-xs text-white/85"><Clock className="size-3" />{destination.estimatedTime}<span>{destination.estimatedDistance}</span></span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-white/10 bg-hotel-ivory shadow-hotel-card">
          <div className="relative min-h-[560px]">
            <MapContainer center={[selected.latitude, selected.longitude]} className="h-[560px] w-full" scrollWheelZoom={false} zoom={9}>
              <MapSync destination={selected} route={route} />
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker icon={hotelIcon} position={hotelPosition}><Popup>Hotel Casa Blanca</Popup></Marker>
              {destinations.map((destination, index) => (
                <Marker eventHandlers={{ click: () => { setPaused(true); setSelectedIndex(index); } }} icon={index === selectedIndex ? selectedIcon : destinationIcon} key={destination.id} position={[destination.latitude, destination.longitude]}><Popup>{destination.title}</Popup></Marker>
              ))}
              {route ? <Polyline color="#002f22" opacity={0.9} positions={route.coordinates} weight={5} /> : null}
            </MapContainer>
            <div className="relative z-20 border-t border-hotel-line bg-hotel-ivory p-4 text-hotel-forest md:absolute md:bottom-4 md:left-4 md:w-[min(24rem,calc(100%-2rem))] md:rounded-[8px] md:border md:shadow-hotel-card">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hotel-gold-700">{categoryFor(selected)}</p>
              <h3 className="hotel-serif mt-1 text-3xl font-bold">{selected.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-hotel-muted">{selected.description}</p>
              <div className="my-4 grid grid-cols-2 gap-2 text-xs">
                <span className="rounded-[6px] bg-hotel-sage/70 p-3">Distancia<br /><strong>{route ? `${route.distanceKm.toFixed(1)} km` : selected.estimatedDistance}</strong></span>
                <span className="rounded-[6px] bg-hotel-sage/70 p-3">Tiempo estimado<br /><strong>{route ? `${Math.round(route.durationMinutes)} min` : selected.estimatedTime}</strong></span>
              </div>
              {routeLoading ? <p className="mb-3 text-xs text-hotel-muted">Calculando ruta por carretera...</p> : null}
              {routeError ? <p className="mb-3 text-xs font-semibold text-red-700">{routeError}</p> : null}
              <a className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-hotel-forest px-4 text-xs font-bold uppercase text-white transition hover:bg-hotel-forest-800" href={routeUrl} rel="noopener noreferrer" target="_blank">
                Ver ruta <Navigation className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSync({ destination, route }: { destination: PublicDestination; route: RouteResult | null }) {
  const map = useMap();
  useEffect(() => {
    window.setTimeout(() => map.invalidateSize(), 120);
    const points = route?.coordinates.length ? route.coordinates : [hotelPosition, [destination.latitude, destination.longitude] as [number, number]];
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 11, animate: true });
  }, [destination, route, map]);
  return null;
}
