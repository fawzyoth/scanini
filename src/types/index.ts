export type MenuTemplate = "classic" | "card" | "profile" | "dark";

export interface Restaurant {
  id: string;
  name: string;
  coverImage: string;
  phone: string;
  address: string;
  template: MenuTemplate;
  currency: string;
  logoImage?: string;
  animationsEnabled?: boolean;
  wifi?: {
    ssid: string;
    password: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
}

export interface Menu {
  id: string;
  name: string;
  icon: string;
  dishCount: number;
  availability: string;
  visible: boolean;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  dishes: Dish[];
}

export interface DishVariant {
  label: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  allergens: string[];
  available: boolean;
  variants?: DishVariant[];
}

export interface Review {
  id: string;
  rating: number;
  meal: number;
  service: number;
  atmosphere: number;
  cleanliness: number;
  comment?: string;
  date: string;
}

export interface VisitData {
  date: string;
  mornings: number;
  afternoons: number;
}

export interface QRSettings {
  frameType: "bottom" | "top" | "none";
  backgroundColor: string;
  text: string;
  textColor: string;
  font: string;
  fontSize: number;
  dotStyle: "square" | "rounded" | "dots";
  dotColor: string;
  cornerStyle: "square" | "rounded";
  cornerColor: string;
  logo?: string;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export type TimePeriod = "last_week" | "last_month" | "last_3_months" | "last_year";
