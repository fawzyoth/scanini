"use client";

import { MessageCircle } from "lucide-react";

export function RateButton() {
  return (
    <button className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors">
      <MessageCircle size={18} />
      <span className="text-sm font-medium">Evaluez votre experience</span>
    </button>
  );
}
