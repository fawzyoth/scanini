import Link from "next/link";

export function LandingFooter() {
  return (
    <footer id="contact" className="bg-gray-950 text-white border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-10">
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="5" cy="5" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                </svg>
              </div>
              <span className="text-lg font-bold">Scanini</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              La manière la plus simple de créer et gérer des menus QR digitaux pour votre restaurant.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Produit</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Fonctionnalités", href: "#features" },
                  { label: "Tarifs", href: "#pricing" },
                  { label: "FAQ", href: "#faq" },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Légal</p>
              <ul className="space-y-2.5">
                {[
                  { label: "Conditions générales", href: "#" },
                  { label: "Confidentialité", href: "#" },
                  { label: "Cookies", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Scanini. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-600">
            Fait avec amour en Europe
          </p>
        </div>
      </div>
    </footer>
  );
}
