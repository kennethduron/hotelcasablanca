import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface HotelLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  href?: string;
}

export function HotelLogo({
  className,
  imageClassName,
  priority = false,
  href = "/",
}: HotelLogoProps) {
  return (
    <Link
      aria-label="Hotel Casa Blanca"
      className={cn(
        "relative inline-grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-white/75 bg-white shadow-hotel-soft ring-1 ring-hotel-gold/35",
        className,
      )}
      href={href}
    >
      <Image
        alt="Hotel Casa Blanca"
        className={cn("object-contain p-1.5", imageClassName)}
        fill
        priority={priority}
        sizes="96px"
        src={siteConfig.logo}
      />
    </Link>
  );
}