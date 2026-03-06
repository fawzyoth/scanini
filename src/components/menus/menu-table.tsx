"use client";

import { Menu } from "@/types";
import { MenuTableRow } from "./menu-table-row";
import { MenuCard } from "./menu-card";

export interface MenuActionHandlers {
  onToggleVisibility: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onAdjustAvailability: (id: string) => void;
  onChangeIcon: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

interface MenuTableProps extends MenuActionHandlers {
  menus: Menu[];
}

export function MenuTable({ menus, ...handlers }: MenuTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Dishes
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Visibility
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
            {...handlers}
          />
        ))}
      </div>
    </>
  );
}
