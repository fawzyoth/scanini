"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MoreVertical, ArrowUpDown, Phone, CheckCircle2, XCircle, Loader2, DollarSign } from "lucide-react";
import type { Profile } from "@/types/database";
import { PLANS } from "@/lib/plan-config";

type UserRow = {
  id: string;
  profile_id: string;
  name: string;
  owner_id: string;
  status: string;
  plan: string;
  created_at: string;
  profile: Profile | null;
  restaurant: any;
  scans_this_month: number;
  has_restaurant: boolean;
  payment_status: "paid" | "pending" | "overdue" | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "created" | "scans">("created");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch {
      // ignore
    }
    setLoading(false);
  }

  function toggleSort(field: "name" | "created" | "scans") {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  }

  const pendingUsers = users.filter((u) => u.status === "pending");

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase();
      const fullName = u.profile ? `${u.profile.first_name} ${u.profile.last_name}` : "";
      const email = u.profile?.email ?? "";
      if (q && !u.name.toLowerCase().includes(q) && !email.toLowerCase().includes(q) && !fullName.toLowerCase().includes(q)) return false;
      if (filterPlan !== "all" && u.plan !== filterPlan) return false;
      if (filterStatus !== "all" && u.status !== filterStatus) return false;
      if (filterPayment === "paid" && u.payment_status !== "paid") return false;
      if (filterPayment === "unpaid" && u.payment_status === "paid") return false;
      if (filterPayment === "pending" && u.payment_status !== "pending") return false;
      if (filterPayment === "overdue" && u.payment_status !== "overdue") return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
      if (sortBy === "scans") return (a.scans_this_month - b.scans_this_month) * dir;
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
    });

  async function handleApprove(user: UserRow) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, profile_id: user.profile_id, status: "active" }),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.profile_id === user.profile_id ? { ...u, status: "active" } : u
      )
    );
  }

  async function handleReject(user: UserRow) {
    await fetch(`/api/admin/users?id=${user.id}&profile_id=${user.profile_id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.profile_id !== user.profile_id));
  }

  async function handleSuspend(user: UserRow) {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, profile_id: user.profile_id, status: newStatus }),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.profile_id === user.profile_id ? { ...u, status: newStatus } : u
      )
    );
  }

  async function handleDelete(user: UserRow) {
    await fetch(`/api/admin/users?id=${user.id}&profile_id=${user.profile_id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.profile_id !== user.profile_id));
  }

  async function handleTogglePayment(user: UserRow) {
    if (!user.has_restaurant || user.plan === "free") return;
    const now = new Date();
    const newStatus = user.payment_status === "paid" ? "pending" : "paid";
    await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_id: user.id,
        period_month: now.getMonth() + 1,
        period_year: now.getFullYear(),
        amount: 0,
        plan: user.plan,
        status: newStatus,
      }),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, payment_status: newStatus } : u
      )
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} restaurants registered</p>
        </div>
      </div>

      {/* Pending approval banner */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-semibold text-amber-900">
              {pendingUsers.length} pending approval{pendingUsers.length > 1 ? "s" : ""}
            </h2>
          </div>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg border border-amber-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "—"} &middot; {user.profile?.email ?? "—"}
                  </p>
                  {user.profile?.phone && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Phone size={12} className="text-indigo-500" />
                      <a
                        href={`https://wa.me/${user.profile.phone.replace(/\s+/g, "").replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {user.profile.phone}
                      </a>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    Signed up {new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(user)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, restaurant, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Table */}
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
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Owner</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Phone</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Paiement</th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                  <button onClick={() => toggleSort("scans")} className="flex items-center gap-1 hover:text-gray-700">
                    Scans <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                  <button onClick={() => toggleSort("created")} className="flex items-center gap-1 hover:text-gray-700">
                    Joined <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="w-12 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.status === "pending" ? "bg-amber-50/30" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div>
                      <Link href={`/admin/users/${user.has_restaurant ? user.id : user.profile_id}`} className="text-sm text-gray-900 hover:text-indigo-600 font-medium">
                        {user.name}
                      </Link>
                      {!user.has_restaurant && (
                        <span className="ml-2 text-[10px] text-orange-500 font-medium">No restaurant</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm text-gray-700">
                        {user.profile ? `${user.profile.first_name} ${user.profile.last_name}` : "—"}
                      </p>
                      <p className="text-xs text-gray-400">{user.profile?.email ?? "—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {user.profile?.phone ? (
                      <a
                        href={`https://wa.me/${user.profile.phone.replace(/\s+/g, "").replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {user.profile.phone}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <PlanBadge plan={user.plan} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {user.plan === "free" ? (
                      <span className="text-[11px] text-gray-400">Gratuit</span>
                    ) : (
                      <button
                        onClick={() => handleTogglePayment(user)}
                        title={user.payment_status === "paid" ? "Marquer comme impaye" : "Marquer comme paye"}
                      >
                        <PaymentBadge status={user.payment_status} />
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">
                    {user.scans_this_month.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <UserActions
                      user={user}
                      onApprove={() => handleApprove(user)}
                      onSuspend={() => handleSuspend(user)}
                      onDelete={() => handleDelete(user)}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm text-gray-400">
                    No users found
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

function UserActions({
  user,
  onApprove,
  onSuspend,
  onDelete,
}: {
  user: UserRow;
  onApprove: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-gray-200 rounded-lg py-1 shadow-lg">
            <Link
              href={`/admin/users/${user.id}`}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              View details
            </Link>
            {user.status === "pending" && (
              <button
                onClick={() => { onApprove(); setOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Approve
              </button>
            )}
            {user.status !== "pending" && (
              <button
                onClick={() => { onSuspend(); setOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {user.status === "suspended" ? "Reactivate" : "Suspend"}
              </button>
            )}
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              {user.status === "pending" ? "Reject" : "Delete user"}
            </button>
          </div>
        </>
      )}
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
