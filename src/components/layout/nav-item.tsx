"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, BarChart3, QrCode, Settings } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  "utensils-crossed": UtensilsCrossed,
  "bar-chart-3": BarChart3,
  "qr-code": QrCode,
  settings: Settings,
};

interface NavItemProps {
  label: string;
  href: string;
  icon: string;
  mobile?: boolean;
}

export function NavItem({ label, href, icon, mobile }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  const Icon = iconMap[icon];

  if (mobile) {
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors min-w-[60px]",
          isActive
            ? "text-indigo-600"
            : "text-gray-400 active:text-gray-600"
        )}
      >
        {Icon && <Icon size={22} />}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors",
        isActive
          ? "text-gray-900 border-b-2 border-gray-900"
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </Link>
  );
}
