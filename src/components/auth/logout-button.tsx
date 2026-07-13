"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { getFirebaseAuth, hasFirebaseConfig } from "@/lib/firebase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      if (hasFirebaseConfig()) await signOut(getFirebaseAuth());
    } finally {
      router.replace("/admin/login"); router.refresh(); setLoading(false);
    }
  }
  return <button className="rounded border border-hotel-line px-3 py-2 text-xs font-bold text-hotel-forest" disabled={loading} onClick={logout} type="button">{loading ? "Cerrando…" : "Cerrar sesión"}</button>;
}
