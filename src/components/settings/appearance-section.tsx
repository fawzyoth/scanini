"use client";

import { useState, useEffect } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";
import { useTranslation } from "@/lib/i18n/i18n-context";
import type { MenuTemplate } from "@/types";
import { Check } from "lucide-react";

export function AppearanceSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const { t } = useTranslation();
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [template, setTemplate] = useState<MenuTemplate>("classic");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setPrimaryColor((restaurant as any).primary_color ?? "#4F46E5");
      setTemplate((restaurant as any).template ?? "classic");
      setAnimationsEnabled((restaurant as any).animations_enabled ?? true);
    }
  }, [restaurant]);

  async function handleSave() {
    await updateRestaurant({ primary_color: primaryColor, template, animations_enabled: animationsEnabled } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Template selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t("appearance.template")}
        </label>
        <div className="grid grid-cols-4 gap-3">
          <TemplateOption
            active={template === "classic"}
            onClick={() => setTemplate("classic")}
            label={t("appearance.templateClassic")}
          >
            {/* Classic template preview */}
            <div className="space-y-1.5">
              <div className="h-8 bg-gradient-to-r from-amber-200 to-orange-200 rounded-t" />
              <div className="px-1.5 space-y-1">
                <div className="h-1.5 w-12 bg-gray-300 rounded" />
                <div className="h-1 w-8 bg-gray-200 rounded" />
              </div>
              <div className="px-1.5 space-y-1">
                <div className="h-5 bg-white border border-gray-200 rounded flex items-center px-1.5 gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-sm" />
                  <div className="h-1 w-6 bg-gray-300 rounded" />
                </div>
                <div className="h-5 bg-white border border-gray-200 rounded flex items-center px-1.5 gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-sm" />
                  <div className="h-1 w-8 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          </TemplateOption>

          <TemplateOption
            active={template === "card"}
            onClick={() => setTemplate("card")}
            label={t("appearance.templateCard")}
          >
            {/* Card template preview */}
            <div className="space-y-1.5">
              <div className="h-8 bg-gradient-to-r from-amber-200 to-orange-200 rounded-t" />
              <div className="px-1.5 flex gap-1">
                <div className="h-3 w-8 bg-orange-400 rounded-full" />
                <div className="h-3 w-8 bg-gray-200 rounded-full" />
              </div>
              <div className="px-1.5 space-y-1">
                <div className="h-7 bg-white border border-gray-200 rounded flex items-center px-1 gap-1">
                  <div className="flex-1 space-y-0.5">
                    <div className="h-1 w-6 bg-gray-300 rounded" />
                    <div className="h-1 w-4 bg-gray-200 rounded" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
                <div className="h-7 bg-white border border-gray-200 rounded flex items-center px-1 gap-1">
                  <div className="flex-1 space-y-0.5">
                    <div className="h-1 w-8 bg-gray-300 rounded" />
                    <div className="h-1 w-5 bg-gray-200 rounded" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </TemplateOption>

          <TemplateOption
            active={template === "profile"}
            onClick={() => setTemplate("profile")}
            label={t("appearance.templateProfile")}
          >
            {/* Profile template preview */}
            <div className="space-y-1">
              <div className="h-6 bg-gradient-to-r from-amber-200 to-orange-200 rounded-t" />
              <div className="flex justify-center -mt-2.5 relative z-10">
                <div className="w-5 h-5 rounded-full bg-gray-800 border-2 border-white" />
              </div>
              <div className="flex justify-center">
                <div className="h-1 w-8 bg-gray-300 rounded" />
              </div>
              <div className="px-1.5 space-y-1 pt-0.5">
                <div className="h-5 bg-white border border-gray-200 rounded flex items-center px-1.5 gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-sm" />
                  <div className="h-1 w-6 bg-gray-300 rounded" />
                </div>
                <div className="h-5 bg-white border border-gray-200 rounded flex items-center px-1.5 gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-sm" />
                  <div className="h-1 w-8 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          </TemplateOption>

          <TemplateOption
            active={template === "dark"}
            onClick={() => setTemplate("dark")}
            label={t("appearance.templateDark")}
          >
            {/* Dark template preview */}
            <div className="space-y-1.5" style={{ backgroundColor: "#1a1a1a" }}>
              <div className="mx-1.5 mt-1.5 h-7 bg-gray-700 rounded" />
              <div className="flex justify-center">
                <div className="h-1 w-10 bg-gray-500 rounded" />
              </div>
              <div className="flex justify-center">
                <div className="h-1 w-6 bg-gray-600 rounded" />
              </div>
              <div className="px-1.5 pb-1.5 space-y-1">
                <div className="h-5 rounded flex items-center px-1.5 gap-1" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#D4A853" }} />
                  <div className="h-1 w-6 bg-gray-500 rounded" />
                </div>
                <div className="h-5 rounded flex items-center px-1.5 gap-1" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#D4A853" }} />
                  <div className="h-1 w-8 bg-gray-500 rounded" />
                </div>
              </div>
            </div>
          </TemplateOption>
        </div>
      </div>

      <ColorPicker label={t("appearance.primaryColor")} value={primaryColor} onChange={setPrimaryColor} />
      <p className="text-xs text-gray-400">
        {t("appearance.colorDesc")}
      </p>

      {/* Animations toggle */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-gray-700">{t("appearance.animations")}</p>
          <p className="text-xs text-gray-400">{t("appearance.animationsDesc")}</p>
        </div>
        <button
          type="button"
          onClick={() => setAnimationsEnabled(!animationsEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            animationsEnabled ? "bg-indigo-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              animationsEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>{t("common.saveChanges")}</Button>
        {saved && <span className="text-sm text-green-600 font-medium">{t("common.saved")}</span>}
      </div>
    </div>
  );
}

function TemplateOption({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-2 transition-all text-left ${
        active
          ? "border-indigo-500 bg-indigo-50/50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {active && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
      <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
        {children}
      </div>
      <p className="text-xs font-medium text-gray-700 mt-2 text-center">{label}</p>
    </button>
  );
}
