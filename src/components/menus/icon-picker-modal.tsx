"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "@/components/ui";
import {
  UtensilsCrossed, Coffee, Wine, Pizza, Cake, IceCream, Soup, Salad,
  Beef, Fish, Egg, Sandwich, Cookie, Cherry, Apple, Grape, Carrot, Wheat,
  Beer, CupSoda, Martini, GlassWater,
} from "lucide-react";

const ICONS = [
  { name: "utensils-crossed", Icon: UtensilsCrossed },
  { name: "coffee", Icon: Coffee },
  { name: "wine", Icon: Wine },
  { name: "pizza", Icon: Pizza },
  { name: "cake", Icon: Cake },
  { name: "ice-cream", Icon: IceCream },
  { name: "soup", Icon: Soup },
  { name: "salad", Icon: Salad },
  { name: "beef", Icon: Beef },
  { name: "fish", Icon: Fish },
  { name: "egg", Icon: Egg },
  { name: "sandwich", Icon: Sandwich },
  { name: "cookie", Icon: Cookie },
  { name: "cherry", Icon: Cherry },
  { name: "apple", Icon: Apple },
  { name: "grape", Icon: Grape },
  { name: "carrot", Icon: Carrot },
  { name: "wheat", Icon: Wheat },
  { name: "beer", Icon: Beer },
  { name: "cup-soda", Icon: CupSoda },
  { name: "martini", Icon: Martini },
  { name: "glass-water", Icon: GlassWater },
];

interface IconPickerModalProps {
  open: boolean;
  onClose: () => void;
  currentIcon: string;
  onSelect: (icon: string) => void;
}

export function IconPickerModal({ open, onClose, currentIcon, onSelect }: IconPickerModalProps) {
  const [selected, setSelected] = useState(currentIcon);

  useEffect(() => {
    if (open) setSelected(currentIcon);
  }, [open, currentIcon]);

  function handleSave() {
    onSelect(selected);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose an icon" size="sm">
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map(({ name, Icon }) => (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`w-full aspect-square flex items-center justify-center rounded-lg border-2 transition-colors ${
                selected === name
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon size={22} />
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
