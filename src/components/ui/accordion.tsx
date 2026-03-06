"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Accordion({ icon, title, description, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors rounded-xl"
      >
        {icon && <div className="flex-shrink-0 text-gray-500">{icon}</div>}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-semibold text-gray-900">{title}</p>
          {description && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 line-clamp-1 sm:line-clamp-none">{description}</p>}
        </div>
        <ChevronDown
          size={20}
          className={cn("text-gray-400 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">{children}</div>}
    </div>
  );
}
