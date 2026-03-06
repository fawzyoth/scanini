"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";

const MENU_ITEMS = [
  { name: "Croissant Beurre", price: "2.50", emoji: "🥐" },
  { name: "Eggs Benedict", price: "12.00", emoji: "🍳" },
  { name: "Avocado Toast", price: "9.50", emoji: "🥑" },
  { name: "Cappuccino", price: "4.00", emoji: "☕" },
  { name: "Pancakes", price: "8.50", emoji: "🥞" },
];

// Animation cycle: show list -> pick up item -> drag it -> drop it -> pause -> add new item -> repeat
export function AuthEditorAnimation() {
  const [items, setItems] = useState(MENU_ITEMS.slice(0, 4));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [phase, setPhase] = useState<"idle" | "lifting" | "dragging" | "dropping" | "adding">("idle");
  const [showNewItem, setShowNewItem] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    // Animation sequence
    const timers: ReturnType<typeof setTimeout>[] = [];

    function run() {
      // Phase 1: idle
      timers.push(setTimeout(() => {
        setPhase("lifting");
        setDragIndex(3); // pick up last item (Cappuccino)
      }, 1200));

      // Phase 2: lift
      timers.push(setTimeout(() => {
        setPhase("dragging");
        setDragOffset(-1); // move up by 1 position visually
      }, 1700));

      // Phase 3: drag up
      timers.push(setTimeout(() => {
        setDragOffset(-2); // move up by 2 positions
      }, 2200));

      // Phase 4: drop
      timers.push(setTimeout(() => {
        setPhase("dropping");
        // Actually reorder: move index 3 to index 1
        setItems(prev => {
          const newItems = [...prev];
          const [moved] = newItems.splice(3, 1);
          newItems.splice(1, 0, moved);
          return newItems;
        });
        setDragIndex(null);
        setDragOffset(0);
      }, 2900));

      // Phase 5: add new item
      timers.push(setTimeout(() => {
        setPhase("adding");
        setShowNewItem(true);
        setItems(prev => {
          if (prev.length < 5) {
            return [...prev, MENU_ITEMS[4]];
          }
          return prev;
        });
      }, 4000));

      // Phase 6: reset for next cycle
      timers.push(setTimeout(() => {
        setPhase("idle");
        setShowNewItem(false);
        setItems(MENU_ITEMS.slice(0, 4));
        setDragIndex(null);
        setDragOffset(0);
        setCycle(c => c + 1);
      }, 6000));
    }

    run();
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const ITEM_HEIGHT = 44; // px per item row

  return (
    <div className="w-[280px] h-[540px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-white/10">
      {/* Notch */}
      <div className="relative z-20 flex justify-center">
        <div className="w-20 h-5 bg-gray-900 rounded-b-xl" />
      </div>

      {/* Screen */}
      <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col -mt-5">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-0.5">
            <div className="w-3 h-2 border border-current rounded-sm relative">
              <div className="absolute inset-[1px] bg-current rounded-[1px]" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Editor header */}
        <div className="px-4 pt-3 pb-2 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-gray-900">Petit Dejeuner</h2>
              <p className="text-[9px] text-gray-400 mt-0.5">{items.length} items</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Plus size={12} className="text-white" />
              </button>
              <button className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <MoreHorizontal size={12} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu items list */}
        <div className="flex-1 px-3 pt-2 overflow-hidden relative">
          {items.map((item, i) => {
            const isDragged = dragIndex === i;
            let translateY = 0;

            if (phase === "dragging" || phase === "lifting") {
              if (isDragged) {
                translateY = dragOffset * ITEM_HEIGHT;
              } else if (dragIndex !== null) {
                // Items between target and source need to shift
                const targetIndex = dragIndex + dragOffset;
                if (i >= targetIndex && i < dragIndex) {
                  translateY = ITEM_HEIGHT; // shift down
                }
              }
            }

            return (
              <div
                key={item.name + i}
                className={`flex items-center gap-2 px-2 py-2 rounded-xl mb-1 transition-all ${
                  isDragged && (phase === "lifting" || phase === "dragging")
                    ? "bg-indigo-50 ring-2 ring-indigo-400 shadow-lg z-10 relative scale-[1.02]"
                    : showNewItem && i === items.length - 1 && phase === "adding"
                      ? "bg-green-50 ring-1 ring-green-300 animate-fade-in"
                      : "bg-gray-50"
                }`}
                style={{
                  transform: `translateY(${translateY}px)`,
                  transition: phase === "dropping" ? "none" : "transform 0.4s cubic-bezier(0.2, 0, 0, 1)",
                }}
              >
                <GripVertical
                  size={12}
                  className={`shrink-0 ${
                    isDragged && (phase === "lifting" || phase === "dragging")
                      ? "text-indigo-400"
                      : "text-gray-300"
                  }`}
                />
                <span className="text-sm shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-gray-900 leading-tight">{item.name}</p>
                </div>
                <span className="text-[10px] font-semibold text-gray-600 shrink-0">{item.price}&euro;</span>
              </div>
            );
          })}

          {/* Drag cursor indicator */}
          {(phase === "lifting" || phase === "dragging") && dragIndex !== null && (
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20"
              style={{
                top: `${(dragIndex * (ITEM_HEIGHT + 4)) + dragOffset * ITEM_HEIGHT + ITEM_HEIGHT + 8}px`,
                transition: "top 0.4s cubic-bezier(0.2, 0, 0, 1)",
              }}
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500 shadow-lg flex items-center justify-center opacity-70">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </div>
            </div>
          )}

          {/* "Add item" hint */}
          {phase === "adding" && (
            <div className="flex items-center gap-2 px-2 py-2 mt-1 rounded-xl border-2 border-dashed border-indigo-200 animate-fade-in">
              <Plus size={12} className="text-indigo-400" />
              <span className="text-[9px] text-indigo-400 font-medium">Drag to reorder, tap + to add</span>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="shrink-0 px-4 py-2 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-gray-400">Auto-saved</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[9px] text-green-600 font-medium">Published</span>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="shrink-0 flex justify-center pb-1.5">
          <div className="w-20 h-0.5 bg-gray-900 rounded-full" />
        </div>
      </div>
    </div>
  );
}
