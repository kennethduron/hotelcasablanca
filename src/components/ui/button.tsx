import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "gold" | "forest" | "outline" | "ghost";

const variants: Record<ButtonVariant, string> = {
  gold:
    "hotel-gold-gradient text-hotel-forest-900 shadow-hotel-soft hover:brightness-105",
  forest:
    "bg-hotel-forest text-white shadow-hotel-soft hover:bg-hotel-forest-800",
  outline:
    "border border-hotel-forest text-hotel-forest hover:bg-hotel-forest hover:text-white",
  ghost: "text-hotel-forest hover:bg-hotel-sage/60",
};

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[6px] px-5 text-sm font-bold uppercase transition";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({ className, variant = "forest", ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function LinkButton({
  className,
  variant = "forest",
  href,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(base, variants[variant], className)} href={href} {...props} />
  );
}