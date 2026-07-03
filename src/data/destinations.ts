import type { Destination } from "@/types/hotel";

export const destinations: Destination[] = [
  {
    id: "la-ceiba",
    name: "La Ceiba",
    location: "Atlántida, Honduras",
    distance: "164.6 km",
    duration: "2h 35m",
    description: "Playas de arena blanca, mar turquesa y una vibrante vida costera.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 15.7792, lng: -86.7931 },
  },
  {
    id: "pico-bonito",
    name: "Parque Nacional Pico Bonito",
    location: "Atlántida, Honduras",
    distance: "95.3 km",
    duration: "1h 45m",
    description: "Aventura, senderismo y biodiversidad en uno de los parques más bellos.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 15.5898, lng: -86.8749 },
  },
  {
    id: "tela",
    name: "Tela",
    location: "Atlántida, Honduras",
    distance: "72.8 km",
    duration: "1h 30m",
    description: "Playas, cultura garífuna y el famoso Punta Sal.",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 15.7759, lng: -87.4673 },
  },
  {
    id: "copan-ruinas",
    name: "Copán Ruinas",
    location: "Copán, Honduras",
    distance: "147.2 km",
    duration: "2h 50m",
    description: "Historia, arqueología y la majestuosa civilización Maya.",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 14.8389, lng: -89.1558 },
  },
  {
    id: "lago-yojoa",
    name: "Lago de Yojoa",
    location: "Cortés, Honduras",
    distance: "58.4 km",
    duration: "1h 10m",
    description: "Naturaleza, gastronomía local y vistas serenas al lago.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 14.8739, lng: -87.9797 },
  },
  {
    id: "pulhapanzak",
    name: "Pulhapanzak",
    location: "Cortés, Honduras",
    distance: "67.9 km",
    duration: "1h 20m",
    description: "Cataratas, aventura y uno de los paisajes más visitados del país.",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 14.9016, lng: -87.9559 },
  },
  {
    id: "lancetilla",
    name: "Jardín Botánico Lancetilla",
    location: "Tela, Honduras",
    distance: "79.2 km",
    duration: "1h 35m",
    description: "Vegetación tropical, senderos y colecciones botánicas históricas.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85",
    coordinates: { lat: 15.7463, lng: -87.4596 },
  },
];