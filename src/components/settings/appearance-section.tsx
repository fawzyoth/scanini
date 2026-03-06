"use client";

import { useState, useEffect } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";

export function AppearanceSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setPrimaryColor((restaurant as any).primary_color ?? "#4F46E5");
    }
  }, [restaurant]);

  async function handleSave() {
    await updateRestaurant({ primary_color: primaryColor } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <ColorPicker label="Primary color" value={primaryColor} onChange={setPrimaryColor} />
      <p className="text-xs text-gray-400">
        This color is used for buttons and accents on your public menu page.
      </p>
      <div className="pt-2 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>Save changes</Button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
      </div>
    </div>
  );
}
