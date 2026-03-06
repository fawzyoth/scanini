"use client";

import { Logo } from "./logo";
import { NavItem } from "./nav-item";
import { UserMenu } from "./user-menu";
import { NAV_ITEMS } from "@/constants/nav";

export function Navbar() {
  return (
    <>
      {/* Desktop top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Mobile top bar (logo + avatar) */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <Logo />
          <UserMenu compact />
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} {...item} mobile />
          ))}
        </div>
      </nav>
    </>
  );
}
