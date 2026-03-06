"use client";

import { Dish } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { GripVertical, Edit, Trash2 } from "lucide-react";

interface DishCardProps {
  dish: Dish;
  onEdit: () => void;
  onDelete: () => void;
}

export function DishCard({ dish, onEdit, onDelete }: DishCardProps) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <button className="cursor-grab text-gray-300 hover:text-gray-500">
        <GripVertical size={16} />
      </button>

      {dish.image && (
        <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
          {dish.allergens.length > 0 && (
            <span className="text-xs text-gray-400">{dish.allergens.join(", ")}</span>
          )}
        </div>
        {dish.description && (
          <p className="text-xs text-gray-500 truncate">{dish.description}</p>
        )}
      </div>

      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
        {formatCurrency(dish.price, dish.currency)}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
