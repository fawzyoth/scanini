"use client";

import Link from "next/link";
import { Menu } from "@/types";
import { Toggle } from "@/components/ui";
import { Dropdown } from "@/components/ui/dropdown";
import { MoreVertical, Copy, Edit, Calendar, Image, ArrowDown, Pencil, Trash2 } from "lucide-react";
import { MenuIcon } from "./menu-icon";

interface MenuCardProps {
  menu: Menu;
  isLast: boolean;
  onToggleVisibility: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onAdjustAvailability: (id: string) => void;
  onChangeIcon: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MenuCard({
  menu, isLast, onToggleVisibility, onDuplicate,
  onRename, onAdjustAvailability, onChangeIcon, onMoveDown, onEdit, onDelete,
}: MenuCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/menus/${menu.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <MenuIcon name={menu.icon} size={18} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {menu.name}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {menu.dishCount} dishes · {menu.availability}
            </p>
          </div>
        </Link>

        <Dropdown
          trigger={
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 shrink-0">
              <MoreVertical size={18} />
            </button>
          }
          items={[
            { label: "Edit menu", icon: <Pencil size={16} />, onClick: () => onEdit(menu.id) },
            { label: "Adjust availability", icon: <Calendar size={16} />, onClick: () => onAdjustAvailability(menu.id) },
            { label: "Rename", icon: <Edit size={16} />, onClick: () => onRename(menu.id) },
            { label: "Change icon", icon: <Image size={16} />, onClick: () => onChangeIcon(menu.id) },
            { label: "Duplicate", icon: <Copy size={16} />, onClick: () => onDuplicate(menu.id) },
            ...(!isLast ? [{ label: "Move down", icon: <ArrowDown size={16} />, onClick: () => onMoveDown(menu.id) }] : []),
            { label: "Delete menu", icon: <Trash2 size={16} />, onClick: () => onDelete(menu.id), danger: true, separator: true },
          ]}
        />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">Visible</span>
        <Toggle enabled={menu.visible} onChange={() => onToggleVisibility(menu.id)} />
      </div>
    </div>
  );
}
