"use client";

import { useState } from "react";
import { HomeScreen, MenuScreen, DishDetailSheet, InfoSheet, SearchOverlay } from "@/components/preview";
import type { Restaurant, Menu, Dish } from "@/types";

const DEMO_RESTAURANT: Restaurant = {
  id: "demo",
  name: "La Bouffe",
  coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop&q=80",
  phone: "+216 71 123 456",
  address: "Tunis, Tunisie",
  template: "classic",
  currency: "TND",
  wifi: { ssid: "LaBouffe_WiFi", password: "bienvenue2024" },
  socialMedia: { instagram: "labouffe.tn" },
};

const DEMO_MENUS: Menu[] = [
  {
    id: "m1",
    name: "Petit-dejeuner",
    icon: "coffee",
    dishCount: 4,
    availability: "08:00 - 11:00",
    visible: true,
    categories: [
      {
        id: "c1",
        name: "Viennoiseries",
        dishes: [
          { id: "d1", name: "Croissant Beurre", description: "Croissant pur beurre, croustillant et feuillete", price: 3.5, currency: "TND", image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop&q=80", allergens: ["gluten", "lait"], available: true },
          { id: "d2", name: "Pain au Chocolat", description: "Deux barres de chocolat noir dans une pate feuilletee", price: 4, currency: "TND", image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=300&fit=crop&q=80", allergens: ["gluten", "lait"], available: true },
        ],
      },
      {
        id: "c2",
        name: "Oeufs & Tartines",
        dishes: [
          { id: "d3", name: "Eggs Benedict", description: "Oeufs poches, sauce hollandaise, muffin anglais", price: 14, currency: "TND", image: "https://images.unsplash.com/photo-1608039829572-9b0189ea6268?w=400&h=300&fit=crop&q=80", allergens: ["gluten", "oeufs"], available: true },
          { id: "d4", name: "Avocado Toast", description: "Pain de campagne, avocat ecrase, oeuf poché, graines", price: 12, currency: "TND", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop&q=80", allergens: ["gluten"], available: true },
        ],
      },
    ],
  },
  {
    id: "m2",
    name: "Dejeuner",
    icon: "utensils-crossed",
    dishCount: 4,
    availability: "12:00 - 15:00",
    visible: true,
    categories: [
      {
        id: "c3",
        name: "Entrees",
        dishes: [
          { id: "d5", name: "Salade Nicoise", description: "Thon, olives, oeufs, tomates, haricots verts", price: 16, currency: "TND", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80", allergens: ["poisson", "oeufs"], available: true },
          { id: "d6", name: "Soupe du Jour", description: "Preparee chaque matin avec des legumes frais", price: 9, currency: "TND", allergens: [], available: true },
        ],
      },
      {
        id: "c4",
        name: "Plats",
        dishes: [
          { id: "d7", name: "Steak Frites", description: "Entrecote grillee, frites maison, sauce au poivre", price: 28, currency: "TND", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop&q=80", allergens: [], available: true },
          { id: "d8", name: "Poulet Roti", description: "Poulet fermier, pommes de terre grenaille, jus de cuisson", price: 22, currency: "TND", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop&q=80", allergens: [], available: true },
        ],
      },
    ],
  },
  {
    id: "m3",
    name: "Boissons",
    icon: "glass-water",
    dishCount: 4,
    availability: "Toute la journee",
    visible: true,
    categories: [
      {
        id: "c5",
        name: "Boissons chaudes",
        dishes: [
          { id: "d9", name: "Espresso", description: "Cafe italien intense et aromatique", price: 4, currency: "TND", allergens: [], available: true },
          { id: "d10", name: "Cappuccino", description: "Espresso, lait chaud et mousse onctueuse", price: 6, currency: "TND", allergens: ["lait"], available: true },
        ],
      },
      {
        id: "c6",
        name: "Jus frais",
        dishes: [
          { id: "d11", name: "Jus d'Orange", description: "Oranges fraiches pressees a la commande", price: 7, currency: "TND", allergens: [], available: true },
          { id: "d12", name: "Citronnade Maison", description: "Citron, menthe fraiche, eau petillante", price: 8, currency: "TND", allergens: [], available: true },
        ],
      },
    ],
  },
];

type Screen = { type: "home" } | { type: "menu"; menu: Menu };

export default function DemoMenuPage() {
  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="h-dvh bg-white flex flex-col relative max-w-lg mx-auto overflow-hidden">
      {screen.type === "home" && (
        <HomeScreen
          restaurant={DEMO_RESTAURANT}
          menus={DEMO_MENUS}
          reviews={[]}
          onMenuClick={(menu) => setScreen({ type: "menu", menu })}
          onInfoClick={() => setInfoOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
      )}

      {screen.type === "menu" && (
        <MenuScreen
          menu={screen.menu}
          onBack={() => setScreen({ type: "home" })}
          onDishClick={(dish) => setSelectedDish(dish)}
          onSearchClick={() => setSearchOpen(true)}
        />
      )}

      <DishDetailSheet
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      <InfoSheet
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        restaurant={DEMO_RESTAURANT}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        menus={DEMO_MENUS}
        onDishClick={(dish) => setSelectedDish(dish)}
      />
    </div>
  );
}
