import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Créez votre menu gratuit dès maintenant
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Aucune carte bancaire requise. Annulez quand vous voulez.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-200"
          >
            S&apos;inscrire gratuitement
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
