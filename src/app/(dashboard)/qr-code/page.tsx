"use client";

import { useState, useEffect } from "react";
import { Link2, Info, Loader2 } from "lucide-react";
import { Button, PageHeader, Select } from "@/components/ui";
import { QRPreview, QRSettingsPanel } from "@/components/qr-code";
import { useDashboard } from "@/lib/dashboard-context";
import { QRSettings } from "@/types";
import { useTranslation } from "@/lib/i18n/i18n-context";

const DEFAULT_QR: QRSettings = {
  frameType: "bottom",
  backgroundColor: "#000000",
  text: "MENU",
  textColor: "#FFFFFF",
  font: "Roboto",
  fontSize: 24,
  dotStyle: "square",
  dotColor: "#000000",
  cornerStyle: "square",
  cornerColor: "#000000",
};

export default function QRCodePage() {
  const { qrSettings, restaurant, loading } = useDashboard();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_QR);
  const [downloadFormat, setDownloadFormat] = useState("pdf-16");

  useEffect(() => {
    if (qrSettings) setSettings(qrSettings);
  }, [qrSettings]);

  function handleReset() {
    setSettings(DEFAULT_QR);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const menuUrl = typeof window !== "undefined"
    ? `${window.location.origin}/menu/${restaurant?.id ?? ""}`
    : `/menu/${restaurant?.id ?? ""}`;

  const DOWNLOAD_OPTIONS = [
    { value: "pdf-16", label: t("qr.pdf16") },
    { value: "pdf-1", label: t("qr.pdf1") },
    { value: "png", label: t("qr.pngImage") },
    { value: "svg", label: t("qr.svgVector") },
  ];

  return (
    <>
      <PageHeader title={t("qr.title")}>
        <div className="flex items-center gap-1 text-gray-400">
          <Info size={16} />
        </div>
        <Button variant="outline" size="md" onClick={() => { navigator.clipboard.writeText(menuUrl); }}>
          <Link2 size={16} />
          {t("qr.copyLink")}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-2 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col items-center">
              <QRPreview settings={settings} url={menuUrl} />
            </div>

            <Select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              options={DOWNLOAD_OPTIONS}
            />

            <Button fullWidth size="lg">
              {t("qr.downloadQr")}
            </Button>

            <button
              onClick={handleReset}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700"
            >
              {t("qr.resetSettings")}
            </button>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-800">
                {t("qr.claimStickers")}
              </h4>
              <p className="text-xs text-green-700 mt-1">
                {t("qr.stickersDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 lg:order-1">
          <QRSettingsPanel settings={settings} onChange={setSettings} />
        </div>
      </div>
    </>
  );
}
