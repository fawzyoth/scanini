"use client";

/**
 * EU-14 allergen icon mapping.
 * Keys are lowercase for case-insensitive lookup.
 * Sub-allergens (e.g. "wheat", "almonds") map to their parent icon.
 */
const ALLERGEN_MAP: Record<string, { icon: string; color: string }> = {
  // Primary EU-14
  celery:                           { icon: "\u{1F96C}", color: "#4CAF50" }, // leafy green
  crustaceans:                      { icon: "\u{1F990}", color: "#E65100" }, // shrimp
  eggs:                             { icon: "\u{1F95A}", color: "#FFC107" }, // egg
  fish:                             { icon: "\u{1F41F}", color: "#1976D2" }, // fish
  gluten:                           { icon: "\u{1F33E}", color: "#F9A825" }, // wheat
  lupin:                            { icon: "\u{1F33C}", color: "#9C27B0" }, // flower
  milk:                             { icon: "\u{1F95B}", color: "#ECEFF1" }, // milk
  dairy:                            { icon: "\u{1F95B}", color: "#ECEFF1" }, // alias
  molluscs:                         { icon: "\u{1F41A}", color: "#5D4037" }, // shell
  mustard:                          { icon: "\u{1F7E1}", color: "#FFEB3B" }, // yellow circle
  nuts:                             { icon: "\u{1F330}", color: "#795548" }, // chestnut
  peanuts:                          { icon: "\u{1F95C}", color: "#A1887F" }, // peanuts
  "sesame seeds":                   { icon: "\u{1FAD8}", color: "#BCAAA4" }, // beans
  soybeans:                         { icon: "\u{1FAD8}", color: "#689F38" }, // beans
  "sulphur dioxide and sulphites":  { icon: "\u{1F377}", color: "#880E4F" }, // wine
  // Gluten sub-types
  barley:  { icon: "\u{1F33E}", color: "#F9A825" },
  oats:    { icon: "\u{1F33E}", color: "#F9A825" },
  rye:     { icon: "\u{1F33E}", color: "#F9A825" },
  wheat:   { icon: "\u{1F33E}", color: "#F9A825" },
  // Nut sub-types
  almonds:          { icon: "\u{1F330}", color: "#795548" },
  "brazil nuts":    { icon: "\u{1F330}", color: "#795548" },
  cashews:          { icon: "\u{1F330}", color: "#795548" },
  hazelnuts:        { icon: "\u{1F330}", color: "#795548" },
  "macadamia nuts": { icon: "\u{1F330}", color: "#795548" },
  "pecan nuts":     { icon: "\u{1F330}", color: "#795548" },
  "pistachio nuts": { icon: "\u{1F330}", color: "#795548" },
  walnuts:          { icon: "\u{1F330}", color: "#795548" },
  // Tags (from TAGS constant)
  spicy:       { icon: "\u{1F336}\uFE0F", color: "#D32F2F" },
  vegetarian:  { icon: "\u{1F96C}", color: "#388E3C" },
  vegan:       { icon: "\u{1F331}", color: "#2E7D32" },
};

function getAllergenInfo(name: string): { icon: string; color: string } | null {
  return ALLERGEN_MAP[name.toLowerCase()] ?? null;
}

/**
 * Small inline allergen icons shown next to a dish name in the menu list.
 * Shows up to `max` icons.
 */
export function AllergenIcons({
  allergens,
  max = 3,
}: {
  allergens: string[];
  max?: number;
}) {
  if (allergens.length === 0) return null;

  const shown = allergens.slice(0, max);
  const extra = allergens.length - max;

  return (
    <span className="inline-flex items-center gap-0.5 mt-1">
      {shown.map((a) => {
        const info = getAllergenInfo(a);
        if (!info) return null;
        return (
          <span key={a} className="text-xs leading-none" title={a}>
            {info.icon}
          </span>
        );
      })}
      {extra > 0 && (
        <span className="text-[10px] text-gray-400 ml-0.5">+{extra}</span>
      )}
    </span>
  );
}

/**
 * Allergen badges for the dish detail sheet — larger with labels.
 */
export function AllergenBadges({ allergens }: { allergens: string[] }) {
  if (allergens.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {allergens.map((a) => {
        const info = getAllergenInfo(a);
        return (
          <span
            key={a}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
          >
            {info && <span className="text-sm leading-none">{info.icon}</span>}
            {a}
          </span>
        );
      })}
    </div>
  );
}
