"use client";

import { ALLERGENS, AllergenGroup } from "@/constants/dish-options";
import { TagChip } from "@/components/ui/tag-chip";
import { ChevronRight } from "lucide-react";

interface AllergenSelectorProps {
  selected: string[];
  onChange: (allergens: string[]) => void;
}

function toggle(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function AllergenGroupRow({
  group,
  selected,
  onChange,
}: {
  group: AllergenGroup;
  selected: string[];
  onChange: (allergens: string[]) => void;
}) {
  if (!group.children) {
    return (
      <TagChip
        label={group.name}
        selected={selected.includes(group.name)}
        onClick={() => onChange(toggle(selected, group.name))}
      />
    );
  }

  return null;
}

export function AllergenSelector({ selected, onChange }: AllergenSelectorProps) {
  const simpleAllergens = ALLERGENS.filter((a) => !a.children);
  const groupAllergens = ALLERGENS.filter((a) => a.children);

  return (
    <div className="space-y-4">
      {/* Simple allergens */}
      <div className="flex flex-wrap gap-2">
        {simpleAllergens.map((a) => (
          <TagChip
            key={a.name}
            label={a.name}
            selected={selected.includes(a.name)}
            onClick={() => onChange(toggle(selected, a.name))}
          />
        ))}
      </div>

      {/* Group allergens with sub-items */}
      {groupAllergens.map((group) => (
        <div key={group.name} className="border-t border-gray-200 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <TagChip
              label={group.name}
              selected={selected.includes(group.name)}
              onClick={() => onChange(toggle(selected, group.name))}
            />
            <ChevronRight size={14} className="text-gray-400" />
            {group.children!.map((child) => (
              <TagChip
                key={child}
                label={child}
                selected={selected.includes(child)}
                onClick={() => onChange(toggle(selected, child))}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
