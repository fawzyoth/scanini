"use client";

import { useState } from "react";
import { Category, Dish } from "@/types";
import { DishCard } from "./dish-card";
import { Dropdown } from "@/components/ui/dropdown";
import { MoreVertical, Edit, Trash2, UtensilsCrossed, Plus, GripVertical } from "lucide-react";
import { useDragReorder, DragProps } from "@/lib/use-drag-reorder";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface CategorySectionProps {
  category: Category;
  categoryDragProps?: DragProps;
  categoryDragStyle?: string;
  onEditDish: (dishId: string) => void;
  onDeleteDish: (dishId: string) => void;
  onDeleteCategory: () => void;
  onEditCategory: () => void;
  onAddDish: () => void;
  onReorderDishes?: (categoryId: string, reordered: Dish[]) => void;
}

export function CategorySection({
  category,
  categoryDragProps,
  categoryDragStyle,
  onEditDish,
  onDeleteDish,
  onDeleteCategory,
  onEditCategory,
  onAddDish,
  onReorderDishes,
}: CategorySectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const { getDragProps: getDishDragProps, getItemStyle: getDishStyle } = useDragReorder({
    items: category.dishes,
    getId: (d) => d.id,
    onReorder: (reordered) => onReorderDishes?.(category.id, reordered),
  });

  return (
    <div className={`mb-6 ${categoryDragStyle ?? ""}`} {...(categoryDragProps ?? {})}>
      <div className="flex items-center gap-2 sm:gap-3 mb-3">
        {categoryDragProps && (
          <button className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 shrink-0 hidden sm:block">
            <GripVertical size={16} />
          </button>
        )}
        <div className="flex-1 border-t border-gray-200 hidden sm:block" />
        <span className="text-sm font-medium text-gray-500 truncate">{category.name || t("editor.general")}</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 shrink-0"
        >
          {collapsed ? t("editor.expand") : t("editor.collapse")}
        </button>
        <Dropdown
          trigger={
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded shrink-0">
              <MoreVertical size={16} />
            </button>
          }
          items={[
            { label: t("editor.editCategory"), icon: <Edit size={14} />, onClick: onEditCategory },
            { label: t("editor.deleteCategory"), icon: <Trash2 size={14} />, onClick: onDeleteCategory, danger: true },
          ]}
        />
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {!collapsed && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {category.dishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <UtensilsCrossed size={32} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 mb-3">{t("editor.noDishesYet")}</p>
              <button
                onClick={onAddDish}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={14} />
                {t("editor.addFirstDish")}
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
                    dragProps={getDishDragProps(dish.id)}
                    dragStyle={getDishStyle(dish.id)}
                  />
                ))}
              </div>
              <button
                onClick={onAddDish}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm text-indigo-600 font-medium hover:bg-indigo-50 transition-colors border-t border-gray-100 rounded-b-xl"
              >
                <Plus size={14} />
                {t("editor.addDish")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
