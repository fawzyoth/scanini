export const TAGS = [
  "Dairy free",
  "Spicy",
  "Vegan",
  "Vegetarian",
  "Without gluten",
] as const;

export interface AllergenGroup {
  name: string;
  children?: string[];
}

export const ALLERGENS: AllergenGroup[] = [
  { name: "Celery" },
  { name: "Crustaceans" },
  { name: "Eggs" },
  { name: "Fish" },
  { name: "Lupin" },
  { name: "Milk" },
  { name: "Molluscs" },
  { name: "Mustard" },
  { name: "Peanuts" },
  { name: "Sesame seeds" },
  { name: "Soybeans" },
  { name: "Sulphur dioxide and sulphites" },
  {
    name: "Nuts",
    children: [
      "Almonds",
      "Brazil nuts",
      "Cashews",
      "Hazelnuts",
      "Macadamia nuts",
      "Pecan nuts",
      "Pistachio nuts",
      "Walnuts",
    ],
  },
  {
    name: "Gluten",
    children: ["Barley", "Oats", "Rye", "Wheat"],
  },
];
