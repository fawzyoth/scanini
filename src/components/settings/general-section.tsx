"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function GeneralSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [coverImage, setCoverImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setPhone(restaurant.phone ?? "");
      setAddress(restaurant.address ?? "");
      setCurrency((restaurant as any).currency ?? "EUR");
      setCoverImage((restaurant as any).cover_image ?? "");
    }
  }, [restaurant]);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoverImage(data.url);
    } catch (err) {
      console.error("Cover upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    await updateRestaurant({
      name,
      phone: phone || null,
      address: address || null,
      currency,
      cover_image: coverImage || null,
    } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Cover image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("general.coverImage")}</label>
        <label className="block cursor-pointer">
          {coverImage ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <Loader2 size={24} className="animate-spin text-indigo-500" />
                </div>
              )}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setCoverImage(""); }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow"
              >
                <X size={14} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-indigo-500" />
              ) : (
                <>
                  <ImageIcon size={32} className="text-gray-300" />
                  <span className="text-sm text-indigo-600 font-medium">{t("general.uploadCover")}</span>
                  <span className="text-xs text-gray-400">{t("general.recommended")}</span>
                </>
              )}
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
        </label>
      </div>

      <Input label={t("general.restaurantName")} value={name} onChange={(e) => setName(e.target.value)} />
      <Input label={t("general.phoneNumber")} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input label={t("general.address")} value={address} onChange={(e) => setAddress(e.target.value)} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t("general.currency")}</label>
        <div className="flex gap-2">
          {[
            { code: "EUR", label: "Euro (EUR)" },
            { code: "USD", label: "Dollar (USD)" },
            { code: "TND", label: "Dinar (TND)" },
          ].map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                currency === c.code
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>{t("common.saveChanges")}</Button>
        {saved && <span className="text-sm text-green-600 font-medium">{t("common.saved")}</span>}
      </div>
    </div>
  );
}
