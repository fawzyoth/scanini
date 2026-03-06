"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

const LANGUAGES = [
  { code: "fr", name: "French", enabled: true },
  { code: "en", name: "English", enabled: false },
  { code: "ar", name: "Arabic", enabled: false },
  { code: "es", name: "Spanish", enabled: false },
];

export function LanguagesSection() {
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
          <span className="text-sm text-gray-700">{lang.name}</span>
          <Toggle enabled={lang.enabled} onChange={() => toggleLang(lang.code)} size="sm" />
        </div>
      ))}
    </div>
  );
}
