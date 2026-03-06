"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PageHeader, Select } from "@/components/ui";
import { KpiCards, VisitsChart, ReviewsSummary, RatingDistribution, ReviewsList } from "@/components/stats";
import { useDashboard } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/client";
import { VisitData } from "@/types";
import { useTranslation } from "@/lib/i18n/i18n-context";

const PERIOD_DAYS: Record<string, number> = {
  last_week: 7,
  last_month: 30,
  last_3_months: 90,
  last_year: 365,
};

export default function StatsPage() {
  const { reviews, restaurant, menus, usage, loading } = useDashboard();
  const { t } = useTranslation();
  const [period, setPeriod] = useState("last_week");
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [totalScans, setTotalScans] = useState(0);

  const PERIOD_OPTIONS = [
    { value: "last_week", label: t("stats.lastWeek") },
    { value: "last_month", label: t("stats.lastMonth") },
    { value: "last_3_months", label: t("stats.last3Months") },
    { value: "last_year", label: t("stats.lastYear") },
  ];

  useEffect(() => {
    if (!restaurant) return;
    async function loadScans() {
      const supabase = createClient();
      const days = PERIOD_DAYS[period] ?? 7;
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data } = await supabase
        .from("scans")
        .select("scanned_at, period")
        .eq("restaurant_id", restaurant!.id)
        .gte("scanned_at", since.toISOString())
        .order("scanned_at");

      const scans = (data ?? []) as { scanned_at: string; period: string }[];
      setTotalScans(scans.length);

      // Group by date
      const byDate = new Map<string, { mornings: number; afternoons: number }>();
      for (const s of scans) {
        const date = new Date(s.scanned_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const entry = byDate.get(date) ?? { mornings: 0, afternoons: 0 };
        if (s.period === "morning") entry.mornings++;
        else entry.afternoons++;
        byDate.set(date, entry);
      }

      setVisits(
        Array.from(byDate.entries()).map(([date, counts]) => ({
          date,
          ...counts,
        }))
      );
    }
    loadScans();
  }, [restaurant, period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const totalDishes = menus.reduce((sum, m) => sum + m.dishCount, 0);

  return (
    <>
      <PageHeader title={t("stats.title")}>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          options={PERIOD_OPTIONS}
        />
      </PageHeader>

      <div className="space-y-6">
        {/* KPI Cards */}
        <KpiCards
          totalScans={totalScans}
          totalReviews={reviews.length}
          avgRating={avgRating}
          totalMenus={menus.length}
          totalDishes={totalDishes}
        />

        {/* Visits Chart */}
        <VisitsChart data={visits} />

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReviewsSummary reviews={reviews} />
          <RatingDistribution reviews={reviews} />
        </div>

        {/* Individual Reviews */}
        <ReviewsList reviews={reviews} />
      </div>
    </>
  );
}
