import { MessageCircle } from "lucide-react";

import { siteConfig } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function WhatsAppFloating({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const message = locale === "es" ? "Hola, quisiera obtener más información sobre Hotel Casa Blanca." : "Hello, I would like more information about Hotel Casa Blanca.";
  return (
    <a
      aria-label={dictionary.accessibility.whatsapp}
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#20d366] text-white shadow-hotel-card transition hover:scale-105"
      href={`${siteConfig.social.whatsapp}?text=${encodeURIComponent(message)}`}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
