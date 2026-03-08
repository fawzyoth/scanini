"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg shadow-black/5 px-5 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="5" cy="5" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">Scanini</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-5 py-2.5 rounded-xl transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600 -mr-2">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mx-4 mt-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-4">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link href="/signin" className="text-sm font-medium text-gray-700 text-center py-2.5 rounded-xl border border-gray-200">
                Connexion
              </Link>
              <Link href="/signup" className="text-sm font-semibold text-white bg-gray-900 text-center py-2.5 rounded-xl">
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
