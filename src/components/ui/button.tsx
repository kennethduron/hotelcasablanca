import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "gold" | "forest" | "outline" | "outlineLight" | "outlineDark" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  gold: "hotel-gold-gradient text-hotel-forest-900 shadow-hotel-soft hover:brightness-105 focus-visible:ring-hotel-gold disabled:bg-stone-200 disabled:text-stone-600",
  forest: "bg-hotel-forest text-white shadow-hotel-soft hover:bg-hotel-forest-800 focus-visible:ring-hotel-gold disabled:bg-stone-300 disabled:text-stone-700",
  outline: "border border-hotel-forest bg-transparent text-hotel-forest hover:bg-hotel-forest hover:text-white focus-visible:ring-hotel-forest",
  outlineDark: "border border-hotel-forest bg-transparent text-hotel-forest hover:bg-hotel-forest hover:text-white focus-visible:ring-hotel-forest",
  outlineLight: "border border-white/85 bg-transparent text-white hover:bg-white hover:text-hotel-forest focus-visible:ring-hotel-gold",
  ghost: "text-hotel-forest hover:bg-hotel-sage/60 focus-visible:ring-hotel-forest",
  danger: "bg-red-700 text-white shadow-hotel-soft hover:bg-red-800 focus-visible:ring-red-700 disabled:bg-stone-300 disabled:text-stone-700",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] px-5 py-3 text-center text-sm font-bold uppercase leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none";

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

export function LinkButton({ className, variant = "forest", href, ...props }: LinkButtonProps) {
  return <Link className={cn(base, variants[variant], className)} href={href} {...props} />;
}
