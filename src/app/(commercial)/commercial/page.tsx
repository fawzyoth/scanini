"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  ArrowRight,
  QrCode,
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
  created_at: string;
  owner: { first_name: string; last_name: string; email: string; phone?: string } | null;
  payment: { status: string; amount: number; paid_at: string | null } | null;
  usage: { scans_this_month: number; menu_count: number; dish_count: number } | null;
};

export default function CommercialDashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [commissionRate, setCommissionRate] = useState(65);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    loadData();
  }, [month, year]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/commercial?month=${month}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
        setCommissionRate(data.commissionRate);
        setProfileName(`${data.profile.first_name} ${data.profile.last_name}`);
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

  const paidClients = clients.filter((c) => c.payment?.status === "paid");
  const unpaidClients = clients.filter((c) => c.plan !== "free" && c.payment?.status !== "paid");
  const totalRevenue = paidClients.reduce((sum, c) => sum + (PLAN_PRICES[c.plan]?.monthly ?? 0), 0);
  const myCommission = Math.round(totalRevenue * (commissionRate / 100) * 100) / 100;
  const platformShare = totalRevenue - myCommission;
  const totalScans = clients.reduce((sum, c) => sum + (c.usage?.scans_this_month ?? 0), 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {profileName}</h1>
          <p className="text-sm text-gray-500 mt-1">Votre tableau de bord commercial</p>
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

      {/* Unpaid alert */}
      {unpaidClients.length > 0 && (
        <Link
          href="/commercial/billing"
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              {unpaidClients.length} client{unpaidClients.length > 1 ? "s" : ""} impaye{unpaidClients.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-amber-700">
              {unpaidClients.map((c) => c.name).join(", ")}
            </p>
          </div>
          <ArrowRight size={16} className="text-amber-600" />
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="Mes clients"
          value={clients.length.toString()}
          sub={`${paidClients.length} ont paye`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Revenu total"
          value={`${totalRevenue} DT`}
          sub={`${MONTH_NAMES[month - 1]} ${year}`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Ma commission"
          value={`${myCommission} DT`}
          sub={`${commissionRate}% du revenu`}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={<QrCode size={20} />}
          label="Scans total"
          value={totalScans.toLocaleString()}
          sub="Ce mois"
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Revenue breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Repartition des revenus</span>
          <span className="text-sm font-semibold text-gray-900">{totalRevenue} DT total</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
          {totalRevenue > 0 && (
            <>
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${commissionRate}%` }}
              />
              <div
                className="h-full bg-gray-400 transition-all"
                style={{ width: `${100 - commissionRate}%` }}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-gray-500">Ma commission ({commissionRate}%) — {myCommission} DT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-xs text-gray-500">Scanini ({100 - commissionRate}%) — {platformShare} DT</span>
          </div>
        </div>
      </div>

      {/* Recent clients */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Mes clients — {MONTH_NAMES[month - 1]} {year}</h2>
          <Link href="/commercial/clients" className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Restaurant</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Proprietaire</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Paiement</th>
                <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Ma part</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.slice(0, 10).map((client) => {
                const price = PLAN_PRICES[client.plan]?.monthly ?? 0;
                const isPaid = client.payment?.status === "paid";
                const myPart = isPaid ? Math.round(price * (commissionRate / 100) * 100) / 100 : 0;
                return (
                  <tr key={client.id} className={`hover:bg-gray-50 ${!isPaid && price > 0 ? "bg-amber-50/30" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-900 font-medium">{client.name}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {client.owner ? `${client.owner.first_name} ${client.owner.last_name}` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <PlanBadge plan={client.plan} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {price === 0 ? (
                        <span className="text-[11px] text-gray-400">—</span>
                      ) : isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                          Paye
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                          Impaye
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-right text-emerald-600">
                      {myPart > 0 ? `${myPart} DT` : "—"}
                    </td>
                  </tr>
                );
              })}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                    Aucun client assigne
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
  icon: React.ReactNode; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
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
