export interface RouteResult { coordinates: [number, number][]; distanceKm: number; durationMinutes: number }
const cache = new Map<string, RouteResult>();
export async function getDrivingRoute(origin: [number, number], destination: [number, number]): Promise<RouteResult> {
  const key = `${origin.join(",")}:${destination.join(",")}`;
  const cached = cache.get(key); if (cached) return cached;
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("No se pudo consultar la ruta.");
    const payload = await response.json() as { routes?: Array<{ geometry: { coordinates: [number, number][] }; distance: number; duration: number }> };
    const route = payload.routes?.[0]; if (!route) throw new Error("Ruta no disponible.");
    const result = { coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]), distanceKm: route.distance / 1000, durationMinutes: route.duration / 60 } satisfies RouteResult;
    cache.set(key, result); return result;
  } finally { clearTimeout(timeout); }
}