"use client";

import { useState } from "react";
import { Category } from "@/types";
import { DishCard } from "./dish-card";
import { Dropdown } from "@/components/ui/dropdown";
import { MoreVertical, Edit, Trash2, UtensilsCrossed, Plus } from "lucide-react";

interface CategorySectionProps {
  category: Category;
  onEditDish: (dishId: string) => void;
  onDeleteDish: (dishId: string) => void;
  onDeleteCategory: () => void;
  onEditCategory: () => void;
  onAddDish: () => void;
}

export function CategorySection({
  category,
  onEditDish,
  onDeleteDish,
  onDeleteCategory,
  onEditCategory,
  onAddDish,
}: CategorySectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-sm font-medium text-gray-500">{category.name}</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <Dropdown
          trigger={
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical size={16} />
            </button>
          }
          items={[
            { label: "Edit category", icon: <Edit size={14} />, onClick: onEditCategory },
            { label: "Delete category", icon: <Trash2 size={14} />, onClick: onDeleteCategory, danger: true },
          ]}
        />
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {!collapsed && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {category.dishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <UtensilsCrossed size={32} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 mb-3">No dishes yet</p>
              <button
                onClick={onAddDish}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={14} />
                Add first dish
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {category.dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onEdit={() => onEditDish(dish.id)}
                    onDelete={() => onDeleteDish(dish.id)}
                  />
                ))}
              </div>
              <button
                onClick={onAddDish}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm text-indigo-600 font-medium hover:bg-indigo-50 transition-colors border-t border-gray-100 rounded-b-xl"
              >
                <Plus size={14} />
                Add dish
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
