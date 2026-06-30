import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { mainServices } from "@/data/services";

type Service = (typeof mainServices)[number];

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <article className="overflow-hidden rounded-[8px] border border-hotel-line bg-hotel-ivory shadow-hotel-card">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image alt={service.name} className="object-cover transition duration-500 hover:scale-105" fill sizes="(min-width: 1024px) 33vw, 100vw" src={service.image} />
      </div>
      <div className="relative p-5">
        <div className="-mt-10 mb-4 grid size-14 place-items-center rounded-full border border-hotel-line bg-hotel-ivory text-hotel-forest shadow-hotel-soft">
          <Icon className="size-7" />
        </div>
        <h3 className="hotel-serif text-2xl font-bold text-hotel-forest">{service.name}</h3>
        <p className="mt-2 min-h-14 text-sm leading-7 text-hotel-muted">{service.description}</p>
        <a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-hotel-gold-700" href="#">
          Ver más <ArrowRight className="size-4" />
        </a>
      </div>
    </article>
  );
}