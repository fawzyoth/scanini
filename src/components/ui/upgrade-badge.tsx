"use client";

import { Lock, Zap } from "lucide-react";
import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plan-config";

interface UpgradeBadgeProps {
  requiredPlan: PlanId;
  size?: "sm" | "md";
}

export function UpgradeBadge({ requiredPlan, size = "sm" }: UpgradeBadgeProps) {
  const planName = PLANS[requiredPlan].name;
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
    >
      <Lock size={size === "sm" ? 10 : 12} />
      {planName}
    </span>
  );
}

interface UpgradeOverlayProps {
  requiredPlan: PlanId;
  children: React.ReactNode;
}

export function UpgradeOverlay({ requiredPlan, children }: UpgradeOverlayProps) {
  const planName = PLANS[requiredPlan].name;
  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href="/billing"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <Zap size={12} />
          Passer au {planName}
        </Link>
      </div>
    </div>
  );
}
