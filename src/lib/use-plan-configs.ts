"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLANS, PLAN_ORDER, dbRowToPlanInfo, type PlanInfo, type PlanId } from "@/lib/plan-config";

// Fetches plan configs from Supabase, falls back to hardcoded defaults
export function usePlanConfigs() {
  const [plans, setPlans] = useState<Record<PlanId, PlanInfo>>(PLANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("plan_configs")
          .select("*")
          .order("monthly_price", { ascending: true });

        if (data && data.length > 0) {
          const mapped: Record<string, PlanInfo> = {};
          for (const row of data as any[]) {
            mapped[row.id] = dbRowToPlanInfo(row);
          }
          setPlans({ ...PLANS, ...mapped } as Record<PlanId, PlanInfo>);
        }
      } catch {
        // Use hardcoded fallback
      }
      setLoading(false);
    }
    load();
  }, []);

  const orderedPlans = PLAN_ORDER.map((id) => plans[id]);

  return { plans, orderedPlans, loading };
}
