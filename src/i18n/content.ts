import type { Locale } from "@/i18n/config";
import type { PublicDestination, PublicGalleryImage, PublicRoom, PublicService, PublicSettings } from "@/types/public-content";

type Translation = { es: string; en: string };
type ContentTranslation = { title: Translation; shortDescription?: Translation; description?: Translation; amenities?: { es: string[]; en: string[] }; estimatedTime?: Translation };

export const roomTranslations: Record<string, ContentTranslation> = {
  "habitacion-ejecutiva": { title: { es: "Habitación Ejecutiva", en: "Executive Room" }, shortDescription: { es: "Confort sobrio para viajes de negocios o descanso individual.", en: "Refined comfort for business trips or a peaceful solo stay." }, description: { es: "Habitación elegante con escritorio, cama confortable, climatización y amenidades esenciales para una estancia tranquila en El Progreso, Yoro.", en: "An elegant room with a work desk, comfortable bed, air conditioning, and essential amenities for a restful stay in El Progreso, Yoro." }, amenities: { es: ["Wi-Fi", "Aire acondicionado", "Escritorio", "Televisión", "Baño privado"], en: ["Wi-Fi", "Air conditioning", "Work desk", "Television", "Private bathroom"] } },
  "suite-premium": { title: { es: "Suite Premium", en: "Premium Suite" }, shortDescription: { es: "Una experiencia amplia y serena para escapadas especiales.", en: "A spacious, serene setting for a special getaway." }, description: { es: "Suite con mayor amplitud, sala de descanso, acabados cálidos y detalles pensados para una visita memorable cerca de los principales destinos turísticos.", en: "A generously sized suite with a lounge area, warm finishes, and thoughtful details for a memorable stay near the region’s leading attractions." }, amenities: { es: ["Wi-Fi", "Aire acondicionado", "Sala de estar", "Amenidades premium", "Baño privado"], en: ["Wi-Fi", "Air conditioning", "Living area", "Premium amenities", "Private bathroom"] } },
  "habitacion-doble": { title: { es: "Habitación Doble", en: "Double Room" }, shortDescription: { es: "Práctica y cómoda para compartir el viaje con tranquilidad.", en: "A practical, comfortable room for sharing your stay." }, description: { es: "Habitación con dos camas, espacios funcionales y ambiente acogedor para amigos, compañeros de trabajo o familias pequeñas.", en: "A welcoming room with two beds and practical spaces for friends, colleagues, or small families." }, amenities: { es: ["Wi-Fi", "Aire acondicionado", "Dos camas", "Televisión", "Baño privado"], en: ["Wi-Fi", "Air conditioning", "Two beds", "Television", "Private bathroom"] } },
  "suite-familiar": { title: { es: "Suite Familiar", en: "Family Suite" }, shortDescription: { es: "Más espacio para descansar en familia con comodidad.", en: "Extra space for a comfortable family stay." }, description: { es: "Suite familiar con distribución amplia, camas cómodas y amenidades para que adultos y niños disfruten una estadía relajada.", en: "A spacious family suite with comfortable beds and amenities designed for a relaxing stay with children." }, amenities: { es: ["Wi-Fi", "Aire acondicionado", "Área familiar", "Televisión", "Baño privado"], en: ["Wi-Fi", "Air conditioning", "Family area", "Television", "Private bathroom"] } },
};

export const serviceTranslations: Record<string, ContentTranslation> = {
  restaurante: { title: { es: "Restaurante", en: "Restaurant" }, description: { es: "Sabores locales e internacionales servidos en un ambiente cómodo para desayunos, almuerzos y cenas.", en: "Local and international flavors served in a welcoming setting for breakfast, lunch, and dinner." } },
  eventos: { title: { es: "Eventos y Negocios", en: "Events & Business" }, description: { es: "Espacios versátiles para reuniones, celebraciones privadas y actividades corporativas.", en: "Versatile spaces for meetings, private celebrations, and corporate events." } },
  piscina: { title: { es: "Piscina", en: "Pool" }, description: { es: "Área refrescante para relajarte y disfrutar el clima cálido de El Progreso.", en: "A refreshing space to relax and enjoy El Progreso’s warm climate." } },
  jardines: { title: { es: "Jardines Naturales", en: "Natural Gardens" }, description: { es: "Áreas verdes para caminar, respirar con calma y disfrutar momentos al aire libre.", en: "Green spaces for quiet walks, fresh air, and time outdoors." } },
  parqueo: { title: { es: "Parqueo Privado", en: "Private Parking" }, description: { es: "Estacionamiento cómodo para huéspedes y visitantes durante su estadía.", en: "Convenient on-site parking for hotel guests and visitors." } },
  gimnasio: { title: { es: "Gimnasio", en: "Gym" }, description: { es: "Equipo esencial para mantener tu rutina activa durante el viaje.", en: "Essential equipment to help you stay active while traveling." } },
};

export const destinationTranslations: Record<string, ContentTranslation> = {
  "cataratas-pulhapanzak": { title: { es: "Cataratas de Pulhapanzak", en: "Cataratas de Pulhapanzak" }, description: { es: "Uno de los saltos de agua más emblemáticos de Honduras, ideal para una excursión de naturaleza y aventura.", en: "One of Honduras’s most iconic waterfalls, ideal for a day of nature and adventure." }, estimatedTime: { es: "1 h 40 min", en: "1 hr 40 min" } },
  tela: { title: { es: "Tela", en: "Tela" }, description: { es: "Playas caribeñas, gastronomía costera y acceso a reservas naturales desde la costa norte.", en: "Caribbean beaches, coastal cuisine, and easy access to nature reserves along Honduras’s northern coast." }, estimatedTime: { es: "1 h 10 min", en: "1 hr 10 min" } },
  "jardin-botanico-lancetilla": { title: { es: "Jardín Botánico Lancetilla", en: "Jardín Botánico Lancetilla" }, description: { es: "Reserva botánica histórica con senderos, biodiversidad tropical y paisajes ideales para visitar en familia.", en: "A historic botanical reserve with walking trails, tropical biodiversity, and scenery ideal for a family visit." }, estimatedTime: { es: "1 h 20 min", en: "1 hr 20 min" } },
  "san-pedro-sula": { title: { es: "San Pedro Sula", en: "San Pedro Sula" }, description: { es: "Centro comercial y cultural del norte de Honduras, con restaurantes, compras y conexiones regionales.", en: "Northern Honduras’s commercial and cultural hub, with dining, shopping, and regional connections." }, estimatedTime: { es: "35 min", en: "35 min" } },
};

function translated(field: Partial<Translation> | undefined, fallback: string, locale: Locale, staticValue?: Translation) {
  return field?.[locale] || staticValue?.[locale] || field?.es || staticValue?.es || fallback;
}

export function localizeRoom(room: PublicRoom, locale: Locale): PublicRoom {
  const fallback = roomTranslations[room.slug];
  return { ...room, title: translated(room.titleI18n, room.title, locale, fallback?.title), shortDescription: translated(room.shortDescriptionI18n, room.shortDescription, locale, fallback?.shortDescription), description: translated(room.descriptionI18n, room.description, locale, fallback?.description), amenities: room.amenitiesI18n?.[locale] ?? fallback?.amenities?.[locale] ?? room.amenities };
}

export function localizeService(service: PublicService, locale: Locale): PublicService {
  const fallback = serviceTranslations[service.slug];
  return { ...service, title: translated(service.titleI18n, service.title, locale, fallback?.title), description: translated(service.descriptionI18n, service.description, locale, fallback?.description) };
}

export function localizeDestination(destination: PublicDestination, locale: Locale): PublicDestination {
  const fallback = destinationTranslations[destination.slug];
  return { ...destination, title: translated(destination.titleI18n, destination.title, locale, fallback?.title), description: translated(destination.descriptionI18n, destination.description, locale, fallback?.description), estimatedTime: translated(destination.estimatedTimeI18n, destination.estimatedTime, locale, fallback?.estimatedTime) };
}

export function localizeGallery(image: PublicGalleryImage, locale: Locale): PublicGalleryImage {
  return { ...image, title: translated(image.titleI18n, image.title, locale), category: translated(image.categoryI18n, image.category, locale) };
}

export function localizeSettings(settings: PublicSettings, locale: Locale): PublicSettings {
  return { ...settings, slogan: translated(settings.sloganI18n, settings.slogan, locale, { es: "Naturaleza, confort y hospitalidad en perfecta armonía.", en: "Nature, comfort, and hospitality in perfect harmony." }) };
}
