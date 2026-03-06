"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { useTranslation } from "@/lib/i18n/i18n-context";

const LANGUAGES = [
  { code: "fr", nameKey: "languages.french", enabled: true },
  { code: "en", nameKey: "languages.english", enabled: false },
  { code: "ar", nameKey: "languages.arabic", enabled: false },
  { code: "es", nameKey: "languages.spanish", enabled: false },
];

export function LanguagesSection() {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState(LANGUAGES);

  function toggleLang(code: string) {
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, enabled: !l.enabled } : l))
    );
  }

  return (
    <div className="space-y-3">
      {languages.map((lang) => (
        <div key={lang.code} className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">{t(lang.nameKey)}</span>
          <Toggle enabled={lang.enabled} onChange={() => toggleLang(lang.code)} size="sm" />
        </div>
      ))}
    </div>
  );
}
