"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, CheckCircle2, DollarSign, Phone } from "lucide-react";
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

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const ownerName = c.owner ? `${c.owner.first_name} ${c.owner.last_name}` : "";
    return c.name.toLowerCase().includes(q) || ownerName.toLowerCase().includes(q);
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
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const price = PLAN_PRICES[client.plan]?.monthly ?? 0;
          const isPaid = client.payment?.status === "paid";
          const planName = PLANS[client.plan as keyof typeof PLANS]?.name ?? client.plan;

          return (
            <div key={client.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {client.owner ? `${client.owner.first_name} ${client.owner.last_name}` : "—"}
                  </p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  client.status === "active" ? "bg-green-50 text-green-700" :
                  client.status === "suspended" ? "bg-red-50 text-red-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-medium text-gray-900">{planName} — {price > 0 ? `${price} DT/mois` : "Gratuit"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Menus</span>
                  <span className="text-gray-700">{client.usage?.menu_count ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Plats</span>
                  <span className="text-gray-700">{client.usage?.dish_count ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Scans ce mois</span>
                  <span className="text-gray-700">{(client.usage?.scans_this_month ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {price > 0 ? (
                  isPaid ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700">
                      <CheckCircle2 size={12} /> Paye
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                      <DollarSign size={12} /> Impaye
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-gray-400">Gratuit</span>
                )}

                {client.owner?.phone && (
                  <a
                    href={`https://wa.me/${client.owner.phone.replace(/\s+/g, "").replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    <Phone size={12} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Aucun client trouve</p>
      )}
    </div>
  );
}
