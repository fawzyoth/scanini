"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { canUseSocial, getMinPlanForSocial, type PlanId } from "@/lib/plan-config";
import { UpgradeBadge } from "@/components/ui/upgrade-badge";

export function SocialMediaSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const { t } = useTranslation();
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [saved, setSaved] = useState(false);

  const currentPlan = ((restaurant as any)?.plan ?? "free") as PlanId;

  useEffect(() => {
    if (restaurant) {
      setInstagram(restaurant.social_instagram ?? "");
      setFacebook(restaurant.social_facebook ?? "");
      setTiktok(restaurant.social_tiktok ?? "");
    }
  }, [restaurant]);

  async function handleSave() {
    await updateRestaurant({
      social_instagram: canUseSocial(currentPlan, "instagram") ? (instagram || null) : null,
      social_facebook: canUseSocial(currentPlan, "facebook") ? (facebook || null) : null,
      social_tiktok: canUseSocial(currentPlan, "tiktok") ? (tiktok || null) : null,
    } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fbLocked = !canUseSocial(currentPlan, "facebook");
  const igLocked = !canUseSocial(currentPlan, "instagram");
  const tkLocked = !canUseSocial(currentPlan, "tiktok");

  return (
    <div className="space-y-4">
      <SocialField
        label="Facebook"
        value={facebook}
        onChange={setFacebook}
        placeholder={t("social.pageName")}
        locked={fbLocked}
        requiredPlan={getMinPlanForSocial("facebook")}
      />
      <SocialField
        label="Instagram"
        value={instagram}
        onChange={setInstagram}
        placeholder="@username"
        locked={igLocked}
        requiredPlan={getMinPlanForSocial("instagram")}
      />
      <SocialField
        label="TikTok"
        value={tiktok}
        onChange={setTiktok}
        placeholder="@username"
        locked={tkLocked}
        requiredPlan={getMinPlanForSocial("tiktok")}
      />
      <div className="pt-2 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>{t("common.saveChanges")}</Button>
        {saved && <span className="text-sm text-green-600 font-medium">{t("common.saved")}</span>}
      </div>
    </div>
  );
}

function SocialField({
  label,
  value,
  onChange,
  placeholder,
  locked,
  requiredPlan,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  locked: boolean;
  requiredPlan: PlanId;
}) {
  if (locked) {
    return (
      <div className="opacity-60">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <UpgradeBadge requiredPlan={requiredPlan} size="sm" />
        </div>
        <div className="h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center px-3">
          <span className="text-sm text-gray-400">{placeholder}</span>
        </div>
      </div>
    );
  }

  return (
    <Input label={label} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  );
}
