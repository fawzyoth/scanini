"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Sparkles, ArrowLeft, X, Plus, Trash2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { generateId } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface ParsedDish {
  name: string;
  description: string;
  price: number;
}

interface ParsedCategory {
  name: string;
  dishes: ParsedDish[];
}

interface ParsedMenu {
  name: string;
  categories: ParsedCategory[];
}

type Step = "upload" | "processing" | "review";

export default function DigitizePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [menu, setMenu] = useState<ParsedMenu | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<number>>(new Set());

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("digitize.imageError"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(t("digitize.sizeError"));
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setStep("processing");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/digitize", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process image");
      }

      setRawText(data.text);
      setMenu(data.menu);
      // Expand all categories by default
      setExpandedCats(new Set(data.menu.categories.map((_: ParsedCategory, i: number) => i)));
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
      setStep("upload");
    }
  }, [t]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  function toggleCategory(idx: number) {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  function updateMenuName(name: string) {
    if (!menu) return;
    setMenu({ ...menu, name });
  }

  function updateCategoryName(catIdx: number, name: string) {
    if (!menu) return;
    const cats = [...menu.categories];
    cats[catIdx] = { ...cats[catIdx], name };
    setMenu({ ...menu, categories: cats });
  }

  function updateDish(catIdx: number, dishIdx: number, field: keyof ParsedDish, value: string | number) {
    if (!menu) return;
    const cats = [...menu.categories];
    const dishes = [...cats[catIdx].dishes];
    dishes[dishIdx] = { ...dishes[dishIdx], [field]: value };
    cats[catIdx] = { ...cats[catIdx], dishes };
    setMenu({ ...menu, categories: cats });
  }

  function removeDish(catIdx: number, dishIdx: number) {
    if (!menu) return;
    const cats = [...menu.categories];
    const dishes = cats[catIdx].dishes.filter((_, i) => i !== dishIdx);
    cats[catIdx] = { ...cats[catIdx], dishes };
    setMenu({ ...menu, categories: cats });
  }

  function addDish(catIdx: number) {
    if (!menu) return;
    const cats = [...menu.categories];
    cats[catIdx] = {
      ...cats[catIdx],
      dishes: [...cats[catIdx].dishes, { name: "", description: "", price: 0 }],
    };
    setMenu({ ...menu, categories: cats });
  }

  function removeCategory(catIdx: number) {
    if (!menu) return;
    setMenu({
      ...menu,
      categories: menu.categories.filter((_, i) => i !== catIdx),
    });
  }

  function addCategory() {
    if (!menu) return;
    const newIdx = menu.categories.length;
    setMenu({
      ...menu,
      categories: [...menu.categories, { name: "New category", dishes: [] }],
    });
    setExpandedCats((prev) => new Set([...prev, newIdx]));
  }

  function handleSave() {
    if (!menu) return;

    // Build a Menu object and store in sessionStorage for the editor to pick up
    const menuData = {
      id: `menu-${Date.now()}`,
      name: menu.name,
      icon: "utensils-crossed",
      dishCount: menu.categories.reduce((sum, c) => sum + c.dishes.length, 0),
      availability: "Every day",
      visible: true,
      categories: menu.categories.map((cat) => ({
        id: generateId(),
        name: cat.name,
        dishes: cat.dishes.map((dish) => ({
          id: generateId(),
          name: dish.name,
          description: dish.description,
          price: dish.price,
          currency: "EUR",
          allergens: [],
          available: true,
        })),
      })),
    };

    sessionStorage.setItem("digitized-menu", JSON.stringify(menuData));
    router.push(`/menus/${menuData.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/menus/new")}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("digitize.title")}</h1>
          <p className="text-sm text-gray-500">{t("digitize.subtitle")}</p>
        </div>
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors p-8 sm:p-12 flex flex-col items-center text-center cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Upload size={28} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t("digitize.uploadTitle")}
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm">
            {t("digitize.uploadDesc")}
          </p>
          <Button variant="outline" size="md" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
            {t("digitize.chooseImage")}
          </Button>
          <p className="text-xs text-gray-400 mt-3">{t("digitize.imageFormats")}</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 sm:p-12 flex flex-col items-center text-center">
          {preview && (
            <div className="w-full max-w-xs mb-6 rounded-lg overflow-hidden border border-gray-200">
              <img src={preview} alt="Menu preview" className="w-full h-auto" />
            </div>
          )}
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={24} className="text-indigo-600 animate-spin" />
            <Sparkles size={20} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("digitize.analyzing")}</h3>
          <p className="text-sm text-gray-500">
            {t("digitize.analyzingDesc")}
          </p>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && menu && (
        <div className="space-y-4">
          {/* Menu name */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("digitize.menuName")}</label>
            <input
              type="text"
              value={menu.name}
              onChange={(e) => updateMenuName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Detected text (collapsible) */}
          <details className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <summary className="text-sm font-medium text-gray-600 cursor-pointer select-none">
              {t("digitize.rawText")}
            </summary>
            <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {rawText}
            </pre>
          </details>

          {/* Categories + dishes */}
          {menu.categories.map((cat, catIdx) => (
            <div key={catIdx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Category header */}
              <div className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
                <button onClick={() => toggleCategory(catIdx)} className="text-gray-400">
                  {expandedCats.has(catIdx) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                  className="flex-1 text-sm font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                />
                <span className="text-xs text-gray-400 shrink-0">
                  {cat.dishes.length} {cat.dishes.length !== 1 ? t("editor.dishesPlural") : t("editor.dish")}
                </span>
                <button
                  onClick={() => removeCategory(catIdx)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Dishes */}
              {expandedCats.has(catIdx) && (
                <div className="divide-y divide-gray-100">
                  {cat.dishes.map((dish, dishIdx) => (
                    <div key={dishIdx} className="px-4 sm:px-6 py-3 flex gap-3 items-start">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={dish.name}
                            onChange={(e) => updateDish(catIdx, dishIdx, "name", e.target.value)}
                            placeholder={t("digitize.dishName")}
                            className="flex-1 min-w-0 text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none p-0 placeholder:text-gray-300"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={dish.price || ""}
                              onChange={(e) => updateDish(catIdx, dishIdx, "price", parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                              className="w-20 text-sm text-right font-medium text-gray-900 bg-transparent border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-300"
                            />
                            <span className="text-xs text-gray-400">EUR</span>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={dish.description}
                          onChange={(e) => updateDish(catIdx, dishIdx, "description", e.target.value)}
                          placeholder={t("digitize.descriptionOptional")}
                          className="w-full text-xs text-gray-500 bg-transparent border-none focus:outline-none p-0 placeholder:text-gray-300"
                        />
                      </div>
                      <button
                        onClick={() => removeDish(catIdx, dishIdx)}
                        className="p-1 text-gray-300 hover:text-red-500 rounded shrink-0 mt-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addDish(catIdx)}
                    className="w-full flex items-center gap-2 px-4 sm:px-6 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Plus size={14} />
                    {t("digitize.addDish")}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add category */}
          <button
            onClick={addCategory}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 bg-white rounded-xl border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} />
            {t("digitize.addCategory")}
          </button>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setStep("upload");
                setMenu(null);
                setPreview(null);
              }}
              className="sm:w-auto"
            >
              {t("common.startOver")}
            </Button>
            <Button fullWidth onClick={handleSave} className="sm:w-auto sm:ml-auto">
              <Check size={16} />
              {t("digitize.createMenu")}
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <X size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:underline mt-1"
            >
              {t("common.dismiss")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
