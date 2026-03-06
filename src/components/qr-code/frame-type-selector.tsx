"use client";

import { cn } from "@/lib/utils";
import { QRSettings } from "@/types";

interface FrameTypeSelectorProps {
  value: QRSettings["frameType"];
  onChange: (value: QRSettings["frameType"]) => void;
}

const options: { value: QRSettings["frameType"]; label: string; preview: React.ReactNode }[] = [
  {
    value: "bottom",
    label: "Bottom",
    preview: (
      <div className="w-12 h-14 border-2 border-gray-400 rounded-sm flex flex-col">
        <div className="flex-1" />
        <div className="h-3 bg-gray-400" />
      </div>
    ),
  },
  {
    value: "top",
    label: "Top",
    preview: (
      <div className="w-12 h-14 border-2 border-gray-400 rounded-sm flex flex-col">
        <div className="h-3 bg-gray-400" />
        <div className="flex-1" />
      </div>
    ),
  },
  {
    value: "none",
    label: "None",
    preview: (
      <div className="w-12 h-14 flex items-center justify-center text-gray-400 text-xl font-light">
        X
      </div>
    ),
  },
];

export function FrameTypeSelector({ value, onChange }: FrameTypeSelectorProps) {
  return (
    <div className="flex gap-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors",
            value === opt.value
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          {opt.preview}
          <span className="text-xs font-medium text-gray-600">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
