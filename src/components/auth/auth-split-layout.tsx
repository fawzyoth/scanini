interface AuthSplitLayoutProps {
  children: React.ReactNode;
  showcase: React.ReactNode;
  caption: string;
  subcaption: string;
}

export function AuthSplitLayout({ children, showcase, caption, subcaption }: AuthSplitLayoutProps) {
  return (
    <>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Showcase */}
      <div className="hidden lg:flex lg:w-[520px] xl:w-[600px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative blurred shapes */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          {showcase}

          <div className="mt-8 text-center">
            <h3 className="text-white text-lg font-semibold">{caption}</h3>
            <p className="text-indigo-200 text-sm mt-1 max-w-xs">{subcaption}</p>
          </div>
        </div>
      </div>
    </>
  );
}
