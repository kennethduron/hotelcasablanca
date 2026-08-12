import { Cormorant_Garamond, Geist } from "next/font/google";

export const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
export const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600", "700"] });
export const fontClasses = `${geistSans.variable} ${cormorant.variable} h-full antialiased`;
