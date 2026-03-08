"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { useDashboard } from "@/lib/dashboard-context";
import { canUseLanguage, getMinPlanForLanguage, type PlanId } from "@/lib/plan-config";
import { UpgradeBadge } from "@/components/ui/upgrade-badge";

const LANGUAGES = [
  { code: "fr", nameKey: "languages.french" },
  { code: "en", nameKey: "languages.english" },
  { code: "ar", nameKey: "languages.arabic" },
  { code: "es", nameKey: "languages.spanish" },
];

export function LanguagesSection() {
  const { t } = useTranslation();
  const { restaurant } = useDashboard();
  const currentPlan = ((restaurant as any)?.plan ?? "free") as PlanId;

  const [enabledLangs, setEnabledLangs] = useState<Record<string, boolean>>({
    fr: true,
    en: false,
    ar: false,
    es: false,
  });

  function toggleLang(code: string) {
    if (!canUseLanguage(currentPlan, code)) return;
    setEnabledLangs((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  return (
    <div className="space-y-3">
      {LANGUAGES.map((lang) => {
        const locked = !canUseLanguage(currentPlan, lang.code);
        const requiredPlan = getMinPlanForLanguage(lang.code);

        return (
          <div key={lang.code} className={`flex items-center justify-between py-2 ${locked ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{t(lang.nameKey)}</span>
              {locked && <UpgradeBadge requiredPlan={requiredPlan} size="sm" />}
            </div>
            <Toggle
              enabled={enabledLangs[lang.code] ?? false}
              onChange={() => toggleLang(lang.code)}
              size="sm"
            />
          </div>
        );
      })}
    </div>
  );
}
