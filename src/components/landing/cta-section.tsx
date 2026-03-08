import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gray-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Prêt à digitaliser votre menu ?
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-md mx-auto">
              Rejoignez les restaurants qui ont déjà fait le pas. Gratuit pour commencer.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold rounded-2xl transition-all shadow-lg shadow-white/10"
            >
              Créer mon menu gratuitement
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
