import "server-only";

const attempts = new Map<string, number[]>();

export function enforceRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((value) => now - value < windowMs);
  if (recent.length >= limit) throw new Error("Demasiadas solicitudes. Intente nuevamente más tarde.");
  recent.push(now); attempts.set(key, recent);
}
