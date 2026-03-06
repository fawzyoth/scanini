"use client";

import { useState, useEffect } from "react";
import { Dish } from "@/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/ui/tag-chip";
import { ImageUpload } from "@/components/ui/image-upload";
import { AllergenSelector } from "./allergen-selector";
import { PriceVariants, DEFAULT_VARIANTS, type Variant } from "./price-variants";
import { TAGS } from "@/constants/dish-options";
import { generateId } from "@/lib/utils";

interface DishFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (dish: Dish) => void;
  dish?: Dish;
}

export function DishFormModal({ open, onClose, onSave, dish }: DishFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [useVariants, setUseVariants] = useState(false);
  const [variants, setVariants] = useState<Variant[]>(DEFAULT_VARIANTS);

  useEffect(() => {
    if (open) {
      setName(dish?.name ?? "");
      setDescription(dish?.description ?? "");
      setPrice(dish?.price?.toString() ?? "");
      setImage(dish?.image);
      setAllergens(dish?.allergens ?? []);
      setTags([]);
      setUseVariants(false);
      setVariants(DEFAULT_VARIANTS);
    }
  }, [open, dish]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: dish?.id ?? generateId(),
      name,
      description,
      price: parseFloat(price) || 0,
      currency: "EUR",
      image,
      allergens,
      available: true,
    });
    onClose();
  }

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <Modal open={open} onClose={onClose} title={dish ? "Edit dish" : "New dish"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Image row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <ImageUpload value={image} onChange={setImage} />
        </div>

        {/* Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-base font-semibold text-gray-900">Price</label>
            <button
              type="button"
              onClick={() => setUseVariants(!useVariants)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {useVariants ? "Change to single price" : "Add variants"}
            </button>
          </div>

          {useVariants ? (
            <PriceVariants variants={variants} onChange={setVariants} />
          ) : (
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-3 border-l border-gray-300 bg-gray-50 rounded-r-lg">
                <span className="text-sm text-gray-500 font-medium">&euro;</span>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">Tags</label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                selected={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-3">Allergens</label>
          <AllergenSelector selected={allergens} onChange={setAllergens} />
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
