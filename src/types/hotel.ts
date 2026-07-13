export type RoomCategory = "ejecutiva" | "suite" | "doble" | "familiar";

export type RoomStatus =
  | "Disponible"
  | "Ocupada"
  | "Reservada"
  | "Mantenimiento"
  | "Fuera de servicio";

export type ReservationStatus =
  | "Pendiente de revisión"
  | "En espera de pago"
  | "Pagada"
  | "Confirmada"
  | "Check-in realizado"
  | "Check-out realizado"
  | "Cancelada"
  | "No Show";

export type PaymentStatus = "Pendiente" | "Enviado" | "Pagado" | "Cancelado";

export type PreferredContactMethod =
  | "WhatsApp"
  | "Correo electrónico"
  | "Llamada telefónica";

export interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  description: string;
  price: number;
  capacity: number;
  beds: number;
  amenities: string[];
  image: string;
  status: RoomStatus;
  slug?: string;
  roomType?: string;
  totalUnits?: number;
  capacityAdults?: number;
  capacityChildren?: number;
  active?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  distance: string;
  duration: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  marineTransferNote?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
  guestDocumentNumber: string;
  guestDocumentType: string;
  guestAddress?: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  plan: string;
  ratePerNight: number;
  taxes: number;
  notes?: string;
  total: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentLink?: string;
  preferredContactMethod: PreferredContactMethod;
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  confirmedBy?: string;
}