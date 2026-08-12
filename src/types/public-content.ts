export type LocalizedText = { es: string; en: string };
export type LocalizedList = { es: string[]; en: string[] };

export interface PublicRoom {
  id: string;
  slug: string;
  title: string;
  titleI18n?: Partial<LocalizedText>;
  shortDescription: string;
  shortDescriptionI18n?: Partial<LocalizedText>;
  description: string;
  descriptionI18n?: Partial<LocalizedText>;
  price: number;
  currency: "HNL";
  capacityAdults: number;
  capacityChildren: number;
  beds: number;
  size: string;
  amenities: string[];
  amenitiesI18n?: Partial<LocalizedList>;
  images: string[];
  coverImage: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface PublicService {
  id: string;
  slug: string;
  title: string;
  titleI18n?: Partial<LocalizedText>;
  description: string;
  descriptionI18n?: Partial<LocalizedText>;
  image: string;
  icon: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface PublicDestination {
  id: string;
  slug: string;
  title: string;
  titleI18n?: Partial<LocalizedText>;
  description: string;
  descriptionI18n?: Partial<LocalizedText>;
  image: string;
  latitude: number;
  longitude: number;
  estimatedTime: string;
  estimatedTimeI18n?: Partial<LocalizedText>;
  estimatedDistance: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface PublicGalleryImage {
  id: string;
  category: string;
  categoryI18n?: Partial<LocalizedText>;
  title: string;
  titleI18n?: Partial<LocalizedText>;
  image: string;
  active: boolean;
  order: number;
}

export interface PublicSettings {
  id: string;
  hotelName: string;
  slogan: string;
  sloganI18n?: Partial<LocalizedText>;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  facebook: string;
  instagram: string;
  checkInTime: string;
  checkOutTime: string;
}
