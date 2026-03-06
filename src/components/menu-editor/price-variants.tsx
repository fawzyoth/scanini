"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export interface Variant {
  label: string;
  price: string;
}

const DEFAULT_VARIANTS: Variant[] = [
  { label: "Small", price: "" },
  { label: "Medium", price: "" },
  { label: "Large", price: "" },
  { label: "Extra large", price: "" },
];

interface PriceVariantsProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export function PriceVariants({ variants, onChange }: PriceVariantsProps) {
  function updateVariant(index: number, field: keyof Variant, value: string) {
    const updated = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(updated);
  }

  function removeVariant(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }

  function addVariant() {
    onChange([...variants, { label: "", price: "" }]);
  }

  return (
    <div className="space-y-2">
      {variants.map((variant, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <input
            type="text"
            value={variant.label}
            onChange={(e) => updateVariant(i, "label", e.target.value)}
            placeholder="Variant name"
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={variant.price}
              onChange={(e) => updateVariant(i, "price", e.target.value)}
              placeholder=""
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 border-l border-gray-300 bg-gray-50 rounded-r-lg">
              <span className="text-sm text-gray-500 font-medium">&euro;</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeVariant(i)}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addVariant}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
      >
        <Plus size={14} />
        Add variant
      </button>
    </div>
  );
}

export { DEFAULT_VARIANTS };
