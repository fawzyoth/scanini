"use client";

import { Dish } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { GripVertical, Edit, Trash2 } from "lucide-react";
import { DragProps } from "@/lib/use-drag-reorder";

interface DishCardProps {
  dish: Dish;
  onEdit: () => void;
  onDelete: () => void;
  dragProps?: DragProps;
  dragStyle?: string;
}

export function DishCard({ dish, onEdit, onDelete, dragProps, dragStyle }: DishCardProps) {
  return (
    <div className={`group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors ${dragStyle ?? ""}`} {...(dragProps ?? {})}>
      <button className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 hidden sm:block">
        <GripVertical size={16} />
      </button>

      {dish.image && (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 shrink-0 overflow-hidden">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
          {dish.allergens.length > 0 && (
            <span className="text-xs text-gray-400 hidden sm:inline">{dish.allergens.join(", ")}</span>
          )}
        </div>
        {dish.description && (
          <p className="text-xs text-gray-500 truncate">{dish.description}</p>
        )}
      </div>

      {dish.variants && dish.variants.length > 0 ? (
        <div className="text-right shrink-0">
          {dish.variants.map((v, i) => (
            <div key={i} className="text-xs text-gray-600 whitespace-nowrap">
              <span className="text-gray-400 hidden sm:inline">{v.label}: </span>
              <span className="font-medium text-gray-900">{formatCurrency(v.price, dish.currency)}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-sm font-medium text-gray-900 whitespace-nowrap shrink-0">
          {formatCurrency(dish.price, dish.currency)}
        </span>
      )}

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <Edit size={14} />
        </button>
        <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 rounded">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
