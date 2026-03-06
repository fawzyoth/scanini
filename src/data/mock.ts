import { Menu, Restaurant, Review, VisitData, QRSettings } from "@/types";

export const mockRestaurant: Restaurant = {
  id: "rest-1",
  name: "La bouffe",
  coverImage: "/images/cover.jpg",
  phone: "+33 1 23 45 67 89",
  address: "12 Rue de la Paix, 75002 Paris",
  wifi: {
    ssid: "LaBouffe-Guest",
    password: "bienvenue2024",
  },
  socialMedia: {
    instagram: "labouffe_paris",
    facebook: "labouffeparis",
  },
};

export const mockMenus: Menu[] = [
  {
    id: "menu-1",
    name: "Petit dejeuner",
    icon: "utensils-crossed",
    dishCount: 8,
    availability: "Every day",
    visible: true,
    categories: [
      {
        id: "cat-1",
        name: "Viennoiseries",
        dishes: [
          {
            id: "dish-1",
            name: "Croissant",
            description: "Beurre AOP, feuilletage maison",
            price: 2.5,
            currency: "EUR",
            image: "/images/croissant.jpg",
            allergens: ["gluten", "dairy"],
            available: true,
          },
          {
            id: "dish-2",
            name: "Pain au chocolat",
            description: "Chocolat noir 70%",
            price: 2.8,
            currency: "EUR",
            allergens: ["gluten", "dairy"],
            available: true,
          },
        ],
      },
      {
        id: "cat-2",
        name: "Boissons chaudes",
        dishes: [
          {
            id: "dish-3",
            name: "Espresso",
            description: "Cafe arabica torrefie",
            price: 2.0,
            currency: "EUR",
            allergens: [],
            available: true,
          },
          {
            id: "dish-4",
            name: "Cappuccino",
            description: "Espresso, lait mousse",
            price: 4.0,
            currency: "EUR",
            allergens: ["dairy"],
            available: true,
          },
        ],
      },
      {
        id: "cat-3",
        name: "Oeufs",
        dishes: [
          {
            id: "dish-5",
            name: "Oeufs brouilles",
            description: "Servis avec toast et beurre",
            price: 8.5,
            currency: "EUR",
            allergens: ["gluten", "eggs", "dairy"],
            available: true,
          },
          {
            id: "dish-6",
            name: "Omelette fromage",
            description: "Gruyere, herbes fraiches",
            price: 9.0,
            currency: "EUR",
            allergens: ["eggs", "dairy"],
            available: true,
          },
        ],
      },
    ],
  },
  {
    id: "menu-2",
    name: "Dejeuner",
    icon: "utensils-crossed",
    dishCount: 15,
    availability: "Mon-Sat",
    visible: true,
    categories: [
      {
        id: "cat-4",
        name: "Entrees",
        dishes: [
          {
            id: "dish-7",
            name: "Soupe du jour",
            description: "Preparation maison, servie avec pain",
            price: 7.0,
            currency: "EUR",
            allergens: ["gluten"],
            available: true,
          },
          {
            id: "dish-8",
            name: "Salade Nicoise",
            description: "Thon, olives, tomates, haricots verts",
            price: 12.0,
            currency: "EUR",
            allergens: ["fish"],
            available: true,
          },
        ],
      },
      {
        id: "cat-5",
        name: "Plats",
        dishes: [
          {
            id: "dish-9",
            name: "Steak frites",
            description: "Bavette d'aloyau, frites maison, sauce bearnaise",
            price: 18.0,
            currency: "EUR",
            allergens: ["eggs", "dairy"],
            available: true,
          },
          {
            id: "dish-10",
            name: "Risotto champignons",
            description: "Cepes, parmesan, truffe noire",
            price: 16.0,
            currency: "EUR",
            allergens: ["dairy"],
            available: true,
          },
        ],
      },
    ],
  },
  {
    id: "menu-3",
    name: "Diner",
    icon: "utensils-crossed",
    dishCount: 12,
    availability: "Tue-Sun",
    visible: false,
    categories: [],
  },
];

export const mockVisits: VisitData[] = [
  { date: "Feb 27", mornings: 0, afternoons: 0 },
  { date: "Feb 28", mornings: 0, afternoons: 0 },
  { date: "Mar 1", mornings: 0, afternoons: 0 },
  { date: "Mar 2", mornings: 0, afternoons: 0 },
  { date: "Mar 3", mornings: 2, afternoons: 1 },
  { date: "Mar 4", mornings: 5, afternoons: 8 },
  { date: "Mar 5", mornings: 3, afternoons: 12 },
];

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    rating: 4,
    meal: 5,
    service: 4,
    atmosphere: 4,
    cleanliness: 3,
    comment: "Excellent food, nice ambiance!",
    date: "2024-03-04",
  },
];

export const defaultQRSettings: QRSettings = {
  frameType: "bottom",
  backgroundColor: "#000000",
  text: "MENU",
  textColor: "#FFFFFF",
  font: "Roboto",
  fontSize: 24,
  dotStyle: "square",
  dotColor: "#000000",
  cornerStyle: "square",
  cornerColor: "#000000",
};
