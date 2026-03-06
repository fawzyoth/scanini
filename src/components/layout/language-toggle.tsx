"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  function handleToggle() {
    setLocale(locale === "fr" ? "en" : "fr");
  }

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      title={t("lang.label")}
    >
      <Languages size={14} />
      {t("lang.switch")}
    </button>
  );
}
