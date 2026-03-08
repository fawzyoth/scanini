"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  XCircle,
  Loader2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { PLAN_PRICES } from "@/data/admin-mock";
import { PLANS } from "@/lib/plan-config";

type UserRow = {
  id: string;
  name: string;
  plan: string;
  status: string;
  has_restaurant: boolean;
  profile: { first_name: string; last_name: string; email: string; phone?: string } | null;
  payment_status: "paid" | "pending" | "overdue" | null;
};

const MONTH_NAMES = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

export default function AdminBillingPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [users, setUsers] = useState<UserRow[]>([]);
  const [payments, setPayments] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [month, year]);

  async function loadData() {
    setLoading(true);
    try {
      const [usersRes, paymentsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch(`/api/admin/payments?month=${month}&year=${year}`),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.filter((u: UserRow) => u.has_restaurant && u.plan !== "free"));
      }
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        const map: Record<string, any> = {};
        for (const p of data) {
          map[p.restaurant_id] = p;
        }
        setPayments(map);
      }
    } catch {}
    setLoading(false);
  }

  function prevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  async function togglePayment(user: UserRow) {
    const existing = payments[user.id];
    const newStatus = existing?.status === "paid" ? "pending" : "paid";
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: user.id,
        period_month: month,
        period_year: year,
        amount: PLAN_PRICES[user.plan]?.monthly ?? 0,
        plan: user.plan,
        status: newStatus,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPayments((prev) => ({ ...prev, [user.id]: updated }));
    }
  }

  async function markAllPaid() {
    const unpaid = users.filter((u) => payments[u.id]?.status !== "paid");
    await Promise.all(
      unpaid.map((u) =>
        fetch("/api/admin/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: u.id,
            period_month: month,
            period_year: year,
            amount: PLAN_PRICES[u.plan]?.monthly ?? 0,
            plan: u.plan,
            status: "paid",
          }),
        }).then((r) => r.json())
      )
    ).then((results) => {
      const newPayments = { ...payments };
      for (const p of results) {
        if (p.restaurant_id) newPayments[p.restaurant_id] = p;
      }
      setPayments(newPayments);
    });
  }

  const paidCount = users.filter((u) => payments[u.id]?.status === "paid").length;
  const unpaidCount = users.length - paidCount;
  const expectedRevenue = users.reduce((sum, u) => sum + (PLAN_PRICES[u.plan]?.monthly ?? 0), 0);
  const collectedRevenue = users
    .filter((u) => payments[u.id]?.status === "paid")
    .reduce((sum, u) => sum + (PLAN_PRICES[u.plan]?.monthly ?? 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suivi des paiements</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion mensuelle des abonnements</p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-gray-900 min-w-[160px] text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign size={20} />}
          label="Revenu attendu"
          value={`${expectedRevenue} DT`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Revenu collecte"
          value={`${collectedRevenue} DT`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Payes"
          value={paidCount.toString()}
          sub={`sur ${users.length} clients`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Impayes"
          value={unpaidCount.toString()}
          sub={unpaidCount > 0 ? `${Math.round((unpaidCount / Math.max(users.length, 1)) * 100)}% des clients` : "Tout est a jour"}
          color={unpaidCount > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}
        />
      </div>

      {/* Revenue progress */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Progression de la collecte</span>
          <span className="text-sm font-semibold text-gray-900">
            {collectedRevenue} / {expectedRevenue} DT ({expectedRevenue > 0 ? Math.round((collectedRevenue / expectedRevenue) * 100) : 0}%)
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${expectedRevenue > 0 ? Math.min((collectedRevenue / expectedRevenue) * 100, 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Clients payants — {MONTH_NAMES[month - 1]} {year}
          </h2>
          {unpaidCount > 0 && (
            <button
              onClick={markAllPaid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle2 size={14} />
              Tout marquer paye
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Restaurant</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Proprietaire</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Montant</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Date de paiement</th>
                <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const payment = payments[user.id];
                const isPaid = payment?.status === "paid";
                const price = PLAN_PRICES[user.plan]?.monthly ?? 0;
                return (
                  <tr key={user.id} className={`hover:bg-gray-50 ${!isPaid ? "bg-amber-50/30" : ""}`}>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-sm text-gray-900 hover:text-indigo-600 font-medium"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-700">
                        {user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <PlanBadge plan={user.plan} />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                      {price} DT
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentBadge status={payment?.status ?? null} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {payment?.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => togglePayment(user)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          isPaid
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                            : "text-white bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <XCircle size={12} /> Annuler
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} /> Paye
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                    Aucun client payant
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
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
  const displayName = PLANS[plan as keyof typeof PLANS]?.name ?? plan;
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${styles[plan] || styles.free}`}>
      {displayName}
    </span>
  );
}

function PaymentBadge({ status }: { status: string | null }) {
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
