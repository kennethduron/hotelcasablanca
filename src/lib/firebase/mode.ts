import "server-only";

import { hasFirebaseAdminConfig } from "@/lib/firebase/admin";

export type DataMode = "firebase" | "demo";

export function getDataMode(): DataMode {
  if (process.env.VERCEL_ENV === "preview") throw new Error("El modo demo de Preview requiere identificación visual y está deshabilitado.");
  if (process.env.DEMO_MODE === "true") return "demo";
  if (hasFirebaseAdminConfig()) return "firebase";
  if (process.env.VERCEL_ENV === "production" || process.env.DEMO_MODE === "false") {
    throw new Error("Firebase no está configurado y DEMO_MODE no está habilitado explícitamente.");
  }
  return "demo";
}
