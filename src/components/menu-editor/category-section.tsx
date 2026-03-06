"use client";

import { useState } from "react";
import { Category } from "@/types";
import { DishCard } from "./dish-card";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui";
import { MoreVertical, Edit, Trash2, UtensilsCrossed } from "lucide-react";

interface CategorySectionProps {
  category: Category;
  onEditDish: (dishId: string) => void;
  onDeleteDish: (dishId: string) => void;
  onDeleteCategory: () => void;
  onEditCategory: () => void;
}

export function CategorySection({
  category,
  onEditDish,
  onDeleteDish,
  onDeleteCategory,
  onEditCategory,
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
            <EmptyState
              icon={<UtensilsCrossed size={40} className="text-blue-400" />}
              title="Dishes in this category will appear here."
            />
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
