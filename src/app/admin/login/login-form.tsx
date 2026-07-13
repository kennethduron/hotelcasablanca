"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth, hasFirebaseConfig } from "@/lib/firebase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(formData: FormData) {
    if (!hasFirebaseConfig()) { setError("Firebase Auth no está configurado para este entorno."); return; }
    setLoading(true); setError("");
    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), String(formData.get("email")), String(formData.get("password")));
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: await credential.user.getIdToken() }) });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "No fue posible iniciar sesión.");
      router.replace("/admin"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No fue posible iniciar sesión."); }
    finally { setLoading(false); }
  }
  return <form action={submit} className="w-full max-w-md rounded-[8px] border border-hotel-line bg-hotel-ivory p-6 shadow-hotel-card">
    <h1 className="hotel-serif text-4xl font-bold text-hotel-forest">Acceso administrativo</h1>
    <p className="mt-2 text-sm text-hotel-muted">Ingrese con una cuenta autorizada del hotel.</p>
    <label className="mt-6 block text-sm font-semibold">Correo electrónico<input autoComplete="username" className="mt-2 h-12 w-full rounded border border-hotel-line px-3" name="email" required type="email" /></label>
    <label className="mt-4 block text-sm font-semibold">Contraseña<input autoComplete="current-password" className="mt-2 h-12 w-full rounded border border-hotel-line px-3" name="password" required type="password" /></label>
    {error ? <p aria-live="polite" className="mt-4 text-sm text-red-700">{error}</p> : null}
    <Button className="mt-6 w-full" disabled={loading} type="submit">{loading ? "Verificando…" : "Iniciar sesión"}</Button>
  </form>;
}
