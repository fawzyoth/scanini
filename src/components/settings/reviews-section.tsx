"use client";

import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { useDashboard } from "@/lib/dashboard-context";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { getPlan, type PlanId } from "@/lib/plan-config";
import { UpgradeOverlay } from "@/components/ui/upgrade-badge";

export function ReviewsSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(true);
  const [showReviews, setShowReviews] = useState<"rating" | "all">("all");

  const currentPlan = ((restaurant as any)?.plan ?? "free") as PlanId;
  const plan = getPlan(currentPlan);
  const locked = !plan.features.reviewsEnabled;

  useEffect(() => {
    if (restaurant) {
      setEnabled((restaurant as any).reviews_enabled ?? true);
      setShowReviews((restaurant as any).reviews_display ?? "all");
    }
  }, [restaurant]);

  async function handleToggle(value: boolean) {
    setEnabled(value);
    await updateRestaurant({ reviews_enabled: value } as any);
  }

  async function handleDisplayChange(mode: "rating" | "all") {
    setShowReviews(mode);
    await updateRestaurant({ reviews_display: mode } as any);
  }

  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{t("reviewsSection.enableReviews")}</span>
          <Badge variant={enabled ? "success" : "default"}>
            {enabled ? t("common.active") : t("common.disabled")}
          </Badge>
        </div>
        <Toggle enabled={enabled} onChange={handleToggle} />
      </div>
      <p className="text-sm text-gray-500">
        {t("reviewsSection.description")}
      </p>

      {enabled && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700">{t("reviewsSection.displayMode")}</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDisplayChange("rating")}
              className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showReviews === "rating"
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t("reviewsSection.ratingOnly")}
            </button>
            <button
              onClick={() => handleDisplayChange("all")}
              className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showReviews === "all"
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t("reviewsSection.ratingComments")}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            {showReviews === "rating"
              ? t("reviewsSection.ratingOnlyDesc")
              : t("reviewsSection.ratingCommentsDesc")}
          </p>
        </div>
      )}
    </div>
  );

  if (locked) {
    return <UpgradeOverlay requiredPlan="pro">{content}</UpgradeOverlay>;
  }

  return content;
}
