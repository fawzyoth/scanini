import { RefreshCw, ShieldAlert, QrCode, Star, Search, Sparkles, FileText } from "lucide-react";

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Mises à jour instantanées",
    description: "Modifiez plats, prix ou catégories. Tout est synchronisé en temps réel avec vos QR codes.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: ShieldAlert,
    title: "Allergènes intégrés",
    description: "Indiquez les allergènes de chaque plat pour que vos clients mangent en toute sérénité.",
    color: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: QrCode,
    title: "Un seul QR pour tout",
    description: "Petit-déj, déjeuner, boissons... Tous vos menus reliés au même QR code.",
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Star,
    title: "Avis clients",
    description: "Vos clients évaluent leur expérience directement depuis le menu digital.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Search,
    title: "Recherche de plats",
    description: "Vos clients trouvent un plat par nom en un clic. Idéal pour les grandes cartes.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
  },
];

const COMING_SOON = [
  {
    icon: Sparkles,
    title: "Création par IA",
    description: "Envoyez une photo de votre menu papier, notre IA crée le menu digital.",
  },
  {
    icon: FileText,
    title: "Menu statique (PDF)",
    description: "Importez votre menu en PDF, accessible via QR code instantanément.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Fonctionnalités
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Tout ce qu&apos;il faut pour
            <br />
            passer au digital
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon size={20} className={`bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: feature.color.includes("blue") ? "#3b82f6" : feature.color.includes("emerald") ? "#10b981" : feature.color.includes("indigo") ? "#6366f1" : feature.color.includes("amber") ? "#f59e0b" : "#8b5cf6" }} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COMING_SOON.map((item) => (
            <div
              key={item.title}
              className="relative p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50"
            >
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-1 rounded-full">
                  Bientôt
                </span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
