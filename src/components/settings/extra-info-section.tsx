"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function ExtraInfoSection() {
  const [text, setText] = useState("");
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t("extraInfoSection.additionalText")}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={t("extraInfoSection.placeholder")}
        />
      </div>
      <div className="pt-2">
        <Button size="sm">{t("common.saveChanges")}</Button>
      </div>
    </div>
  );
}
