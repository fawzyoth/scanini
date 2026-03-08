"use client";

import { QRCodeSVG } from "qrcode.react";
import { QRSettings } from "@/types";

interface QRPreviewProps {
  settings: QRSettings;
  url: string;
}

export function QRPreview({ settings, url }: QRPreviewProps) {
  const showFrame = settings.frameType !== "none";

  return (
    <div
      className="rounded-xl overflow-hidden inline-flex flex-col items-center"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {showFrame && settings.frameType === "top" && (
        <div className="py-3 px-6" style={{ fontFamily: settings.font }}>
          <span style={{ color: settings.textColor, fontSize: settings.fontSize }}>
            {settings.text}
          </span>
        </div>
      )}

      <div className="p-4">
        <QRCodeSVG
          value={url}
          size={200}
          bgColor="#FFFFFF"
          fgColor={settings.dotColor}
          level={settings.logo ? "H" : "M"}
          style={{ borderRadius: 8 }}
          {...(settings.logo ? {
            imageSettings: {
              src: settings.logo,
              height: 40,
              width: 40,
              excavate: true,
            }
          } : {})}
        />
      </div>

      {showFrame && settings.frameType === "bottom" && (
        <div className="py-3 px-6" style={{ fontFamily: settings.font }}>
          <span
            className="font-bold"
            style={{ color: settings.textColor, fontSize: settings.fontSize }}
          >
            {settings.text}
          </span>
        </div>
      )}
    </div>
  );
}
