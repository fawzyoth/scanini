import { RefreshCw, Languages, Star, ShieldAlert, QrCode } from "lucide-react";

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Update menu in seconds",
    description:
      "Forget about printing new menus every time you edit or add new dishes. All changes are instantly synced with the QR codes on your tables.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Languages,
    title: "Multiple languages",
    description:
      "Make it easy for foreign customers by offering your menu in additional languages. Enable auto-translate and it does the hard work for you.",
    color: "bg-violet-50 text-violet-600",
    badges: ["French", "Spanish", "German", "Auto-translate"],
  },
  {
    icon: Star,
    title: "Google Reviews integration",
    description:
      "Connect your Google Business Profile to display reviews on your menus while enabling guests to easily rate their experience.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: ShieldAlert,
    title: "Allergen tagging",
    description:
      "Make dining safer for everyone. Tag allergens in your dishes so customers with dietary needs can enjoy their meal with peace of mind.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: QrCode,
    title: "One QR for everything",
    description:
      "Create as many menus as you wish. All connected to the same QR code — you decide which ones are shown and when.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-indigo-600 mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything you need to go digital
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            From instant updates to multi-language support, Scanini gives you full control over your restaurant&apos;s digital presence.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={20} />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>

              {feature.badges && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {feature.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
