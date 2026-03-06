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
import { Menu, Dish } from "@/types";

export default function MenuEditorPage() {
  const { id } = useParams();
  const router = useRouter();
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
    if (!confirm("Are you sure you want to delete this menu? This will also delete all categories and dishes in it.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("menus").delete().eq("id", menu.id);
    await reload();
    router.push("/menus");
  }

  const filteredCategories = menu.categories.map((cat) => ({
    ...cat,
    dishes: search
      ? cat.dishes.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
      : cat.dishes,
  }));

  const totalDishes = menu.categories.reduce((sum, c) => sum + c.dishes.length, 0);

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/menus" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} />
          My menus
        </Link>
        <div className="flex items-center gap-3">
          {!isNewMenu && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            Delete
          </Button>
          <Link href="/menus">
            <Button size="md">
              <Check size={16} />
              Done
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Menu name — editable */}
        <div className="flex items-center gap-3 mb-2">
          <UtensilsCrossed size={24} className="text-gray-400" />
          {editingName ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveMenuName();
                  if (e.key === "Escape") { setEditingName(false); setMenuName(menu.name); }
                }}
                className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent flex-1"
              />
              <button onClick={handleSaveMenuName} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                <Check size={18} />
              </button>
              <button onClick={() => { setEditingName(false); setMenuName(menu.name); }} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditingName(true)}>
              <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
              <Pencil size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          )}
        </div>

        {/* Stats bar */}
        <p className="text-sm text-gray-400 mb-8 ml-9">
          {menu.categories.length} {menu.categories.length === 1 ? "category" : "categories"} · {totalDishes} {totalDishes === 1 ? "dish" : "dishes"}
        </p>

        {/* ── GUIDED SETUP for new/empty menus ── */}
        {isNewMenu && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Let's build your menu</h2>
            <p className="text-sm text-gray-500 mb-5">Start by adding a category (e.g. Starters, Main Dishes, Desserts), then add dishes to it.</p>

            {/* Quick category suggestions */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick add a category</p>
              <div className="flex flex-wrap gap-2">
                {["Starters", "Main Dishes", "Desserts", "Drinks", "Salads", "Pizzas", "Burgers", "Sandwiches", "Soups", "Sides"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleQuickAddCategory(cat)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors shadow-sm"
                  >
                    <Plus size={14} />
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <Button variant="outline" onClick={() => setCategoryModal({ open: true })}>
                <FolderPlus size={16} />
                Custom category name
              </Button>
            </div>
          </div>
        )}

        {/* ── CATEGORIES WITH DISHES ── */}
        {!isNewMenu && (
          <>
            {filteredCategories.map((category) => (
              <div key={category.id} className="mb-2">
                <CategorySection
                  category={category}
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
                />
              </div>
            ))}

            {/* Add more categories */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Add category</p>
              <div className="flex flex-wrap gap-2">
                {["Starters", "Main Dishes", "Desserts", "Drinks", "Salads", "Pizzas", "Burgers", "Sandwiches", "Soups", "Sides"]
                  .filter((cat) => !menu.categories.some((c) => c.name === cat))
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleQuickAddCategory(cat)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      <Plus size={12} />
                      {cat}
                    </button>
                  ))}
                <button
                  onClick={() => setCategoryModal({ open: true })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  <FolderPlus size={12} />
                  Custom
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
