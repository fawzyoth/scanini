"use client";

import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";

export function AppearanceSection() {
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  return (
    <div className="space-y-4">
      <ColorPicker label="Primary color" value={primaryColor} onChange={setPrimaryColor} />
      <ColorPicker label="Background color" value={backgroundColor} onChange={setBackgroundColor} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
      </div>
      <div className="pt-2">
        <Button size="sm">Save changes</Button>
      </div>
    </div>
  );
}
