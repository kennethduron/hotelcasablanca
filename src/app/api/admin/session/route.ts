import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminSessionCookie, authorizedRoles } from "@/lib/auth/session";
import { getAdminAuth, hasFirebaseAdminConfig } from "@/lib/firebase/admin";

const bodySchema = z.object({ idToken: z.string().min(100).max(10000) });
const expiresIn = 60 * 60 * 8 * 1000;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  if (!hasFirebaseAdminConfig()) return NextResponse.json({ error: "Firebase Auth no está configurado." }, { status: 503 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  try {
    const decoded = await getAdminAuth().verifyIdToken(parsed.data.idToken, true);
    if (!authorizedRoles.includes(decoded.role as (typeof authorizedRoles)[number])) return NextResponse.json({ error: "Usuario sin rol autorizado." }, { status: 403 });
    const session = await getAdminAuth().createSessionCookie(parsed.data.idToken, { expiresIn });
    (await cookies()).set(adminSessionCookie, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: expiresIn / 1000 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 }); }
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
  (await cookies()).set(adminSessionCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
