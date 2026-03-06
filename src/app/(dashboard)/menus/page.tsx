"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import { Button, PageHeader } from "@/components/ui";
import { MenuTable, RenameModal, AvailabilityModal, IconPickerModal } from "@/components/menus";
import { useDashboard } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/client";
import { Menu } from "@/types";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function MenusPage() {
  const router = useRouter();
  const { menus: ctxMenus, loading, restaurant, reload } = useDashboard();
  const { t } = useTranslation();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);

  useEffect(() => {
    setMenus(ctxMenus);
  }, [ctxMenus]);

  function findMenu(id: string) {
    return menus.find((m) => m.id === id) ?? null;
  }

  async function handleToggleVisibility(id: string) {
    const menu = menus.find((m) => m.id === id);
    if (!menu) return;
    const supabase = createClient();
    await (supabase.from("menus") as any).update({ visible: !menu.visible }).eq("id", id);
    setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m)));
  }

  async function handleDuplicate(id: string) {
    const menu = menus.find((m) => m.id === id);
    if (!menu || !restaurant) return;
    const supabase = createClient();
    await (supabase.from("menus") as any).insert({
      restaurant_id: restaurant.id,
      name: `${menu.name} (copy)`,
      icon: menu.icon,
      availability: menu.availability,
      visible: menu.visible,
      sort_order: menus.length,
    });
    await reload();
  }

  function handleRenameClick(id: string) {
    setEditingMenu(findMenu(id));
    setRenameOpen(true);
  }

  async function handleRename(name: string) {
    if (!editingMenu) return;
    const supabase = createClient();
    await (supabase.from("menus") as any).update({ name }).eq("id", editingMenu.id);
    setMenus((prev) => prev.map((m) => (m.id === editingMenu.id ? { ...m, name } : m)));
  }

  function handleAvailabilityClick(id: string) {
    setEditingMenu(findMenu(id));
    setAvailabilityOpen(true);
  }

  async function handleAvailabilitySave(availability: string) {
    if (!editingMenu) return;
    const supabase = createClient();
    await (supabase.from("menus") as any).update({ availability }).eq("id", editingMenu.id);
    setMenus((prev) => prev.map((m) => (m.id === editingMenu.id ? { ...m, availability } : m)));
  }

  function handleIconClick(id: string) {
    setEditingMenu(findMenu(id));
    setIconOpen(true);
  }

  async function handleIconSelect(icon: string) {
    if (!editingMenu) return;
    const supabase = createClient();
    await (supabase.from("menus") as any).update({ icon }).eq("id", editingMenu.id);
    setMenus((prev) => prev.map((m) => (m.id === editingMenu.id ? { ...m, icon } : m)));
  }

  function handleEdit(id: string) {
    router.push(`/menus/${id}`);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("menus.confirmDelete"))) return;
    const supabase = createClient();
    await supabase.from("menus").delete().eq("id", id);
    setMenus((prev) => prev.filter((m) => m.id !== id));
    await reload();
  }

  function handleMoveDown(id: string) {
    setMenus((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  async function handleReorderMenus(reordered: Menu[]) {
    setMenus(reordered);
    const supabase = createClient();
    const updates = reordered.map((m, i) =>
      (supabase.from("menus") as any).update({ sort_order: i }).eq("id", m.id)
    );
    await Promise.all(updates);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t("menus.title")}>
        <a href="/preview" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
          <Button variant="outline" size="md">
            <Eye size={16} />
            {t("menus.preview")}
          </Button>
        </a>
        <Link href="/menus/new">
          <Button size="sm" className="sm:text-sm sm:px-4 sm:py-2">{t("menus.newMenu")}</Button>
        </Link>
      </PageHeader>

      <MenuTable
        menus={menus}
        onToggleVisibility={handleToggleVisibility}
        onDuplicate={handleDuplicate}
        onRename={handleRenameClick}
        onAdjustAvailability={handleAvailabilityClick}
        onChangeIcon={handleIconClick}
        onMoveDown={handleMoveDown}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorderMenus}
      />

      <RenameModal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        currentName={editingMenu?.name ?? ""}
        onRename={handleRename}
      />

      <AvailabilityModal
        open={availabilityOpen}
        onClose={() => setAvailabilityOpen(false)}
        currentAvailability={editingMenu?.availability ?? "Every day"}
        onSave={handleAvailabilitySave}
      />

      <IconPickerModal
        open={iconOpen}
        onClose={() => setIconOpen(false)}
        currentIcon={editingMenu?.icon ?? "utensils-crossed"}
        onSelect={handleIconSelect}
      />
    </>
  );
}
