import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hotelcasablanca.hn"),
  title: {
    default: "Hotel Casa Blanca | Hotel en El Progreso, Yoro",
    template: "%s | Hotel Casa Blanca",
  },
  description:
    "Hotel Casa Blanca en El Progreso, Yoro, Honduras. Habitaciones, piscina, eventos, restaurante y entorno natural para una estancia premium.",
  keywords: [
    "Hotel en El Progreso Yoro",
    "Hotel Casa Blanca",
    "Hoteles en El Progreso Honduras",
    "Hotel con piscina en El Progreso",
    "Hotel para eventos en El Progreso",
  ],
  openGraph: {
    title: "Hotel Casa Blanca",
    description:
      "Su oasis de descanso en El Progreso, Yoro. Naturaleza, confort y hospitalidad en perfecta armonía.",
    locale: "es_HN",
    siteName: "Hotel Casa Blanca",
    type: "website",
    images: [
      {
        url: "/brand/Casa_Blanca_Hotel_Logo.png",
        width: 1200,
        height: 630,
        alt: "Hotel Casa Blanca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Casa Blanca",
    description: "Hotel premium en El Progreso, Yoro, Honduras.",
    images: ["/brand/Casa_Blanca_Hotel_Logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-HN"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col hotel-surface">{children}</body>
    </html>
  );
}