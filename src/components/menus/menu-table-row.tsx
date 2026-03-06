"use client";

import Link from "next/link";
import { Menu } from "@/types";
import { Toggle } from "@/components/ui";
import { Dropdown } from "@/components/ui/dropdown";
import { MoreVertical, Copy, Edit, Calendar, Image, ArrowDown, Pencil, Trash2, GripVertical } from "lucide-react";
import { MenuIcon } from "./menu-icon";
import { DragProps } from "@/lib/use-drag-reorder";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface MenuTableRowProps {
  menu: Menu;
  isLast: boolean;
  dragProps: DragProps;
  dragStyle: string;
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
  menu, isLast, dragProps, dragStyle, onToggleVisibility, onDuplicate,
  onRename, onAdjustAvailability, onChangeIcon, onMoveDown, onEdit, onDelete,
}: MenuTableRowProps) {
  const { t } = useTranslation();
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${dragStyle}`} {...dragProps}>
      <td className="px-2 py-4">
        <button className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1">
          <GripVertical size={16} />
        </button>
      </td>
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
            { label: t("menus.editMenu"), icon: <Pencil size={16} />, onClick: () => onEdit(menu.id) },
            { label: t("menus.adjustAvailability"), icon: <Calendar size={16} />, onClick: () => onAdjustAvailability(menu.id) },
            { label: t("menus.rename"), icon: <Edit size={16} />, onClick: () => onRename(menu.id) },
            { label: t("menus.changeIcon"), icon: <Image size={16} />, onClick: () => onChangeIcon(menu.id) },
            { label: t("menus.duplicate"), icon: <Copy size={16} />, onClick: () => onDuplicate(menu.id) },
            ...(!isLast ? [{ label: t("menus.moveDown"), icon: <ArrowDown size={16} />, onClick: () => onMoveDown(menu.id) }] : []),
            { label: t("menus.deleteMenu"), icon: <Trash2 size={16} />, onClick: () => onDelete(menu.id), danger: true, separator: true },
          ]}
        />
      </td>
    </tr>
  );
}
