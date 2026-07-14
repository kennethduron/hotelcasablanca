export interface PublicRoom {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  currency: "HNL";
  capacityAdults: number;
  capacityChildren: number;
  beds: number;
  size: string;
  amenities: string[];
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
  description: string;
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
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  estimatedTime: string;
  estimatedDistance: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface PublicGalleryImage {
  id: string;
  category: string;
  title: string;
  image: string;
  active: boolean;
  order: number;
}

export interface PublicSettings {
  id: string;
  hotelName: string;
  slogan: string;
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
