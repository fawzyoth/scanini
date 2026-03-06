"use client";

import {
  UtensilsCrossed, Coffee, Wine, Pizza, Cake, IceCream, Soup, Salad,
  Beef, Fish, Egg, Sandwich, Cookie, Cherry, Apple, Grape, Carrot, Wheat,
  Beer, CupSoda, Martini, GlassWater,
  type LucideProps,
} from "lucide-react";
import { type ComponentType } from "react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  "utensils-crossed": UtensilsCrossed,
  coffee: Coffee,
  wine: Wine,
  pizza: Pizza,
  cake: Cake,
  "ice-cream": IceCream,
  soup: Soup,
  salad: Salad,
  beef: Beef,
  fish: Fish,
  egg: Egg,
  sandwich: Sandwich,
  cookie: Cookie,
  cherry: Cherry,
  apple: Apple,
  grape: Grape,
  carrot: Carrot,
  wheat: Wheat,
  beer: Beer,
  "cup-soda": CupSoda,
  martini: Martini,
  "glass-water": GlassWater,
};

interface MenuIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function MenuIcon({ name, size = 18, className }: MenuIconProps) {
  const Icon = ICON_MAP[name] ?? UtensilsCrossed;
  return <Icon size={size} className={className} />;
}
