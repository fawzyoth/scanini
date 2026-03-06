"use client";

import { QRSettings } from "@/types";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import { FrameTypeSelector } from "./frame-type-selector";
import { CropIcon, Palette, ImageIcon } from "lucide-react";
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

  function update(partial: Partial<QRSettings>) {
    onChange({ ...settings, ...partial });
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
          <button className="mt-3 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            {t("qr.uploadLogo")}
          </button>
        </div>
      </Accordion>
    </div>
  );
}
