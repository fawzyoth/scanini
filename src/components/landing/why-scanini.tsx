export function LandingWhyScanini() {
  return (
    <section className="py-24 sm:py-32 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/10">
            Pourquoi Scanini
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Conçu pour des restaurants
            <br />
            comme le vôtre
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "5 min",
              label: "Pour créer votre menu",
              description: "Du petit bistrot aux grandes chaînes, créez votre premier menu digital en quelques minutes seulement.",
            },
            {
              number: "96%",
              label: "De réponses en 24h",
              description: "Notre support est réactif. Vous ne serez jamais bloqué quand vous avez besoin d'aide.",
            },
            {
              number: "0 TND",
              label: "Pour commencer",
              description: "Aucune carte bancaire requise. Commencez gratuitement et évoluez à votre rythme.",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                {stat.number}
              </p>
              <p className="text-sm font-semibold text-white/80 mt-3 mb-2">{stat.label}</p>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
