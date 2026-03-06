import { Category } from "@/types";
import { PublicDishCard } from "./public-dish-card";

interface PublicCategorySectionProps {
  category: Category;
}

export function PublicCategorySection({ category }: PublicCategorySectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
        {category.name}
      </h3>
      <div className="divide-y divide-gray-100">
        {category.dishes
          .filter((d) => d.available)
          .map((dish) => (
            <PublicDishCard key={dish.id} dish={dish} />
          ))}
      </div>
    </div>
  );
}
