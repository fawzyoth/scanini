"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: align === "right" ? rect.right : rect.left,
    });
  }, [align]);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleScroll() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updatePosition]);

  return (
    <div className="relative" ref={triggerRef}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] min-w-[200px] bg-white rounded-lg border border-gray-200 shadow-lg py-1"
            style={{
              top: position.top,
              ...(align === "right"
                ? { right: window.innerWidth - position.left }
                : { left: position.left }),
            }}
          >
            {items.map((item, i) => (
              <div key={i}>
                {item.separator && <div className="my-1 border-t border-gray-100" />}
                <button
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors whitespace-nowrap",
                    item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export function DropdownButton({
  label,
  items,
  align = "left",
}: {
  label: string;
  items: DropdownItem[];
  align?: "left" | "right";
}) {
  return (
    <Dropdown
      align={align}
      trigger={
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
          {label}
          <ChevronDown size={16} />
        </button>
      }
      items={items}
    />
  );
}
