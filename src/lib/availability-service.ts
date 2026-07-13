import "server-only";

import { rooms as localRooms } from "@/data/rooms";
import { getAdminDb } from "@/lib/firebase/admin";
import { firestoreCollections } from "@/lib/firebase/collections";
import { getDataMode } from "@/lib/firebase/mode";
import { getRooms } from "@/lib/repositories/hotel-repository";
import type { Room } from "@/types/hotel";

const blockingStatuses = new Set(["paid", "pagada", "confirmed", "confirmada", "checked_in", "check-in realizado"]);
const unavailableRoomStatuses = new Set(["mantenimiento", "fuera de servicio"]);
export interface AvailabilityRequest { roomId: string; checkIn: string; checkOut: string; adults: number; children: number }
export interface AvailabilityResult { available: boolean; reason?: string; alternatives: Room[]; blockedDates: string[]; source: "firebase" | "demo" }
type Occupancy = { roomId?: string; roomTypeId?: string; checkIn?: string; checkOut?: string; status?: string; paymentStatus?: string };
type Block = { roomId?: string; roomTypeId?: string; startDate?: string; endDate?: string; checkIn?: string; checkOut?: string; active?: boolean };
const overlaps = (start: string, end: string, existingStart?: string, existingEnd?: string) => Boolean(existingStart && existingEnd && start < existingEnd && end > existingStart);

async function loadOccupancy() {
  if (getDataMode() === "demo") return { reservations: [] as Occupancy[], blocks: [] as Block[], source: "demo" as const };
  const db = getAdminDb();
  const [reservationSnapshot, blockSnapshot] = await Promise.all([
    db.collection(firestoreCollections.reservations).get(),
    db.collection(firestoreCollections.blockedDates).where("active", "==", true).get(),
  ]);
  return { reservations: reservationSnapshot.docs.map((item) => item.data() as Occupancy), blocks: blockSnapshot.docs.map((item) => item.data() as Block), source: "firebase" as const };
}
function roomIsAvailable(room: Room, request: AvailabilityRequest, reservations: Occupancy[], blocks: Block[]) {
  if (room.active === false || unavailableRoomStatuses.has(room.status.toLocaleLowerCase("es"))) return false;
  const reserved = reservations.some((item) => {
    const status = (item.status ?? "").toLocaleLowerCase("es"); const payment = (item.paymentStatus ?? "").toLocaleLowerCase("es");
    return (item.roomId === room.id || item.roomTypeId === room.id) && (blockingStatuses.has(status) || blockingStatuses.has(payment)) && overlaps(request.checkIn, request.checkOut, item.checkIn, item.checkOut);
  });
  const manuallyBlocked = blocks.some((item) => item.active !== false && (item.roomId === room.id || item.roomTypeId === room.id) && overlaps(request.checkIn, request.checkOut, item.startDate ?? item.checkIn, item.endDate ?? item.checkOut));
  return !reserved && !manuallyBlocked;
}
export async function checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResult> {
  const rooms = await getRooms(); const room = rooms.find((item) => item.id === request.roomId); const source = getDataMode();
  if (!room) return { available: false, reason: "Habitación no encontrada.", alternatives: [], blockedDates: [], source };
  if (!request.checkIn || !request.checkOut || request.checkIn >= request.checkOut) return { available: false, reason: "El check-out debe ser posterior al check-in.", alternatives: [], blockedDates: [], source };
  const capacity = (room.capacityAdults ?? room.capacity) + (room.capacityChildren ?? 0);
  if (request.adults < 1 || request.children < 0 || request.adults + request.children > capacity) return { available: false, reason: "La cantidad de huéspedes excede la capacidad de la habitación.", alternatives: [], blockedDates: [], source };
  const occupancy = await loadOccupancy(); const available = roomIsAvailable(room, request, occupancy.reservations, occupancy.blocks);
  const alternatives = available ? [] : rooms.filter((item) => item.id !== room.id && item.capacity >= request.adults + request.children && roomIsAvailable(item, request, occupancy.reservations, occupancy.blocks));
  return { available, alternatives, blockedDates: [], source: occupancy.source };
}
export const demoRooms = localRooms;