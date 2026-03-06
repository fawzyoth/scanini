"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";

export function WifiSection() {
  const { restaurant, updateRestaurant } = useDashboard();
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setSsid(restaurant.wifi_ssid ?? "");
      setPassword(restaurant.wifi_password ?? "");
    }
  }, [restaurant]);

  async function handleSave() {
    await updateRestaurant({
      wifi_ssid: ssid || null,
      wifi_password: password || null,
    } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <Input label="Network name (SSID)" value={ssid} onChange={(e) => setSsid(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="pt-2 flex items-center gap-3">
        <Button size="sm" onClick={handleSave}>Save changes</Button>
        {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
      </div>
    </div>
  );
}
