import { Building2, Sparkles, Headphones } from "lucide-react";

const BENEFITS = [
  {
    icon: Building2,
    title: "Fits every restaurant",
    description:
      "From small bistros to big chains, one solution that adapts to your needs and grows with your business.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "Ease of use",
    description:
      "Everything feels natural and straightforward from the start. Rated 9 out of 10 by our customers.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Headphones,
    title: "Support quality",
    description:
      "We reply to 96% of inquiries within 24 hours, so you're never left in the dark when you need help.",
    color: "bg-green-50 text-green-600",
  },
];

export function LandingWhyScanini() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-indigo-600 mb-3">Why Scanini</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Built for restaurants like yours
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
