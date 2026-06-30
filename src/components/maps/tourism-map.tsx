"use client";

import L from "leaflet";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

import { destinations as localDestinations } from "@/data/destinations";
import { siteConfig } from "@/lib/site";
import type { Destination } from "@/types/hotel";

const hotelPosition: [number, number] = [
  siteConfig.coordinates.lat,
  siteConfig.coordinates.lng,
];

function createIcon(label: string, selected = false) {
  return L.divIcon({
    className: "",
    html: `<div style="display:grid;place-items:center;width:${selected ? 40 : 32}px;height:${selected ? 40 : 32}px;border-radius:999px;background:${selected ? "#d6a85f" : "#002f22"};color:white;border:3px solid white;box-shadow:0 8px 22px rgb(0 0 0 / .24);font-size:10px;font-weight:800;">${label}</div>`,
    iconSize: selected ? [40, 40] : [32, 32],
    iconAnchor: selected ? [20, 20] : [16, 16],
  });
}

export function TourismMap({
  compact = false,
  destinations = localDestinations,
}: {
  compact?: boolean;
  destinations?: Destination[];
}) {
  const [selectedId, setSelectedId] = useState(destinations[0]?.id ?? "");
  const selected =
    destinations.find((destination) => destination.id === selectedId) ?? destinations[0];
  const hotelIcon = useMemo(() => createIcon("CB", true), []);
  const destinationIcon = useMemo(() => createIcon("•"), []);
  const selectedIcon = useMemo(() => createIcon("•", true), []);

  if (!selected) {
    return (
      <div className="grid h-[480px] place-items-center rounded-[8px] border border-hotel-line bg-hotel-ivory text-sm text-hotel-muted">
        No hay destinos disponibles.
      </div>
    );
  }

  const route: [number, number][] = [
    hotelPosition,
    [selected.coordinates.lat, selected.coordinates.lng],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.6fr]">
      {!compact ? (
        <div>
          <div className="space-y-3">
            {destinations.slice(0, 4).map((destination) => (
              <button
                className={`flex w-full items-center gap-3 rounded-[8px] border p-3 text-left transition ${
                  selectedId === destination.id
                    ? "border-hotel-forest bg-hotel-ivory shadow-hotel-soft"
                    : "border-hotel-line bg-white/70 hover:border-hotel-gold"
                }`}
                key={destination.id}
                onClick={() => setSelectedId(destination.id)}
                type="button"
              >
                <Image
                  alt={destination.name}
                  className="size-20 rounded-[6px] object-cover"
                  height={80}
                  src={destination.image}
                  width={80}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-sm font-bold text-hotel-forest">
                    <MapPin className="size-4 text-hotel-gold-700" /> {destination.name}
                  </span>
                  <span className="mt-1 block text-xs text-hotel-muted">
                    {destination.distance} · {destination.duration}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-hotel-muted">
                    {destination.description}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-hotel-forest" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="relative overflow-hidden rounded-[8px] border border-hotel-line shadow-hotel-card">
        <MapContainer center={[15.22, -87.65]} className="h-[480px] w-full" scrollWheelZoom={false} zoom={8}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker icon={hotelIcon} position={hotelPosition}>
            <Popup>Hotel Casa Blanca</Popup>
          </Marker>
          {destinations.map((destination) => (
            <Marker
              eventHandlers={{ click: () => setSelectedId(destination.id) }}
              icon={selectedId === destination.id ? selectedIcon : destinationIcon}
              key={destination.id}
              position={[destination.coordinates.lat, destination.coordinates.lng]}
            >
              <Popup>{destination.name}</Popup>
            </Marker>
          ))}
          <Polyline color="#002f22" dashArray="7 8" positions={route} weight={4} />
        </MapContainer>
        <div className="absolute bottom-4 right-4 z-[400] w-64 rounded-[8px] border border-hotel-line bg-hotel-ivory p-4 shadow-hotel-card">
          <Image
            alt={selected.name}
            className="mb-3 h-24 w-full rounded-[6px] object-cover"
            height={120}
            src={selected.image}
            width={240}
          />
          <h3 className="hotel-serif text-2xl font-bold text-hotel-forest">{selected.name}</h3>
          <p className="text-xs text-hotel-muted">{selected.location}</p>
          <div className="my-3 grid grid-cols-2 gap-2 border-y border-hotel-line py-3 text-xs">
            <span>
              Distancia
              <br />
              <strong>{selected.distance}</strong>
            </span>
            <span>
              Tiempo
              <br />
              <strong>{selected.duration}</strong>
            </span>
          </div>
          <button className="flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-hotel-forest text-xs font-bold uppercase text-white" type="button">
            Ver ruta <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}