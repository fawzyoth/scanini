"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Check, X } from "lucide-react";

interface PlanConfig {
  id: string;
  display_name: string;
  monthly_price: number;
  yearly_price: number;
  description: string;
  max_menus: number;
  max_dishes: number;
  max_scans_per_month: number;
  templates: string[];
  languages: string[];
  social_media: string[];
  reviews_enabled: boolean;
  search_enabled: boolean;
  custom_qr: boolean;
  white_label: boolean;
  custom_theme: boolean;
  advanced_stats: boolean;
  support_hours: string | null;
  scanini_logo: boolean;
  is_popular: boolean;
}

const ALL_TEMPLATES = ["classic", "card", "profile", "dark"];
const ALL_LANGUAGES = ["fr", "en", "ar", "es"];
const ALL_SOCIALS = ["facebook", "instagram", "tiktok"];

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/plans");
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
    load();
  }, []);

  function updatePlan(id: string, field: string, value: any) {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  function toggleArrayItem(id: string, field: string, item: string) {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const arr = (p as any)[field] as string[];
        const next = arr.includes(item)
          ? arr.filter((x) => x !== item)
          : [...arr, item];
        return { ...p, [field]: next };
      })
    );
  }

  async function handleSave(plan: PlanConfig) {
    setSaving(plan.id);
    try {
      const { id, ...updates } = plan;
      await fetch("/api/admin/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      setSaved(plan.id);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      // ignore
    }
    setSaving(null);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure pricing, limits, and features for each subscription tier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlanBadge plan={plan.id} />
                <div>
                  <input
                    type="text"
                    value={plan.display_name}
                    onChange={(e) => updatePlan(plan.id, "display_name", e.target.value)}
                    className="text-sm font-bold text-gray-900 border-none p-0 focus:outline-none focus:ring-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={plan.description}
                    onChange={(e) => updatePlan(plan.id, "description", e.target.value)}
                    className="block text-xs text-gray-500 border-none p-0 focus:outline-none focus:ring-0 bg-transparent w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saved === plan.id && (
                  <span className="text-xs text-green-600 font-medium">Saved!</span>
                )}
                <button
                  onClick={() => handleSave(plan)}
                  disabled={saving === plan.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving === plan.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Save size={12} />
                  )}
                  Save
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Pricing */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Pricing</h3>
                <div className="grid grid-cols-2 gap-3">
                  <NumberField
                    label="Monthly (DT)"
                    value={plan.monthly_price}
                    onChange={(v) => updatePlan(plan.id, "monthly_price", v)}
                  />
                  <NumberField
                    label="Yearly (DT)"
                    value={plan.yearly_price}
                    onChange={(v) => updatePlan(plan.id, "yearly_price", v)}
                  />
                </div>
              </div>

              {/* Limits */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Limits</h3>
                <div className="grid grid-cols-3 gap-3">
                  <NumberField
                    label="Max menus"
                    value={plan.max_menus}
                    onChange={(v) => updatePlan(plan.id, "max_menus", v)}
                  />
                  <NumberField
                    label="Max dishes"
                    value={plan.max_dishes}
                    onChange={(v) => updatePlan(plan.id, "max_dishes", v)}
                  />
                  <NumberField
                    label="Max scans/mo"
                    value={plan.max_scans_per_month}
                    onChange={(v) => updatePlan(plan.id, "max_scans_per_month", v)}
                  />
                </div>
              </div>

              {/* Templates */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Templates</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_TEMPLATES.map((t) => (
                    <ToggleChip
                      key={t}
                      label={t}
                      active={plan.templates.includes(t)}
                      onClick={() => toggleArrayItem(plan.id, "templates", t)}
                    />
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_LANGUAGES.map((l) => (
                    <ToggleChip
                      key={l}
                      label={l.toUpperCase()}
                      active={plan.languages.includes(l)}
                      onClick={() => toggleArrayItem(plan.id, "languages", l)}
                    />
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Social Media</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_SOCIALS.map((s) => (
                    <ToggleChip
                      key={s}
                      label={s.charAt(0).toUpperCase() + s.slice(1)}
                      active={plan.social_media.includes(s)}
                      onClick={() => toggleArrayItem(plan.id, "social_media", s)}
                    />
                  ))}
                </div>
              </div>

              {/* Feature toggles */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  <FeatureToggle
                    label="Reviews"
                    enabled={plan.reviews_enabled}
                    onChange={(v) => updatePlan(plan.id, "reviews_enabled", v)}
                  />
                  <FeatureToggle
                    label="Search"
                    enabled={plan.search_enabled}
                    onChange={(v) => updatePlan(plan.id, "search_enabled", v)}
                  />
                  <FeatureToggle
                    label="Custom QR"
                    enabled={plan.custom_qr}
                    onChange={(v) => updatePlan(plan.id, "custom_qr", v)}
                  />
                  <FeatureToggle
                    label="White label"
                    enabled={plan.white_label}
                    onChange={(v) => updatePlan(plan.id, "white_label", v)}
                  />
                  <FeatureToggle
                    label="Custom theme"
                    enabled={plan.custom_theme}
                    onChange={(v) => updatePlan(plan.id, "custom_theme", v)}
                  />
                  <FeatureToggle
                    label="Advanced stats"
                    enabled={plan.advanced_stats}
                    onChange={(v) => updatePlan(plan.id, "advanced_stats", v)}
                  />
                  <FeatureToggle
                    label="Scanini logo"
                    enabled={plan.scanini_logo}
                    onChange={(v) => updatePlan(plan.id, "scanini_logo", v)}
                  />
                  <FeatureToggle
                    label="Popular badge"
                    enabled={plan.is_popular}
                    onChange={(v) => updatePlan(plan.id, "is_popular", v)}
                  />
                </div>
              </div>

              {/* Support hours */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Support response time</h3>
                <input
                  type="text"
                  value={plan.support_hours ?? ""}
                  onChange={(e) =>
                    updatePlan(plan.id, "support_hours", e.target.value || null)
                  }
                  placeholder="e.g. 24h, 48h (leave empty for none)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
          : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
      }`}
    >
      {active ? <Check size={10} /> : <X size={10} />}
      {label}
    </button>
  );
}

function FeatureToggle({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
        enabled
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-gray-50 border-gray-200 text-gray-500"
      }`}
    >
      {enabled ? <Check size={12} /> : <X size={12} />}
      {label}
    </button>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: "bg-gray-100 text-gray-600",
    starter: "bg-blue-50 text-blue-700",
    pro: "bg-indigo-50 text-indigo-700",
    business: "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
        styles[plan] || styles.free
      }`}
    >
      {plan}
    </span>
  );
}
