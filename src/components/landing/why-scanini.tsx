import { Building2, Sparkles, Headphones } from "lucide-react";

const BENEFITS = [
  {
    icon: Building2,
    title: "Adapté à chaque restaurant",
    description:
      "Du petit bistrot aux grandes chaînes, une solution qui s'adapte à vos besoins et grandit avec votre activité.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "Simple à utiliser",
    description:
      "Tout est naturel et intuitif dès le départ. Aucune compétence technique requise pour créer et gérer votre menu.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Headphones,
    title: "Support réactif",
    description:
      "Nous répondons à 96% des demandes en moins de 24h, pour que vous ne soyez jamais bloqué quand vous avez besoin d'aide.",
    color: "bg-green-50 text-green-600",
  },
];

export function LandingWhyScanini() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-indigo-600 mb-3">Pourquoi Scanini</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Conçu pour des restaurants comme le vôtre
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${b.color} flex items-center justify-center mx-auto mb-5`}>
                <b.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {b.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
