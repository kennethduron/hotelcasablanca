import { Footer } from "@/components/layout/footer";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { WhatsAppFloating } from "@/components/layout/whatsapp-floating";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
      <Footer />
      <WhatsAppFloating />
    </>
  );
}