import type { MenuTemplate } from "@/types";

export type PlanId = "free" | "starter" | "pro" | "business";

export interface PlanFeatures {
  maxMenus: number;
  maxDishes: number;
  maxScansPerMonth: number;
  templates: MenuTemplate[];
  languages: string[];
  socialMedia: ("facebook" | "instagram" | "tiktok")[];
  reviewsEnabled: boolean;
  searchEnabled: boolean;
  customQr: boolean;
  whiteLabel: boolean;
  customTheme: boolean;
  advancedStats: boolean;
  supportHours: string | null;
  scaniniLogo: boolean;
}

export interface PlanInfo {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeatures;
  popular?: boolean;
}

export const PLANS: Record<PlanId, PlanInfo> = {
  free: {
    id: "free",
    name: "Gratuit",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Pour bien demarrer",
    features: {
      maxMenus: 1,
      maxDishes: 15,
      maxScansPerMonth: 1000,
      templates: ["classic"],
      languages: ["fr"],
      socialMedia: [],
      reviewsEnabled: false,
      searchEnabled: false,
      customQr: false,
      whiteLabel: false,
      customTheme: false,
      advancedStats: false,
      supportHours: null,
      scaniniLogo: true,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: "Pour les petits restaurants",
    features: {
      maxMenus: 3,
      maxDishes: 50,
      maxScansPerMonth: 3000,
      templates: ["classic", "card"],
      languages: ["fr"],
      socialMedia: ["facebook"],
      reviewsEnabled: false,
      searchEnabled: true,
      customQr: false,
      whiteLabel: false,
      customTheme: false,
      advancedStats: false,
      supportHours: null,
      scaniniLogo: true,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPrice: 39,
    yearlyPrice: 490,
    description: "Pour les restaurants en croissance",
    popular: true,
    features: {
      maxMenus: 10,
      maxDishes: 100,
      maxScansPerMonth: 5000,
      templates: ["classic", "card", "profile"],
      languages: ["fr", "ar"],
      socialMedia: ["facebook", "instagram", "tiktok"],
      reviewsEnabled: true,
      searchEnabled: true,
      customQr: true,
      whiteLabel: false,
      customTheme: false,
      advancedStats: false,
      supportHours: "48h",
      scaniniLogo: true,
    },
  },
  business: {
    id: "business",
    name: "Pro Max",
    monthlyPrice: 69,
    yearlyPrice: 790,
    description: "Pour les grandes enseignes",
    features: {
      maxMenus: 999,
      maxDishes: 999,
      maxScansPerMonth: 999999,
      templates: ["classic", "card", "profile", "dark"],
      languages: ["fr", "ar", "en"],
      socialMedia: ["facebook", "instagram", "tiktok"],
      reviewsEnabled: true,
      searchEnabled: true,
      customQr: true,
      whiteLabel: true,
      customTheme: true,
      advancedStats: true,
      supportHours: "24h",
      scaniniLogo: false,
    },
  },
};

export const PLAN_ORDER: PlanId[] = ["free", "starter", "pro", "business"];

export function getPlan(planId: string): PlanInfo {
  return PLANS[planId as PlanId] ?? PLANS.free;
}

export function canUseTemplate(planId: string, template: MenuTemplate): boolean {
  return getPlan(planId).features.templates.includes(template);
}

export function canUseSocial(planId: string, platform: "facebook" | "instagram" | "tiktok"): boolean {
  return getPlan(planId).features.socialMedia.includes(platform);
}

export function canUseLanguage(planId: string, langCode: string): boolean {
  return getPlan(planId).features.languages.includes(langCode);
}

export function getMinPlanFor(feature: keyof PlanFeatures, value?: string): PlanId {
  for (const id of PLAN_ORDER) {
    const plan = PLANS[id];
    const feat = plan.features[feature];
    if (typeof feat === "boolean" && feat) return id;
    if (Array.isArray(feat) && value && (feat as string[]).includes(value)) return id;
  }
  return "business";
}

export function getMinPlanForTemplate(template: MenuTemplate): PlanId {
  for (const id of PLAN_ORDER) {
    if (PLANS[id].features.templates.includes(template)) return id;
  }
  return "business";
}

export function getMinPlanForLanguage(langCode: string): PlanId {
  for (const id of PLAN_ORDER) {
    if (PLANS[id].features.languages.includes(langCode)) return id;
  }
  return "business";
}

export function getMinPlanForSocial(platform: "facebook" | "instagram" | "tiktok"): PlanId {
  for (const id of PLAN_ORDER) {
    if (PLANS[id].features.socialMedia.includes(platform)) return id;
  }
  return "business";
}

// Convert a DB plan_configs row to a PlanInfo object
export function dbRowToPlanInfo(row: any): PlanInfo {
  return {
    id: row.id as PlanId,
    name: row.display_name,
    monthlyPrice: Number(row.monthly_price),
    yearlyPrice: Number(row.yearly_price),
    description: row.description,
    popular: row.is_popular ?? false,
    features: {
      maxMenus: row.max_menus,
      maxDishes: row.max_dishes,
      maxScansPerMonth: row.max_scans_per_month,
      templates: (row.templates ?? ["classic"]) as MenuTemplate[],
      languages: row.languages ?? ["fr"],
      socialMedia: (row.social_media ?? []) as ("facebook" | "instagram" | "tiktok")[],
      reviewsEnabled: row.reviews_enabled ?? false,
      searchEnabled: row.search_enabled ?? false,
      customQr: row.custom_qr ?? false,
      whiteLabel: row.white_label ?? false,
      customTheme: row.custom_theme ?? false,
      advancedStats: row.advanced_stats ?? false,
      supportHours: row.support_hours ?? null,
      scaniniLogo: row.scanini_logo ?? true,
    },
  };
}

// Comparison table rows for landing/billing pages
export const COMPARISON_FEATURES = [
  { label: "Menus", key: "maxMenus" as const, format: (v: number) => v >= 999 ? "Illimite" : `${v}` },
  { label: "Plats", key: "maxDishes" as const, format: (v: number) => v >= 999 ? "Illimite" : `Jusqu'a ${v}` },
  { label: "Scans / mois", key: "maxScansPerMonth" as const, format: (v: number) => v >= 999999 ? "Illimite" : v.toLocaleString("fr-FR") },
  { label: "Templates", key: "templates" as const, format: (v: MenuTemplate[]) => v.length >= 4 ? "Tous" : v.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ") },
  { label: "Langues", key: "languages" as const, format: (v: string[]) => v.map(l => l.toUpperCase()).join(", ") },
  { label: "Reseaux sociaux", key: "socialMedia" as const, format: (v: string[]) => v.length === 0 ? "—" : v.length >= 3 ? "Tous" : v.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ") },
  { label: "Avis clients", key: "reviewsEnabled" as const, format: (v: boolean) => v ? "Oui" : "—" },
  { label: "Recherche", key: "searchEnabled" as const, format: (v: boolean) => v ? "Oui" : "—" },
  { label: "QR personnalise", key: "customQr" as const, format: (v: boolean) => v ? "Oui" : "—" },
  { label: "Marque blanche", key: "whiteLabel" as const, format: (v: boolean) => v ? "Oui" : "—" },
  { label: "Theme personnalise", key: "customTheme" as const, format: (v: boolean) => v ? "Oui" : "—" },
  { label: "Stats avancees", key: "advancedStats" as const, format: (v: boolean) => v ? "Oui" : "—" },
  { label: "Support", key: "supportHours" as const, format: (v: string | null) => v ? `Reponse ${v}` : "—" },
];
