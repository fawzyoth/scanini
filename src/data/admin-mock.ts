export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  restaurant: string;
  plan: "free" | "starter" | "pro" | "business";
  status: "pending" | "active" | "suspended" | "trial";
  createdAt: string;
  usage: {
    menus: number;
    dishes: number;
    scansThisMonth: number;
  };
  limits: {
    menus: number;
    dishes: number;
    scans: number;
  };
}

export const PLAN_LIMITS: Record<string, { menus: number; dishes: number; scans: number }> = {
  free: { menus: 1, dishes: 15, scans: 200 },
  starter: { menus: 1, dishes: 30, scans: 1500 },
  pro: { menus: 5, dishes: 60, scans: 6000 },
  business: { menus: 999, dishes: 999, scans: 20000 },
};

export const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  starter: { monthly: 9, yearly: 90 },
  pro: { monthly: 29, yearly: 240 },
  business: { monthly: 49, yearly: 490 },
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: "usr-1",
    firstName: "Fawzy",
    lastName: "Mehdaoui",
    email: "fawzy@labouffe.com",
    phone: "+216 50 123 456",
    restaurant: "La Bouffe",
    plan: "pro",
    status: "active",
    createdAt: "2025-11-15",
    usage: { menus: 3, dishes: 42, scansThisMonth: 2840 },
    limits: PLAN_LIMITS.pro,
  },
  {
    id: "usr-2",
    firstName: "Marta",
    lastName: "Balada",
    email: "marta@sacantina.com",
    phone: "+34 612 345 678",
    restaurant: "Sa Cantina",
    plan: "starter",
    status: "active",
    createdAt: "2025-12-02",
    usage: { menus: 1, dishes: 22, scansThisMonth: 680 },
    limits: PLAN_LIMITS.starter,
  },
  {
    id: "usr-3",
    firstName: "David",
    lastName: "Ferrer",
    email: "david@damonsgrill.com",
    phone: "+1 555 987 6543",
    restaurant: "Damon's Grill",
    plan: "business",
    status: "active",
    createdAt: "2025-10-08",
    usage: { menus: 8, dishes: 156, scansThisMonth: 12400 },
    limits: PLAN_LIMITS.business,
  },
  {
    id: "usr-4",
    firstName: "Joan",
    lastName: "Quiles",
    email: "joan@sorsimorsi.com",
    phone: "+34 698 765 432",
    restaurant: "Sorsi e Morsi",
    plan: "pro",
    status: "active",
    createdAt: "2026-01-10",
    usage: { menus: 2, dishes: 35, scansThisMonth: 1950 },
    limits: PLAN_LIMITS.pro,
  },
  {
    id: "usr-5",
    firstName: "Amina",
    lastName: "Ben Ali",
    email: "amina@cafemedina.tn",
    phone: "+216 22 456 789",
    restaurant: "Cafe Medina",
    plan: "free",
    status: "active",
    createdAt: "2026-02-20",
    usage: { menus: 1, dishes: 12, scansThisMonth: 87 },
    limits: PLAN_LIMITS.free,
  },
  {
    id: "usr-6",
    firstName: "Marco",
    lastName: "Rossi",
    email: "marco@trattoria.it",
    phone: "+39 333 444 5566",
    restaurant: "Trattoria da Marco",
    plan: "free",
    status: "trial",
    createdAt: "2026-03-01",
    usage: { menus: 1, dishes: 8, scansThisMonth: 23 },
    limits: PLAN_LIMITS.free,
  },
  {
    id: "usr-7",
    firstName: "Sophie",
    lastName: "Laurent",
    email: "sophie@bistrobleu.fr",
    phone: "+33 6 12 34 56 78",
    restaurant: "Bistro Bleu",
    plan: "starter",
    status: "suspended",
    createdAt: "2025-09-14",
    usage: { menus: 1, dishes: 18, scansThisMonth: 0 },
    limits: PLAN_LIMITS.starter,
  },
  {
    id: "usr-8",
    firstName: "Youssef",
    lastName: "Trabelsi",
    email: "youssef@darboucha.tn",
    phone: "+216 55 678 901",
    restaurant: "Dar Boucha",
    plan: "free",
    status: "pending",
    createdAt: "2026-03-05",
    usage: { menus: 0, dishes: 0, scansThisMonth: 0 },
    limits: PLAN_LIMITS.free,
  },
  {
    id: "usr-9",
    firstName: "Leila",
    lastName: "Hamdi",
    email: "leila@cafejasmins.tn",
    phone: "+216 98 112 233",
    restaurant: "Cafe des Jasmins",
    plan: "free",
    status: "pending",
    createdAt: "2026-03-06",
    usage: { menus: 0, dishes: 0, scansThisMonth: 0 },
    limits: PLAN_LIMITS.free,
  },
];
