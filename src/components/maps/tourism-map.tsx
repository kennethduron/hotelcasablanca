"use client";

import L from "leaflet";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

import { siteConfig } from "@/lib/site";
import { getDrivingRoute, type RouteResult } from "@/lib/routing-service";
import type { PublicDestination } from "@/types/public-content";

const hotelPosition: [number, number] = [
  siteConfig.coordinates.lat,
  siteConfig.coordinates.lng,
];

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
  const size = selected ? 38 : 30;
  const background = selected ? "#d6a85f" : "#002f22";

  return L.divIcon({
    className: "",
    html: `<div class="destination-map-marker" style="display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:999px;background:${background};color:white;border:3px solid white;box-shadow:0 8px 22px rgb(0 0 0 / .24);"><span style="display:block;width:8px;height:8px;border-radius:999px;background:white;"></span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -18],
  });
}

export function TourismMap({ compact = false, destinations = [] }: { compact?: boolean; destinations?: PublicDestination[] }) {
  const [selectedId, setSelectedId] = useState(destinations[0]?.id ?? "");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeError, setRouteError] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);
  const selected = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];
  const hotelIcon = useMemo(() => createHotelIcon(), []);
  const destinationIcon = useMemo(() => createDestinationIcon(), []);
  const selectedIcon = useMemo(() => createDestinationIcon(true), []);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    queueMicrotask(() => {
      if (active) {
        setRoute(null);
        setRouteError("");
        setRouteLoading(true);
      }
    });
    getDrivingRoute(hotelPosition, [selected.latitude, selected.longitude])
      .then((result) => { if (active) setRoute(result); })
      .catch(() => { if (active) setRouteError("No fue posible cargar la ruta por carretera. Puede abrirla en Google Maps."); })
      .finally(() => { if (active) setRouteLoading(false); });
    return () => { active = false; };
  }, [selected]);

  if (!selected) {
    return (
      <div className="grid h-[480px] place-items-center rounded-[8px] border border-hotel-line bg-hotel-ivory text-sm text-hotel-muted">
        No hay destinos públicos disponibles en este momento.
      </div>
    );
  }

  const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${hotelPosition.join(",")}&destination=${selected.latitude},${selected.longitude}`;

  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[0.9fr_1.5fr]"}`}>
      {!compact ? (
        <div className="min-w-0 space-y-3">
          {destinations.map((destination) => (
            <button
              className={`flex w-full items-center gap-3 rounded-[8px] border p-3 text-left transition ${
                selectedId === destination.id
                  ? "border-hotel-forest bg-hotel-ivory shadow-hotel-soft"
                  : "border-hotel-line bg-white/80 hover:border-hotel-gold"
              }`}
              key={destination.id}
              onClick={() => setSelectedId(destination.id)}
              type="button"
            >
              <Image alt={destination.title} className="size-20 shrink-0 rounded-[6px] object-cover" height={80} src={destination.image} width={80} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm font-bold text-hotel-forest"><MapPin className="size-4 shrink-0 text-hotel-gold-700" /> {destination.title}</span>
                <span className="mt-1 block text-xs text-hotel-muted">{destination.estimatedDistance} · {destination.estimatedTime}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-5 text-hotel-muted">{destination.description}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-hotel-forest" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-[8px] border border-hotel-line bg-hotel-ivory shadow-hotel-card">
        <div className="relative min-h-[520px]">
          <MapContainer center={[15.22, -87.65]} className="h-[520px] w-full" scrollWheelZoom={false} zoom={8}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker icon={hotelIcon} position={hotelPosition}><Popup>Hotel Casa Blanca</Popup></Marker>
            {destinations.map((destination) => (
              <Marker
                eventHandlers={{ click: () => setSelectedId(destination.id) }}
                icon={selectedId === destination.id ? selectedIcon : destinationIcon}
                key={destination.id}
                position={[destination.latitude, destination.longitude]}
              >
                <Popup>{destination.title}</Popup>
              </Marker>
            ))}
            {route ? <Polyline color="#002f22" opacity={0.9} positions={route.coordinates} weight={5} /> : null}
          </MapContainer>
          <div className="relative z-20 border-t border-hotel-line bg-hotel-ivory p-4 shadow-hotel-card md:absolute md:bottom-4 md:right-4 md:w-72 md:rounded-[8px] md:border">
            <div className="relative mb-3 h-28 overflow-hidden rounded-[6px]"><Image alt={selected.title} className="object-cover" fill sizes="288px" src={selected.image} /></div>
            <h3 className="hotel-serif text-2xl font-bold text-hotel-forest">{selected.title}</h3>
            <p className="text-xs text-hotel-muted">Honduras</p>
            {routeLoading ? <p className="my-2 text-xs text-hotel-muted">Calculando ruta por carretera...</p> : null}
            {routeError ? <p className="my-2 text-xs text-red-700">{routeError}</p> : null}
            <div className="my-3 grid grid-cols-2 gap-2 border-y border-hotel-line py-3 text-xs">
              <span>Distancia<br /><strong>{route ? `${route.distanceKm.toFixed(1)} km` : selected.estimatedDistance}</strong></span>
              <span>Tiempo estimado<br /><strong>{route ? `${Math.round(route.durationMinutes)} min` : selected.estimatedTime}</strong></span>
            </div>
            <a className="flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-hotel-forest px-4 text-xs font-bold uppercase text-white transition hover:bg-hotel-forest-800" href={routeUrl} rel="noreferrer" target="_blank">
              Ver ruta <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
