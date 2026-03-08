"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  Loader2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { PLAN_PRICES } from "@/data/admin-mock";
import { PLANS } from "@/lib/plan-config";

const MONTH_NAMES = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

type Client = {
  id: string;
  name: string;
  plan: string;
  status: string;
  owner: { first_name: string; last_name: string; email: string; phone?: string } | null;
  payment: { status: string; amount: number; paid_at: string | null } | null;
};

export default function CommercialBillingPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [commissionRate, setCommissionRate] = useState(65);

  useEffect(() => {
    loadData();
  }, [month, year]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/commercial?month=${month}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients.filter((c: Client) => c.plan !== "free"));
        setCommissionRate(data.commissionRate);
      }
    } catch {}
    setLoading(false);
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const paidCount = clients.filter((c) => c.payment?.status === "paid").length;
  const unpaidCount = clients.length - paidCount;
  const expectedRevenue = clients.reduce((sum, c) => sum + (PLAN_PRICES[c.plan]?.monthly ?? 0), 0);
  const collectedRevenue = clients
    .filter((c) => c.payment?.status === "paid")
    .reduce((sum, c) => sum + (PLAN_PRICES[c.plan]?.monthly ?? 0), 0);
  const myCommission = Math.round(collectedRevenue * (commissionRate / 100) * 100) / 100;

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
          <p className="text-sm text-gray-500 mt-1">Vue mensuelle des abonnements de vos clients</p>
        </div>
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
          sub={`Ma part: ${myCommission} DT`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Payes"
          value={paidCount.toString()}
          sub={`sur ${clients.length} clients`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Impayes"
          value={unpaidCount.toString()}
          sub={unpaidCount > 0 ? `${Math.round((unpaidCount / Math.max(clients.length, 1)) * 100)}% des clients` : "Tout est a jour"}
          color={unpaidCount > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}
        />
      </div>

      {/* Progress bar */}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Clients payants — {MONTH_NAMES[month - 1]} {year}
          </h2>
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
                <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Ma part</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => {
                const price = PLAN_PRICES[client.plan]?.monthly ?? 0;
                const isPaid = client.payment?.status === "paid";
                const myPart = isPaid ? Math.round(price * (commissionRate / 100) * 100) / 100 : 0;
                return (
                  <tr key={client.id} className={`hover:bg-gray-50 ${!isPaid ? "bg-amber-50/30" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-900 font-medium">{client.name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {client.owner ? `${client.owner.first_name} ${client.owner.last_name}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <PlanBadge plan={client.plan} />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                      {price} DT
                    </td>
                    <td className="px-5 py-3.5">
                      <PaymentBadge status={client.payment?.status ?? null} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {client.payment?.paid_at
                        ? new Date(client.payment.paid_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-right text-emerald-600">
                      {myPart > 0 ? `${myPart} DT` : "—"}
                    </td>
                  </tr>
                );
              })}
              {clients.length === 0 && (
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
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>{icon}</div>
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
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
      <DollarSign size={12} /> Impaye
    </span>
  );
}
