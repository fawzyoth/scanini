"use client";

import { Restaurant } from "@/types";
import { Wifi, Phone, MapPin, Instagram, Facebook, Copy, ChevronRight } from "lucide-react";
import { useState } from "react";

interface InfoSheetProps {
  open: boolean;
  onClose: () => void;
  restaurant: Restaurant;
}

export function InfoSheet({ open, onClose, restaurant }: InfoSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  function handleCopyWifi() {
    if (restaurant.wifi?.password) {
      navigator.clipboard.writeText(restaurant.wifi.password).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const items: { icon: React.ReactNode; label: string; action?: React.ReactNode; onClick?: () => void }[] = [];

  if (restaurant.wifi) {
    items.push({
      icon: <Wifi size={22} className="text-gray-700" />,
      label: restaurant.wifi.ssid,
      action: (
        <button onClick={handleCopyWifi} className="p-1 text-gray-400 hover:text-gray-600">
          {copied ? (
            <span className="text-xs text-green-600 font-medium">Copie!</span>
          ) : (
            <Copy size={18} />
          )}
        </button>
      ),
    });
  }

  if (restaurant.phone) {
    items.push({
      icon: <Phone size={22} className="text-gray-700" />,
      label: restaurant.phone,
      action: <ChevronRight size={18} className="text-gray-400" />,
      onClick: () => window.open(`tel:${restaurant.phone}`, "_self"),
    });
  }

  if (restaurant.address) {
    items.push({
      icon: <MapPin size={22} className="text-gray-700" />,
      label: restaurant.address,
      action: <ChevronRight size={18} className="text-gray-400" />,
      onClick: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`, "_blank"),
    });
  }

  if (restaurant.socialMedia?.instagram) {
    const ig = restaurant.socialMedia.instagram;
    const igUrl = ig.startsWith("http") ? ig : `https://instagram.com/${ig.replace(/^@/, "")}`;
    items.push({
      icon: <Instagram size={22} className="text-gray-700" />,
      label: "Instagram",
      action: <ChevronRight size={18} className="text-gray-400" />,
      onClick: () => window.open(igUrl, "_blank"),
    });
  }

  if (restaurant.socialMedia?.facebook) {
    const fb = restaurant.socialMedia.facebook;
    const fbUrl = fb.startsWith("http") ? fb : `https://facebook.com/${fb}`;
    items.push({
      icon: <Facebook size={22} className="text-gray-700" />,
      label: "Facebook",
      action: <ChevronRight size={18} className="text-gray-400" />,
      onClick: () => window.open(fbUrl, "_blank"),
    });
  }

  if (restaurant.socialMedia?.tiktok) {
    const tt = restaurant.socialMedia.tiktok;
    const ttUrl = tt.startsWith("http") ? tt : `https://tiktok.com/@${tt.replace(/^@/, "")}`;
    items.push({
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      ),
      label: "TikTok",
      action: <ChevronRight size={18} className="text-gray-400" />,
      onClick: () => window.open(ttUrl, "_blank"),
    });
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl max-h-[85%] flex flex-col animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <h3 className="text-xl font-bold text-gray-900 mt-2 mb-4">
            {restaurant.name}
          </h3>

          <div className="divide-y divide-gray-100">
            {items.map((item, i) => {
              const Row = item.onClick ? "button" : "div";
              return (
                <Row
                  key={i}
                  className={`flex items-center gap-4 py-4 w-full text-left ${item.onClick ? "cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg" : ""}`}
                  onClick={item.onClick}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
                  {item.action && <div className="shrink-0">{item.action}</div>}
                </Row>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
