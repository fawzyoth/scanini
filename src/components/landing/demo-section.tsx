import { QrCode, Smartphone, Zap } from "lucide-react";

export function LandingDemo() {
  return (
    <section id="demo" className="py-24 sm:py-32 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative p-8 sm:p-14 lg:p-20">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Text */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Voyez par vous-même
                </h2>
                <p className="mt-4 text-white/70 text-lg max-w-md mx-auto lg:mx-0">
                  Scannez ce QR code pour découvrir un menu exactement comme vos clients le verront.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-5 lg:justify-start justify-center">
                  <div className="flex items-center gap-2.5 text-white/60 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Smartphone size={16} className="text-white/80" />
                    </div>
                    <span>Aucune app requise</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/60 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Zap size={16} className="text-white/80" />
                    </div>
                    <span>Chargement instantané</span>
                  </div>
                </div>
              </div>

              {/* QR placeholder */}
              <div className="shrink-0">
                <div className="w-52 h-52 sm:w-60 sm:h-60 bg-white rounded-3xl p-5 shadow-2xl shadow-black/20">
                  <div className="w-full h-full bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3">
                    <QrCode size={56} className="text-gray-300" />
                    <p className="text-xs text-gray-400 font-medium">Votre QR ici</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
