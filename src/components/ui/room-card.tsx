import { ArrowRight, BedDouble, Snowflake, Users, Wifi } from "lucide-react";
import Image from "next/image";

import type { Room } from "@/types/hotel";
import { LinkButton } from "@/components/ui/button";

export function RoomCard({ room }: { room: Room; compact?: boolean }) {
  return (
    <article className="overflow-hidden rounded-[8px] border border-hotel-line bg-hotel-ivory shadow-hotel-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image alt={room.name} className="object-cover transition duration-500 hover:scale-105" fill sizes="(min-width: 1024px) 25vw, 100vw" src={room.image} />
        <div className="absolute inset-x-0 bottom-0 flex gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 text-xs font-semibold text-white">
          <span className="flex items-center gap-1"><Users className="size-4" /> {room.capacity}</span>
          <span className="flex items-center gap-1"><BedDouble className="size-4" /> {room.beds}</span>
          <span className="flex items-center gap-1"><Wifi className="size-4" /> Wi-Fi</span>
          <Snowflake className="size-4" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="hotel-serif text-2xl font-bold text-hotel-forest">{room.name}</h3>
        <div className="my-3 h-px w-12 bg-hotel-gold" />
        <p className="min-h-14 text-sm leading-7 text-hotel-muted">{room.description}</p>
        <div className="mt-5 flex items-end gap-1 text-hotel-forest">
          <span className="hotel-serif text-3xl font-bold">L{room.price.toLocaleString("es-HN")}</span>
          <span className="pb-1 text-sm text-hotel-muted">/ noche</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2"><LinkButton href={`/habitaciones#${room.id}`} variant="outline">Ver detalles</LinkButton><LinkButton href={`/reservar?room=${room.id}`} variant="forest">Reservar <ArrowRight className="size-4" /></LinkButton></div>
      </div>
    </article>
  );
}