import { fontClasses } from "@/lib/fonts";
import "../globals.css";

export default function LegacyRootLayout({ children }: { children: React.ReactNode }) {
  return <html className={fontClasses} lang="es"><body className="flex min-h-full flex-col hotel-surface">{children}</body></html>;
}
