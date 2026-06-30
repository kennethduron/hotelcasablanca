import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

interface HotelLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function HotelLogo({
  className,
  imageClassName,
  priority = false,
}: HotelLogoProps) {
  return (
    <Link className={cn("inline-flex items-center", className)} href="/">
      <Image
        alt="Hotel Casa Blanca"
        className={cn("h-auto w-28 object-contain", imageClassName)}
        height={140}
        priority={priority}
        src={siteConfig.logo}
        width={180}
      />
    </Link>
  );
}