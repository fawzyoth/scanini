"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Search, UtensilsCrossed, FolderPlus, Loader2,
  Pencil, Check, X, Plus, Trash2
} from "lucide-react";
import { Button } from "@/components/ui";
import { CategorySection, DishFormModal, CategoryFormModal } from "@/components/menu-editor";
import { useDashboard } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/client";
import { useDragReorder } from "@/lib/use-drag-reorder";
import { Menu, Dish, Category } from "@/types";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function MenuEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { menus, loading, reload } = useDashboard();
  const [deleting, setDeleting] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [search, setSearch] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [dishModal, setDishModal] = useState<{ open: boolean; categoryId: string; dish?: Dish }>({
    open: false,
    categoryId: "",
  });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; categoryId?: string }>({
    open: false,
  });

  async function handleReorderCategories(reordered: Category[]) {
    setMenu((prev) => prev ? { ...prev, categories: reordered } : prev);
    const supabase = createClient();
    const updates = reordered.map((c, i) =>
      (supabase.from("categories") as any).update({ sort_order: i }).eq("id", c.id)
    );
    await Promise.all(updates);
  }

  const { getDragProps: getCategoryDragProps, getItemStyle: getCategoryStyle } = useDragReorder({
    items: menu?.categories ?? [],
    getId: (c) => c.id,
    onReorder: handleReorderCategories,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("digitized-menu");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.id === id) {
            sessionStorage.removeItem("digitized-menu");
            setMenu(parsed as Menu);
            setMenuName(parsed.name);
            return;
          }
        } catch { /* ignore */ }
      }
    }

    const found = menus.find((m) => m.id === id);
    if (found) {
      setMenu(found);
      setMenuName(found.name);
      return;
    }

    if (!loading && !found && id) {
      reload();
    }
  }, [menus, id, loading, reload]);

  if (loading || !menu) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const isNewMenu = menu.categories.length === 0;

  async function handleSaveMenuName() {
    if (!menu || !menuName.trim()) return;
    const supabase = createClient();
    await (supabase.from("menus") as any).update({ name: menuName.trim() }).eq("id", menu.id);
    setMenu((prev) => prev ? { ...prev, name: menuName.trim() } : prev);
    setEditingName(false);
    await reload();
  }

  async function handleSaveDish(dish: Dish) {
    if (!menu) return;
    const supabase = createClient();
    const existing = menu.categories
      .flatMap((c) => c.dishes)
      .find((d) => d.id === dish.id);

    if (existing) {
      await (supabase.from("dishes") as any).update({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        currency: dish.currency,
        image_url: dish.image ?? null,
        allergens: dish.allergens,
        available: dish.available,
        variants: dish.variants ?? null,
      }).eq("id", dish.id);
    } else {
      await (supabase.from("dishes") as any).insert({
        category_id: dishModal.categoryId,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        currency: dish.currency,
        image_url: dish.image ?? null,
        allergens: dish.allergens,
        available: dish.available,
        variants: dish.variants ?? null,
        sort_order: 0,
      });
    }

    await reload();
  }

  async function handleDeleteDish(categoryId: string, dishId: string) {
    const supabase = createClient();
    await supabase.from("dishes").delete().eq("id", dishId);
    setMenu((prev) => prev ? ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, dishes: cat.dishes.filter((d) => d.id !== dishId) }
          : cat
      ),
    }) : prev);
  }

  async function handleAddCategory(name: string) {
    if (!menu) return;
    const supabase = createClient();

    if (categoryModal.categoryId) {
      await (supabase.from("categories") as any).update({ name }).eq("id", categoryModal.categoryId);
      setMenu((prev) => prev ? ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryModal.categoryId ? { ...cat, name } : cat
        ),
      }) : prev);
    } else {
      await (supabase.from("categories") as any).insert({
        menu_id: menu.id,
        name,
        sort_order: menu.categories.length,
      });
      await reload();
    }
  }

  async function handleQuickAddCategory(name: string) {
    if (!menu) return;
    const supabase = createClient();
    await (supabase.from("categories") as any).insert({
      menu_id: menu.id,
      name,
      sort_order: menu.categories.length,
    });
    await reload();
  }

  async function handleDeleteCategory(categoryId: string) {
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", categoryId);
    setMenu((prev) => prev ? ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }) : prev);
  }

  async function handleDeleteMenu() {
    if (!menu || deleting) return;
    if (!confirm(t("editor.confirmDeleteMenu"))) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("menus").delete().eq("id", menu.id);
    await reload();
    router.push("/menus");
  }

  async function handleReorderDishes(categoryId: string, reordered: Dish[]) {
    setMenu((prev) => prev ? {
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, dishes: reordered } : cat
      ),
    } : prev);
    const supabase = createClient();
    const updates = reordered.map((d, i) =>
      (supabase.from("dishes") as any).update({ sort_order: i }).eq("id", d.id)
    );
    await Promise.all(updates);
  }

  const filteredCategories = menu.categories.map((cat) => ({
    ...cat,
    dishes: search
      ? cat.dishes.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
      : cat.dishes,
  }));

  const totalDishes = menu.categories.reduce((sum, c) => sum + c.dishes.length, 0);

  const categoryNames: Record<string, string> = {
    "Starters": t("editor.starters"),
    "Main Dishes": t("editor.mainDishes"),
    "Desserts": t("editor.desserts"),
    "Drinks": t("editor.drinks"),
    "Salads": t("editor.salads"),
    "Pizzas": t("editor.pizzas"),
    "Burgers": t("editor.burgers"),
    "Sandwiches": t("editor.sandwiches"),
    "Soups": t("editor.soups"),
    "Sides": t("editor.sides"),
  };

  return (
    <>
      {/* Top bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/menus" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} />
            {t("editor.myMenus")}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {!isNewMenu && (
              <div className="relative hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("editor.searchDishes")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                />
              </div>
            )}
            <Button
              variant="outline"
              size="md"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleDeleteMenu}
              disabled={deleting}
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">{t("editor.delete")}</span>
            </Button>
            <Link href="/menus">
              <Button size="md">
                <Check size={16} />
                <span className="hidden sm:inline">{t("editor.done")}</span>
              </Button>
            </Link>
          </div>
        </div>
        {!isNewMenu && (
          <div className="relative sm:hidden">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("editor.searchDishes")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Menu name -- editable */}
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <UtensilsCrossed size={20} className="text-gray-400 shrink-0 sm:w-6 sm:h-6" />
          {editingName ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveMenuName();
                  if (e.key === "Escape") { setEditingName(false); setMenuName(menu.name); }
                }}
                className="text-xl sm:text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent flex-1 min-w-0"
              />
              <button onClick={handleSaveMenuName} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg shrink-0">
                <Check size={18} />
              </button>
              <button onClick={() => { setEditingName(false); setMenuName(menu.name); }} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg shrink-0">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer min-w-0" onClick={() => setEditingName(true)}>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{menu.name}</h1>
              <Pencil size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </div>
          )}
        </div>

        {/* Stats bar */}
        <p className="text-sm text-gray-400 mb-8 ml-9">
          {menu.categories.length} {menu.categories.length === 1 ? t("editor.category") : t("editor.categories")} · {totalDishes} {totalDishes === 1 ? t("editor.dish") : t("editor.dishesPlural")}
        </p>

        {/* -- GUIDED SETUP for new/empty menus -- */}
        {isNewMenu && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-4 sm:p-6 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{t("editor.letsBuiltMenu")}</h2>
            <p className="text-sm text-gray-500 mb-4 sm:mb-5">{t("editor.startByAdding")}</p>

            {/* Quick category suggestions */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t("editor.quickAddCategory")}</p>
              <div className="flex flex-wrap gap-2">
                {(["Starters", "Main Dishes", "Desserts", "Drinks", "Salads", "Pizzas", "Burgers", "Sandwiches", "Soups", "Sides"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleQuickAddCategory(categoryNames[cat])}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-sm"
                  >
                    <Plus size={14} />
                    {categoryNames[cat]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">{t("common.or")}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <Button variant="outline" onClick={() => setCategoryModal({ open: true })}>
                <FolderPlus size={16} />
                {t("editor.customCategoryName")}
              </Button>
            </div>
          </div>
        )}

        {/* -- CATEGORIES WITH DISHES -- */}
        {!isNewMenu && (
          <>
            {filteredCategories.map((category) => (
              <div key={category.id} className="mb-2">
                <CategorySection
                  category={category}
                  categoryDragProps={getCategoryDragProps(category.id)}
                  categoryDragStyle={getCategoryStyle(category.id)}
                  onEditDish={(dishId) => {
                    const dish = category.dishes.find((d) => d.id === dishId);
                    setDishModal({ open: true, categoryId: category.id, dish });
                  }}
                  onDeleteDish={(dishId) => handleDeleteDish(category.id, dishId)}
                  onEditCategory={() =>
                    setCategoryModal({ open: true, categoryId: category.id })
                  }
                  onDeleteCategory={() => handleDeleteCategory(category.id)}
                  onAddDish={() => setDishModal({ open: true, categoryId: category.id })}
                  onReorderDishes={handleReorderDishes}
                />
              </div>
            ))}

            {/* Add more categories */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t("editor.addCategory")}</p>
              <div className="flex flex-wrap gap-2">
                {(["Starters", "Main Dishes", "Desserts", "Drinks", "Salads", "Pizzas", "Burgers", "Sandwiches", "Soups", "Sides"] as const)
                  .filter((cat) => !menu.categories.some((c) => c.name === categoryNames[cat]))
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleQuickAddCategory(categoryNames[cat])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      <Plus size={12} />
                      {categoryNames[cat]}
                    </button>
                  ))}
                <button
                  onClick={() => setCategoryModal({ open: true })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  <FolderPlus size={12} />
                  {t("editor.custom")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <DishFormModal
        open={dishModal.open}
        onClose={() => setDishModal({ open: false, categoryId: "" })}
        onSave={handleSaveDish}
        dish={dishModal.dish}
      />
      <CategoryFormModal
        open={categoryModal.open}
        onClose={() => setCategoryModal({ open: false })}
        onSave={handleAddCategory}
        initialName={
          categoryModal.categoryId
            ? menu.categories.find((c) => c.id === categoryModal.categoryId)?.name
            : undefined
        }
      />
    </>
  );
}
