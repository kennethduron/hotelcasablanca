import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-hotel-gold-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="hotel-serif text-4xl font-bold leading-tight text-hotel-forest md:text-5xl">
        {title}
      </h2>
      <div
        className={cn(
          "my-4 flex items-center gap-3 text-hotel-gold-700",
          align === "center" ? "justify-center" : "justify-start",
        )}
      >
        <span className="h-px w-12 bg-hotel-line" />
        <Leaf className="size-4" />
        <span className="h-px w-12 bg-hotel-line" />
      </div>
      {description ? (
        <p className="text-base leading-7 text-hotel-muted">{description}</p>
      ) : null}
    </div>
  );
}