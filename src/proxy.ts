import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, localeCookie, type Locale } from "@/i18n/config";

const legacyPaths: Record<string, string> = {
  "/habitaciones": "/es/habitaciones",
  "/servicios": "/es/servicios",
  "/entorno": "/es/entorno",
  "/contacto": "/es/contacto",
  "/reservar": "/es/reservar",
  "/reservar/confirmacion": "/es/reservar/confirmacion",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/" || legacyPaths[pathname]) {
    const preferred = request.cookies.get(localeCookie)?.value;
    const locale: Locale = pathname === "/" && preferred && hasLocale(preferred) ? preferred : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : legacyPaths[pathname];
    return NextResponse.redirect(url, 307);
  }

  const locale = pathname.split("/")[1];
  const response = NextResponse.next();
  if (hasLocale(locale) && request.cookies.get(localeCookie)?.value !== locale) {
    response.cookies.set(localeCookie, locale, { path: "/", maxAge: 31_536_000, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  }
  return response;
}

export const config = { matcher: ["/", "/habitaciones", "/servicios", "/entorno", "/contacto", "/reservar", "/reservar/confirmacion", "/es/:path*", "/en/:path*"] };
