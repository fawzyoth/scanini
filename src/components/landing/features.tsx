import { RefreshCw, ShieldAlert, QrCode, Star, Search, Sparkles, FileText } from "lucide-react";

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Mettez à jour en quelques secondes",
    description:
      "Fini les impressions à chaque changement de menu. Modifiez vos plats, prix ou catégories et tout est instantanément synchronisé avec les QR codes sur vos tables.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldAlert,
    title: "Allergènes intégrés",
    description:
      "Rendez les repas plus sûrs pour tous. Indiquez les allergènes de chaque plat pour que vos clients puissent profiter de leur repas en toute sérénité.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: QrCode,
    title: "Un seul QR pour tout",
    description:
      "Créez autant de menus que vous le souhaitez : petit-déjeuner, déjeuner, boissons... Tous reliés au même QR code. Vous choisissez lesquels afficher.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Star,
    title: "Avis clients intégrés",
    description:
      "Permettez à vos clients d'évaluer leur expérience directement depuis le menu. Consultez les avis et améliorez votre service en continu.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Search,
    title: "Recherche de plats",
    description:
      "Vos clients peuvent rechercher un plat par nom directement dans le menu digital. Idéal pour les cartes longues ou les clients pressés.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Sparkles,
    title: "Création de menu par IA",
    description:
      "Envoyez une photo de votre menu papier et notre IA crée votre menu digital automatiquement. Plus besoin de tout saisir à la main.",
    color: "bg-pink-50 text-pink-600",
    comingSoon: true,
  },
  {
    icon: FileText,
    title: "Menu statique (PDF)",
    description:
      "Importez directement votre menu en PDF ou image pour le rendre accessible via QR code, sans avoir à recréer chaque plat.",
    color: "bg-orange-50 text-orange-600",
    comingSoon: true,
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-indigo-600 mb-3">Fonctionnalités</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Tout ce qu&apos;il faut pour passer au digital
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            De la mise à jour instantanée au QR code personnalisé, Scanini vous donne le contrôle total sur votre menu digital.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${
                feature.comingSoon
                  ? "border-dashed border-gray-200 bg-gray-50/50"
                  : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
              }`}
            >
              {feature.comingSoon && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                  Bientôt
                </span>
              )}

              <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={20} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
