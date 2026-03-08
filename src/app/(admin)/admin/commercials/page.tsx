"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  DollarSign,
  Users,
  TrendingUp,
  Phone,
} from "lucide-react";

const MONTH_NAMES = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

type Commercial = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  commission_rate: number;
  created_at: string;
  total_clients: number;
  active_clients: number;
  paid_clients: number;
  total_revenue: number;
  commission: number;
  platform_share: number;
};

export default function AdminCommercialsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [commercials, setCommercials] = useState<Commercial[]>([]);

  useEffect(() => {
    loadData();
  }, [month, year]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/commercials?month=${month}&year=${year}`);
      if (res.ok) {
        setCommercials(await res.json());
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

  const totalRevenue = commercials.reduce((sum, c) => sum + c.total_revenue, 0);
  const totalCommissions = commercials.reduce((sum, c) => sum + c.commission, 0);
  const totalPlatform = commercials.reduce((sum, c) => sum + c.platform_share, 0);
  const totalClients = commercials.reduce((sum, c) => sum + c.total_clients, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Commerciaux</h1>
          <p className="text-sm text-gray-500 mt-1">{commercials.length} commercial{commercials.length > 1 ? "aux" : ""} actif{commercials.length > 1 ? "s" : ""}</p>
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

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="Total clients"
          value={totalClients.toString()}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Revenu total"
          value={`${totalRevenue} DT`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Commissions versees"
          value={`${totalCommissions} DT`}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Part Scanini"
          value={`${totalPlatform} DT`}
          color="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Commercials table */}
      {commercials.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-sm text-gray-400">Aucun commercial enregistre</p>
          <p className="text-xs text-gray-400 mt-1">
            Creez un compte avec le role &quot;commercial&quot; pour commencer
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {commercials.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {c.first_name} {c.last_name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{c.email}</p>
                    {(c.phone || c.whatsapp) && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Phone size={12} className="text-green-500" />
                        <span className="text-xs text-gray-500">{c.whatsapp || c.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      Commission: {c.commission_rate}%
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {c.total_clients} client{c.total_clients > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Clients actifs</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{c.active_clients}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Payes</p>
                    <p className="text-lg font-bold text-green-600 mt-0.5">{c.paid_clients}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Revenu</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{c.total_revenue} DT</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider">Sa commission</p>
                    <p className="text-lg font-bold text-emerald-600 mt-0.5">{c.commission} DT</p>
                  </div>
                </div>

                {/* Revenue bar */}
                {c.total_revenue > 0 && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${c.commission_rate}%` }} />
                      <div className="h-full bg-indigo-500" style={{ width: `${100 - c.commission_rate}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-emerald-600">{c.commission} DT ({c.commission_rate}%)</span>
                      <span className="text-[10px] text-indigo-600">{c.platform_share} DT ({100 - c.commission_rate}%)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode; label: string; value: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
