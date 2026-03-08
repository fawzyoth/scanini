"use client";

import { useState } from "react";
import { QRSettings } from "@/types";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import { FrameTypeSelector } from "./frame-type-selector";
import { CropIcon, Palette, ImageIcon, Loader2, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface QRSettingsPanelProps {
  settings: QRSettings;
  onChange: (settings: QRSettings) => void;
}

const FONT_OPTIONS = [
  { value: "Roboto", label: "Roboto" },
  { value: "Inter", label: "Inter" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
];

export function QRSettingsPanel({ settings, onChange }: QRSettingsPanelProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  function update(partial: Partial<QRSettings>) {
    onChange({ ...settings, ...partial });
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update({ logo: data.url });
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Accordion
        icon={<CropIcon size={20} />}
        title={t("qr.frame")}
        defaultOpen
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("qr.frameType")}</label>
            <FrameTypeSelector value={settings.frameType} onChange={(v) => update({ frameType: v })} />
          </div>
          <ColorPicker label={t("qr.backgroundColor")} value={settings.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
          <Input label={t("qr.text")} value={settings.text} onChange={(e) => update({ text: e.target.value })} />
          <ColorPicker label={t("qr.textColor")} value={settings.textColor} onChange={(v) => update({ textColor: v })} />
          <Select
            label={t("qr.typographicFont")}
            value={settings.font}
            onChange={(e) => update({ font: e.target.value })}
            options={FONT_OPTIONS}
          />
          <Slider label={t("qr.fontSize")} value={settings.fontSize} onChange={(v) => update({ fontSize: v })} min={12} max={48} />
        </div>
      </Accordion>

      <Accordion icon={<Palette size={20} />} title={t("qr.shapeAndColor")}>
        <div className="space-y-4">
          <ColorPicker label={t("qr.dotColor")} value={settings.dotColor} onChange={(v) => update({ dotColor: v })} />
          <ColorPicker label={t("qr.cornerColor")} value={settings.cornerColor} onChange={(v) => update({ cornerColor: v })} />
        </div>
      </Accordion>

      <Accordion icon={<ImageIcon size={20} />} title={t("qr.logo")}>
        <div className="text-sm text-gray-500">
          <p>{t("qr.logoDesc")}</p>

          {settings.logo ? (
            <div className="mt-3 flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img src={settings.logo} alt="QR Logo" className="w-full h-full object-contain" />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => update({ logo: undefined })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X size={12} />
                Supprimer
              </button>
            </div>
          ) : (
            <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 size={16} className="animate-spin text-indigo-500" />
              ) : (
                <ImageIcon size={16} className="text-gray-400" />
              )}
              {t("qr.uploadLogo")}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          )}
        </div>
      </Accordion>
    </div>
  );
}
