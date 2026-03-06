"use client";

import { Menu } from "@/types";
import { MenuTableRow } from "./menu-table-row";
import { MenuCard } from "./menu-card";
import { useDragReorder } from "@/lib/use-drag-reorder";
import { useTranslation } from "@/lib/i18n/i18n-context";

export interface MenuActionHandlers {
  onToggleVisibility: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onAdjustAvailability: (id: string) => void;
  onChangeIcon: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (reordered: Menu[]) => void;
}

interface MenuTableProps extends MenuActionHandlers {
  menus: Menu[];
}

export function MenuTable({ menus, onReorder, ...handlers }: MenuTableProps) {
  const { t } = useTranslation();
  const { getDragProps, getItemStyle } = useDragReorder({
    items: menus,
    getId: (m) => m.id,
    onReorder: (reordered) => onReorder?.(reordered),
  });

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 w-8"></th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("menus.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("menus.dishes")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("menus.availability")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("menus.visibility")}
              </th>
              <th className="px-6 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.map((menu, index) => (
              <MenuTableRow
                key={menu.id}
                menu={menu}
                isLast={index === menus.length - 1}
                dragProps={getDragProps(menu.id)}
                dragStyle={getItemStyle(menu.id)}
                {...handlers}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {menus.map((menu, index) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            isLast={index === menus.length - 1}
            dragProps={getDragProps(menu.id)}
            dragStyle={getItemStyle(menu.id)}
            {...handlers}
          />
        ))}
      </div>
    </>
  );
}
