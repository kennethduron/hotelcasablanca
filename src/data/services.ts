import {
  Car,
  Dumbbell,
  Flower2,
  ShieldCheck,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";

export const mainServices = [
  {
    id: "restaurante",
    name: "Restaurante",
    description: "Gastronomía local e internacional con ingredientes frescos.",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "eventos",
    name: "Eventos y Negocios",
    description: "Salones equipados para reuniones, conferencias, bodas y eventos.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "piscina",
    name: "Piscina",
    description: "Relájate en nuestra piscina rodeada de naturaleza.",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "jardines",
    name: "Jardines Naturales",
    description: "Amplias áreas verdes que conectan con la tranquilidad.",
    icon: Flower2,
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "parqueo",
    name: "Parqueo Privado",
    description: "Parqueo amplio, seguro y gratuito para huéspedes.",
    icon: Car,
    image:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "gimnasio",
    name: "Gimnasio",
    description: "Equipo moderno para mantener tu rutina durante la estadía.",
    icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
  },
];

export const quickBenefits = [
  "Entorno natural",
  "Seguridad 24/7",
  "Wi-Fi de alta velocidad",
  "Parqueo privado",
  "Restaurante",
  "Atención personalizada",
];

export const benefitIcons = {
  wifi: Wifi,
  security: ShieldCheck,
  parking: Car,
  restaurant: Utensils,
};