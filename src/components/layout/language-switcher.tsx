"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { switchLocalePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale, labels, mobile = false, onNavigate }: { locale: Locale; labels: Dictionary["navbar"]; mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function select(nextLocale: Locale) {
    const query = window.location.search;
    const hash = window.location.hash;
    router.push(`${switchLocalePath(pathname, nextLocale)}${query}${hash}`);
    setOpen(false);
    onNavigate?.();
  }

  return (
    <div className={cn("relative", mobile && "mt-3 border-t border-white/10 pt-3")} ref={root}>
      <button aria-expanded={open} aria-haspopup="menu" aria-label={labels.selectLanguage} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-[6px] border border-white/25 px-3 text-sm font-bold uppercase text-white hover:border-hotel-gold hover:text-hotel-gold", mobile && "w-full justify-between px-4")} onClick={() => setOpen((value) => !value)} type="button">
        <span className="flex items-center gap-2"><Languages aria-hidden className="size-4" />{locale.toUpperCase()}</span><ChevronDown aria-hidden className="size-4" />
      </button>
      {open ? (
        <div aria-label={labels.languageMenu} className={cn("z-[1200] min-w-44 rounded-[8px] border border-white/10 bg-hotel-forest p-2 shadow-hotel-card", mobile ? "mt-2" : "absolute right-0 top-[calc(100%+.5rem)]")} role="menu">
          {(["es", "en"] as const).map((item) => (
            <button className="flex min-h-11 w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-white hover:bg-white/10 hover:text-hotel-gold" key={item} onClick={() => select(item)} role="menuitem" type="button">
              {item === "es" ? labels.spanish : labels.english}{item === locale ? <Check aria-hidden className="size-4" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
