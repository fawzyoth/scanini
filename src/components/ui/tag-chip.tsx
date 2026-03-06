"use client";

import { cn } from "@/lib/utils";

interface TagChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function TagChip({ label, selected, onClick }: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 text-sm rounded-full border transition-colors",
        selected
          ? "bg-indigo-100 text-indigo-700 border-indigo-300"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      )}
    >
      {label}
    </button>
  );
}
