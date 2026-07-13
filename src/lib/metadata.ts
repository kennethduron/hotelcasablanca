import type { Metadata } from "next";

export const siteUrl = "https://hotelcasablancahn.vercel.app";

const socialImage = {
  url: "/brand/Casa_Blanca_Hotel_Logo.png",
  width: 897,
  height: 847,
  alt: "Hotel Casa Blanca",
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Hotel Casa Blanca`,
      description,
      url: path,
      locale: "es_HN",
      siteName: "Hotel Casa Blanca",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hotel Casa Blanca`,
      description,
      images: [socialImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
