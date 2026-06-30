import type { Room } from "@/types/hotel";

export const rooms: Room[] = [
  {
    id: "habitacion-ejecutiva",
    name: "Habitacion Ejecutiva",
    category: "ejecutiva",
    description: "Privacidad y confort para su estancia de negocios.",
    price: 1100,
    capacity: 2,
    beds: 1,
    amenities: ["Wi-Fi", "Aire acondicionado", "Escritorio", "Parqueo"],
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
    status: "Disponible",
  },
  {
    id: "suite-premium",
    name: "Suite Premium",
    category: "suite",
    description: "Nuestra mejor suite con acabados de primera clase.",
    price: 2380,
    capacity: 2,
    beds: 1,
    amenities: ["Wi-Fi", "Sala privada", "Vista al jardin", "Mini bar"],
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
    status: "Disponible",
  },
  {
    id: "habitacion-doble",
    name: "Habitacion Doble",
    category: "doble",
    description: "Espacio ideal para familias o grupos de trabajo.",
    price: 1300,
    capacity: 2,
    beds: 2,
    amenities: ["Wi-Fi", "Dos camas", "TV", "Aire acondicionado"],
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85",
    status: "Disponible",
  },
  {
    id: "suite-familiar",
    name: "Suite Familiar",
    category: "familiar",
    description: "Comodidad y amplitud para toda la familia.",
    price: 2800,
    capacity: 4,
    beds: 2,
    amenities: ["Wi-Fi", "Sala", "Vista natural", "Desayuno disponible"],
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
    status: "Disponible",
  },
];