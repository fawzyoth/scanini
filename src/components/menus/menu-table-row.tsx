"use client";

import Link from "next/link";
import { Menu } from "@/types";
import { Toggle } from "@/components/ui";
import { Dropdown } from "@/components/ui/dropdown";
import { MoreVertical, Copy, Edit, Calendar, Image, ArrowDown, Pencil, Trash2 } from "lucide-react";
import { MenuIcon } from "./menu-icon";

interface MenuTableRowProps {
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

export function MenuTableRow({
  menu, isLast, onToggleVisibility, onDuplicate,
  onRename, onAdjustAvailability, onChangeIcon, onMoveDown, onEdit, onDelete,
}: MenuTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <Link href={`/menus/${menu.id}`} className="flex items-center gap-3 group">
          <MenuIcon name={menu.icon} size={18} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
            {menu.name}
          </span>
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{menu.dishCount}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{menu.availability}</td>
      <td className="px-6 py-4">
        <Toggle enabled={menu.visible} onChange={() => onToggleVisibility(menu.id)} />
      </td>
      <td className="px-6 py-4">
        <Dropdown
          trigger={
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
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
      </td>
    </tr>
  );
}
