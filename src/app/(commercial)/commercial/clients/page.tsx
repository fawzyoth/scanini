"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, Phone, ArrowUpDown, Plus, X, Eye, EyeOff } from "lucide-react";
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
  const [showCreate, setShowCreate] = useState(false);

  async function loadClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/commercial");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes clients</h1>
          <p className="text-sm text-gray-500 mt-1">{clients.length} restaurant{clients.length > 1 ? "s" : ""} gere{clients.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un client
        </button>
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
                        {client.owner ? `${client.owner.first_name} ${client.owner.last_name}` : "\u2014"}
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
                      <span className="text-xs text-gray-400">\u2014</span>
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

      {showCreate && (
        <CreateClientModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); loadClients(); }}
        />
      )}
    </div>
  );
}

function CreateClientModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    restaurant_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.first_name || !form.restaurant_name || !form.email || !form.phone || !form.password) {
      setError("Tous les champs obligatoires doivent etre remplis");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/commercial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la creation");
        return;
      }
      onCreated();
    } catch {
      setError("Erreur reseau");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Nouveau client</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Prenom *</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ahmed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ben Ali"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nom du restaurant *</label>
            <input
              type="text"
              value={form.restaurant_name}
              onChange={(e) => update("restaurant_name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="La Bouffe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ahmed@restaurant.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Telephone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+216 XX XXX XXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mot de passe *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Min. 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <p className="text-xs text-green-700">Le compte sera active automatiquement — aucune approbation necessaire.</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Creer le client
            </button>
          </div>
        </form>
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
