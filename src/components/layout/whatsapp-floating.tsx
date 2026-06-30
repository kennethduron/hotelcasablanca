import { MessageCircle } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function WhatsAppFloating() {
  return (
    <a
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#20d366] text-white shadow-hotel-card transition hover:scale-105"
      href={siteConfig.social.whatsapp}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}