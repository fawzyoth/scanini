"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function SocialMediaSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const { t } = useTranslation();
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setInstagram(restaurant.social_instagram ?? "");
      setFacebook(restaurant.social_facebook ?? "");
      setTiktok(restaurant.social_tiktok ?? "");
    }
  }, [restaurant]);

  async function handleSave() {
    await updateRestaurant({
      social_instagram: instagram || null,
      social_facebook: facebook || null,
      social_tiktok: tiktok || null,
    } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" />
      <Input label="Facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder={t("social.pageName")} />
      <Input label="TikTok" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="@username" />
      <div className="pt-2 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>{t("common.saveChanges")}</Button>
        {saved && <span className="text-sm text-green-600 font-medium">{t("common.saved")}</span>}
      </div>
    </div>
  );
}
