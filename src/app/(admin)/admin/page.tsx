"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, DollarSign, QrCode, TrendingUp, ArrowRight, Clock, Loader2, AlertTriangle } from "lucide-react";
import { PLAN_PRICES } from "@/data/admin-mock";
import { PLANS } from "@/lib/plan-config";

export default function AdminDashboardPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        // Map to include usage info
        setRestaurants(
          data.map((r: any) => ({
            ...r,
            usage: { scans_this_month: r.scans_this_month ?? 0 },
          }))
        );
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const unpaidCount = restaurants.filter(
    (r) => r.plan !== "free" && r.payment_status !== "paid"
  ).length;

  const totalUsers = restaurants.length;
  const activeUsers = restaurants.filter((r) => r.status === "active").length;
  const pendingUsers = restaurants.filter((r) => r.status === "pending").length;
  const totalScans = restaurants.reduce((sum, r) => sum + (r.usage?.scans_this_month ?? 0), 0);

  const monthlyRevenue = restaurants.reduce((sum, r) => {
    return sum + (PLAN_PRICES[r.plan]?.monthly ?? 0);
  }, 0);

  const planDistribution = {
    free: restaurants.filter((r) => r.plan === "free").length,
    starter: restaurants.filter((r) => r.plan === "starter").length,
    pro: restaurants.filter((r) => r.plan === "pro").length,
    business: restaurants.filter((r) => r.plan === "business").length,
  };

  const recentUsers = restaurants.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      {/* Pending alert */}
      {pendingUsers > 0 && (
        <Link
          href="/admin/users?status=pending"
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              {pendingUsers} account{pendingUsers > 1 ? "s" : ""} pending approval
            </p>
            <p className="text-xs text-amber-700">Review and approve new sign-ups</p>
          </div>
          <ArrowRight size={16} className="text-amber-600" />
        </Link>
      )}

      {/* Unpaid alert */}
      {unpaidCount > 0 && (
        <Link
          href="/admin/billing"
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
        >
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">
              {unpaidCount} abonnement{unpaidCount > 1 ? "s" : ""} impaye{unpaidCount > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-red-700">Verifier les paiements du mois en cours</p>
          </div>
          <ArrowRight size={16} className="text-red-600" />
        </Link>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="Total users"
          value={totalUsers.toString()}
          sub={`${activeUsers} active`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Monthly revenue"
          value={`${monthlyRevenue} DT`}
          sub="Recurring"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={<QrCode size={20} />}
          label="Total scans"
          value={totalScans.toLocaleString()}
          sub="This month"
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Conversion rate"
          value={totalUsers > 0 ? `${Math.round(((planDistribution.starter + planDistribution.pro + planDistribution.business) / totalUsers) * 100)}%` : "0%"}
          sub="Free to paid"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Plan distribution</h2>
          <div className="space-y-3">
            {(["free", "starter", "pro", "business"] as const).map((plan) => {
              const count = planDistribution[plan];
              const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              return (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{PLANS[plan]?.name ?? plan}</span>
                    <span className="text-sm text-gray-500">{count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        plan === "free"
                          ? "bg-gray-400"
                          : plan === "starter"
                            ? "bg-blue-500"
                            : plan === "pro"
                              ? "bg-indigo-500"
                              : "bg-amber-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent users</h2>
            <Link href="/admin/users" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No users yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 pb-3">Restaurant</th>
                    <th className="text-left text-xs font-medium text-gray-500 pb-3">Owner</th>
                    <th className="text-left text-xs font-medium text-gray-500 pb-3">Plan</th>
                    <th className="text-left text-xs font-medium text-gray-500 pb-3">Status</th>
                    <th className="text-right text-xs font-medium text-gray-500 pb-3">Scans</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentUsers.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3">
                        <Link href={`/admin/users/${r.id}`} className="text-sm text-gray-900 hover:text-indigo-600 font-medium">
                          {r.name}
                        </Link>
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {r.profile ? `${r.profile.first_name} ${r.profile.last_name}` : "—"}
                      </td>
                      <td className="py-3">
                        <PlanBadge plan={r.plan} />
                      </td>
                      <td className="py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-3 text-sm text-gray-500 text-right">
                        {(r.usage?.scans_this_month ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
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
