"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Save, Loader2, CheckCircle2, DollarSign, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLAN_LIMITS, PLAN_PRICES } from "@/data/admin-mock";
import type { Restaurant, Profile } from "@/types/database";
import { PLANS as PLAN_INFO } from "@/lib/plan-config";

const PLANS = ["free", "starter", "pro", "business"] as const;

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [usage, setUsage] = useState({ menus: 0, dishes: 0, scansThisMonth: 0 });
  const [payments, setPayments] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"free" | "starter" | "pro" | "business">("free");
  const [status, setStatus] = useState<string>("active");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: rest } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();

      if (!rest) {
        setLoading(false);
        return;
      }

      const r = rest as Restaurant;
      setRestaurant(r);
      setName(r.name);
      setPlan(r.plan);
      setStatus(r.status);

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", r.owner_id)
        .single();

      if (prof) {
        const p = prof as Profile;
        setProfile(p);
        setFirstName(p.first_name);
        setLastName(p.last_name);
        setEmail(p.email);
      }

      const { data: usageRow } = await supabase
        .from("restaurant_usage")
        .select("*")
        .eq("restaurant_id", id)
        .single();

      if (usageRow) {
        setUsage({
          menus: (usageRow as any).menu_count ?? 0,
          dishes: (usageRow as any).dish_count ?? 0,
          scansThisMonth: (usageRow as any).scans_this_month ?? 0,
        });
      }

      // Load payment history
      try {
        const payRes = await fetch(`/api/admin/payments?restaurant_id=${id}`);
        if (payRes.ok) {
          const payData = await payRes.json();
          setPayments(payData);
        }
      } catch {}

      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">User not found</p>
        <Link href="/admin/users" className="text-indigo-600 text-sm mt-2 inline-block">
          Back to users
        </Link>
      </div>
    );
  }

  const limits = PLAN_LIMITS[plan];
  const price = PLAN_PRICES[plan];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();

    await (supabase.from("restaurants") as any)
      .update({ name, plan, status })
      .eq("id", id);

    if (profile) {
      await (supabase.from("profiles") as any)
        .update({ first_name: firstName, last_name: lastName, email })
        .eq("id", profile.id);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to users
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {profile ? `${profile.first_name} ${profile.last_name}` : "—"} &middot; {profile?.email ?? "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <PlanBadge plan={plan} />
        </div>
      </div>

      {/* Usage overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Usage this month</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <UsageMeter label="Menus" current={usage.menus} max={limits.menus} />
          <UsageMeter label="Dishes" current={usage.dishes} max={limits.dishes} />
          <UsageMeter label="Scans" current={usage.scansThisMonth} max={limits.scans} />
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Account details</h2>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Restaurant</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Joined</label>
              <input
                type="text"
                value={new Date(restaurant.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                disabled
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      </form>

      {/* Payment history */}
      {plan !== "free" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Historique des paiements</h2>
              <p className="text-xs text-gray-500 mt-0.5">Suivi mensuel des abonnements</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const now = new Date();
                const month = now.getMonth() + 1;
                const year = now.getFullYear();
                const existing = payments.find((p) => p.period_month === month && p.period_year === year);
                const newStatus = existing?.status === "paid" ? "pending" : "paid";
                const res = await fetch("/api/admin/payments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    restaurant_id: id,
                    period_month: month,
                    period_year: year,
                    amount: PLAN_PRICES[plan]?.monthly ?? 0,
                    plan,
                    status: newStatus,
                  }),
                });
                if (res.ok) {
                  const updated = await res.json();
                  setPayments((prev) => {
                    const idx = prev.findIndex((p) => p.period_month === month && p.period_year === year);
                    if (idx >= 0) {
                      const next = [...prev];
                      next[idx] = updated;
                      return next;
                    }
                    return [updated, ...prev];
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle2 size={14} />
              {payments.find((p) => p.period_month === new Date().getMonth() + 1 && p.period_year === new Date().getFullYear())?.status === "paid"
                ? "Marquer impaye"
                : "Marquer paye"}
            </button>
          </div>

          <div className="p-5">
            {payments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Aucun paiement enregistre</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Periode</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Plan</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Montant</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Statut</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-3">Date de paiement</th>
                      <th className="text-right text-xs font-medium text-gray-500 pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => {
                      const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
                      return (
                        <tr key={p.id}>
                          <td className="py-3 text-sm text-gray-900">
                            {monthNames[p.period_month - 1]} {p.period_year}
                          </td>
                          <td className="py-3">
                            <PlanBadge plan={p.plan} />
                          </td>
                          <td className="py-3 text-sm text-gray-700">
                            {p.amount > 0 ? `${p.amount} DT` : "—"}
                          </td>
                          <td className="py-3">
                            <PaymentStatusBadge status={p.status} />
                          </td>
                          <td className="py-3 text-sm text-gray-500">
                            {p.paid_at
                              ? new Date(p.paid_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={async () => {
                                const newSt = p.status === "paid" ? "pending" : "paid";
                                const res = await fetch("/api/admin/payments", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: p.id, status: newSt }),
                                });
                                if (res.ok) {
                                  const updated = await res.json();
                                  setPayments((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
                                }
                              }}
                              className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                                p.status === "paid"
                                  ? "text-amber-700 hover:bg-amber-50"
                                  : "text-green-700 hover:bg-green-50"
                              }`}
                            >
                              {p.status === "paid" ? "Annuler" : "Paye"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan management */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Plan management</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Current plan: <span className="text-gray-700 font-medium">{PLAN_INFO[plan]?.name ?? plan}</span> ({price.monthly === 0 ? "Free" : `${price.monthly} DT/mo`})
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {PLANS.map((p) => {
              const l = PLAN_LIMITS[p];
              const pr = PLAN_PRICES[p];
              const isCurrent = p === plan;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{PLAN_INFO[p]?.name ?? p}</span>
                    {isCurrent && <Check size={14} className="text-indigo-600" />}
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {pr.monthly === 0 ? "Free" : `${pr.monthly} DT`}
                    {pr.monthly > 0 && <span className="text-xs text-gray-500 font-normal">/mo</span>}
                  </p>
                  <div className="mt-2 space-y-1 text-[11px] text-gray-500">
                    <p>{l.menus === 999 ? "Unlimited" : l.menus} menu{l.menus !== 1 ? "s" : ""}</p>
                    <p>{l.dishes === 999 ? "Unlimited" : l.dishes} dishes</p>
                    <p>{l.scans.toLocaleString()} scans/mo</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageMeter({ label, current, max }: { label: string; current: number; max: number }) {
  const displayMax = max === 999 ? "Unlimited" : max.toLocaleString();
  const pct = max === 999 ? Math.min((current / 100) * 10, 100) : Math.min((current / max) * 100, 100);
  const over = max !== 999 && current > max;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${over ? "text-red-600" : "text-gray-900"}`}>
          {current.toLocaleString()} / {displayMax}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            over ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-indigo-500"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {over && <p className="text-xs text-red-500 mt-1">Over limit</p>}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    starter: "bg-blue-50 text-blue-700",
    pro: "bg-indigo-50 text-indigo-700",
    business: "bg-amber-50 text-amber-700",
  };
  const displayName = PLAN_INFO[plan as keyof typeof PLAN_INFO]?.name ?? plan;
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${styles[plan] || styles.free}`}>
      {displayName}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    active: "bg-green-50 text-green-700",
    trial: "bg-purple-50 text-purple-700",
    suspended: "bg-red-50 text-red-700",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${styles[status] || styles.active}`}>
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
        <CheckCircle2 size={12} /> Paye
      </span>
    );
  }
  if (status === "overdue") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700">
        <XCircle size={12} /> En retard
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
      <DollarSign size={12} /> Impaye
    </span>
  );
}
