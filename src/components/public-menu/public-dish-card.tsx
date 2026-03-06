import { Dish } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PublicDishCardProps {
  dish: Dish;
}

export function PublicDishCard({ dish }: PublicDishCardProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900">{dish.name}</h4>
          {dish.allergens.length > 0 && (
            <span className="text-xs text-gray-400">
              {dish.allergens.map((a) => a.charAt(0).toUpperCase()).join(" ")}
            </span>
          )}
        </div>
        {dish.description && (
          <p className="text-xs text-gray-500 mt-0.5">{dish.description}</p>
        )}
        <p className="text-sm font-semibold text-gray-900 mt-1">
          {formatCurrency(dish.price, dish.currency)}
        </p>
      </div>
      {dish.image && (
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-200 to-orange-400 shrink-0" />
      )}
    </div>
  );
}
