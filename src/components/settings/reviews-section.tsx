"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";

export function ReviewsSection() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Enable reviews</span>
          <Badge variant="success">Active</Badge>
        </div>
        <Toggle enabled={enabled} onChange={setEnabled} />
      </div>
      <p className="text-sm text-gray-500">
        When enabled, a &quot;Rate your experience&quot; button will appear on your public menu page,
        allowing customers to leave feedback.
      </p>
    </div>
  );
}
