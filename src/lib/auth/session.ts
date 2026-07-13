import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAdminAuth, hasFirebaseAdminConfig } from "@/lib/firebase/admin";

export const adminSessionCookie = "hotel_admin_session";
export const authorizedRoles = ["admin", "reception", "management", "staff"] as const;
export type AuthorizedRole = (typeof authorizedRoles)[number];

export async function getAdminSession() {
  if (!hasFirebaseAdminConfig()) return null;
  const value = (await cookies()).get(adminSessionCookie)?.value;
  if (!value) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(value, true);
    if (!authorizedRoles.includes(decoded.role as AuthorizedRole)) return null;
    return { uid: decoded.uid, email: decoded.email ?? "", role: decoded.role as AuthorizedRole };
  } catch { return null; }
}

export async function requireAdminSession(roles: readonly AuthorizedRole[] = authorizedRoles) {
  const session = await getAdminSession();
  if (!session || !roles.includes(session.role)) redirect("/admin/login");
  return session;
}
