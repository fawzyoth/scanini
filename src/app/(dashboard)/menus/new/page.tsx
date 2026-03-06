"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, Paperclip } from "lucide-react";
import { MenuCreationOption } from "@/components/menus/menu-creation-option";
import { createClient } from "@/lib/supabase/client";
import { useDashboard } from "@/lib/dashboard-context";

export default function NewMenuPage() {
  const router = useRouter();
  const { restaurant, menus } = useDashboard();
  const [creating, setCreating] = useState(false);

  async function handleManualCreate() {
    if (!restaurant || creating) return;
    setCreating(true);

    const supabase = createClient();
    const { data: newMenu, error } = await (supabase.from("menus") as any)
      .insert({
        restaurant_id: restaurant.id,
        name: "New Menu",
        sort_order: menus.length,
      })
      .select()
      .single();

    if (error || !newMenu) {
      setCreating(false);
      return;
    }

    router.push(`/menus/${newMenu.id}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[60vh] px-2">
      <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-10 text-center">
        How do you want to create your menu?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl w-full">
        <MenuCreationOption
          icon={<FileText size={48} strokeWidth={1.5} />}
          title="Manually"
          description="Build your menu from scratch by adding categories and dishes step by step."
          onClick={handleManualCreate}
        />
        <MenuCreationOption
          icon={<Sparkles size={48} strokeWidth={1.5} />}
          title="Digitize with AI"
          badge="New"
          description="Upload a photo or PDF of your menu and turn it into an editable menu in seconds."
          onClick={() => router.push("/menus/digitize")}
        />
        <MenuCreationOption
          icon={<Paperclip size={48} strokeWidth={1.5} />}
          title="Static menu"
          description="Show your original menu as an image or PDF. These menus cannot be edited."
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
