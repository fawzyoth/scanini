"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, size = "md", disabled }: ToggleProps) {
  const sizes = {
    sm: { track: "w-8 h-4", thumb: "h-3 w-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "h-5 w-5", translate: "translate-x-5" },
  };

  const s = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        s.track,
        enabled ? "bg-green-500" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition-transform",
          s.thumb,
          enabled ? s.translate : "translate-x-0"
        )}
      />
    </button>
  );
}
