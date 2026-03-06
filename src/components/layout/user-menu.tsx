"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { CircleArrowUp, User, CreditCard, LogOut } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
  compact?: boolean;
}

export function UserMenu({ compact }: UserMenuProps) {
  const { profile } = useDashboard();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = profile ? profile.first_name || profile.email : "User";
  const displayEmail = profile?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  }

  const avatar = (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
      {initial}
    </div>
  );

  const dropdown = open
    ? createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1"
          style={{ top: position.top, right: position.right }}
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{displayEmail}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={16} className="text-gray-400" />
              Profile settings
            </Link>
            <Link
              href="/billing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard size={16} className="text-gray-400" />
              Plan & billing
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>,
        document.body
      )
    : null;

  if (compact) {
    return (
      <>
        <button
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {avatar}
        </button>
        {dropdown}
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/billing"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
      >
        <CircleArrowUp size={16} />
        Upgrade plan
      </Link>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {avatar}
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
      </button>
      {dropdown}
    </div>
  );
}
