import type { Metadata } from "next";

import { fontClasses } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = { title: "Administración | Hotel Casa Blanca", robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <html className={fontClasses} lang="es"><body className="flex min-h-full flex-col hotel-surface">{children}</body></html>;
}
