"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Phone, ArrowUpDown } from "lucide-react";
import { PLAN_PRICES } from "@/data/admin-mock";
import { PLANS } from "@/lib/plan-config";

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

export default function CommercialClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "created" | "scans">("created");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/commercial");
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  function toggleSort(field: "name" | "created" | "scans") {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      if (!q) return true;
      const ownerName = c.owner ? `${c.owner.first_name} ${c.owner.last_name}` : "";
      return c.name.toLowerCase().includes(q) || ownerName.toLowerCase().includes(q) || (c.owner?.email ?? "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
      if (sortBy === "scans") return ((a.usage?.scans_this_month ?? 0) - (b.usage?.scans_this_month ?? 0)) * dir;
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes clients</h1>
        <p className="text-sm text-gray-500 mt-1">{clients.length} restaurant{clients.length > 1 ? "s" : ""} gere{clients.length > 1 ? "s" : ""}</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, proprietaire ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-gray-700">
                    Restaurant <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Proprietaire</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Telephone</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Menus</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Plats</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                  <button onClick={() => toggleSort("scans")} className="flex items-center gap-1 hover:text-gray-700">
                    Scans <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                  <button onClick={() => toggleSort("created")} className="flex items-center gap-1 hover:text-gray-700">
                    Inscrit <ArrowUpDown size={12} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-gray-900 font-medium">{client.name}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm text-gray-700">
                        {client.owner ? `${client.owner.first_name} ${client.owner.last_name}` : "—"}
                      </p>
                      <p className="text-xs text-gray-400">{client.owner?.email ?? ""}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {client.owner?.phone ? (
                      <a
                        href={`https://wa.me/${client.owner.phone.replace(/\s+/g, "").replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                      >
                        <Phone size={12} />
                        {client.owner.phone}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <PlanBadge plan={client.plan} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">
                    {client.usage?.menu_count ?? 0}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">
                    {client.usage?.dish_count ?? 0}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">
                    {(client.usage?.scans_this_month ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {new Date(client.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm text-gray-400">
                    Aucun client trouve
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
