import { QrCode, Smartphone } from "lucide-react";

export function LandingDemo() {
  return (
    <section id="demo" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                See it in action
              </h2>
              <p className="mt-4 text-indigo-200 text-lg max-w-md">
                Scan this QR code to preview a menu just like your customers would see it in your restaurant.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <Smartphone size={18} />
                  <span>No app needed</span>
                </div>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <QrCode size={18} />
                  <span>Works with any camera</span>
                </div>
              </div>
            </div>

            {/* QR code placeholder */}
            <div className="shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-2xl p-4 shadow-2xl">
                <div className="w-full h-full bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-3">
                  <QrCode size={64} className="text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Your QR here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
