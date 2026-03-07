"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  const qrContainerRef = useRef<HTMLDivElement>(null);

  function handleReset() {
    setSettings(DEFAULT_QR);
  }

  /** Build a standalone SVG string from the QR preview container */
  const buildSvgString = useCallback((size: number) => {
    const container = qrContainerRef.current;
    if (!container) return null;

    const svgEl = container.querySelector("svg");
    if (!svgEl) return null;

    const showFrame = settings.frameType !== "none";
    const frameText = settings.text || "";
    const padding = 16;
    const frameHeight = showFrame ? settings.fontSize + 24 : 0;
    const totalWidth = size + padding * 2;
    const totalHeight = size + padding * 2 + frameHeight;

    const topFrame = showFrame && settings.frameType === "top";
    const qrY = topFrame ? padding + frameHeight : padding;

    // Clone the QR SVG and set its dimensions
    const cloned = svgEl.cloneNode(true) as SVGElement;
    cloned.setAttribute("width", String(size));
    cloned.setAttribute("height", String(size));
    cloned.setAttribute("x", String(padding));
    cloned.setAttribute("y", String(qrY));
    // Remove any outer styles that interfere
    cloned.removeAttribute("style");

    const frameTextY = topFrame
      ? padding + settings.fontSize
      : size + padding * 2 + settings.fontSize;

    const frameSvg = showFrame
      ? `<text x="${totalWidth / 2}" y="${frameTextY}" text-anchor="middle" font-family="${settings.font}" font-size="${settings.fontSize}" font-weight="bold" fill="${settings.textColor}">${frameText}</text>`
      : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}">
      <rect width="${totalWidth}" height="${totalHeight}" rx="12" fill="${settings.backgroundColor}" />
      <rect x="${padding}" y="${qrY}" width="${size}" height="${size}" rx="8" fill="#FFFFFF" />
      ${cloned.outerHTML}
      ${frameSvg}
    </svg>`;
  }, [settings]);

  async function handleDownload() {
    if (downloadFormat === "svg") {
      const svg = buildSvgString(200);
      if (!svg) return;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      downloadBlob(blob, "qr-code.svg");
      return;
    }

    if (downloadFormat === "png") {
      const svg = buildSvgString(600);
      if (!svg) return;
      const blob = await svgToPngBlob(svg, 600 + 32, 600 + 32 + (settings.frameType !== "none" ? settings.fontSize + 24 : 0));
      if (blob) downloadBlob(blob, "qr-code.png");
      return;
    }

    // PDF formats
    const { jsPDF } = await import("jspdf");
    const count = downloadFormat === "pdf-16" ? 16 : 1;
    const qrSize = 600;
    const svg = buildSvgString(qrSize);
    if (!svg) return;

    const imgWidth = qrSize + 32;
    const imgHeight = qrSize + 32 + (settings.frameType !== "none" ? settings.fontSize + 24 : 0);
    const blob = await svgToPngBlob(svg, imgWidth, imgHeight);
    if (!blob) return;
    const dataUrl = await blobToDataUrl(blob);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    if (count === 1) {
      const w = 120;
      const h = w * (imgHeight / imgWidth);
      doc.addImage(dataUrl, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
    } else {
      const cols = 4;
      const rows = 4;
      const margin = 10;
      const gap = 4;
      const cellW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
      const cellH = (pageH - margin * 2 - gap * (rows - 1)) / rows;
      const w = Math.min(cellW, cellH * (imgWidth / imgHeight));
      const h = w * (imgHeight / imgWidth);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = margin + c * (cellW + gap) + (cellW - w) / 2;
          const y = margin + r * (cellH + gap) + (cellH - h) / 2;
          doc.addImage(dataUrl, "PNG", x, y, w, h);
        }
      }
    }

    doc.save("qr-code.pdf");
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function svgToPngBlob(svgString: string, w: number, h: number): Promise<Blob | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w * 2;
        canvas.height = h * 2;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      img.onerror = () => resolve(null);
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    });
  }

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
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
            <div ref={qrContainerRef} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 flex flex-col items-center">
              <QRPreview settings={settings} url={menuUrl} />
            </div>

            <Select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              options={DOWNLOAD_OPTIONS}
            />

            <Button fullWidth size="lg" onClick={handleDownload}>
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
