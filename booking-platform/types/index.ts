export interface Provider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  bio: string;
  verified: boolean;
  featured?: boolean;
  availability: TimeSlot[];
  reviews: Review[];
  phone: string;
  yearsExperience: number;
  specialties: string[];
}

export interface TimeSlot {
  date: string;
  times: {
    time: string;
    available: boolean;
    isFastest?: boolean;
  }[];
}

export type TimeString = string | null;

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  description: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon: string;
  description: string;
}
