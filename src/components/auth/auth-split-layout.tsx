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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-950 relative overflow-hidden">
        {/* Background effects matching landing page */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Showcase */}
      <div className="hidden lg:flex lg:w-[520px] xl:w-[600px] bg-gray-900 items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center">
          {showcase}

          <div className="mt-8 text-center">
            <h3 className="text-white text-lg font-semibold">{caption}</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">{subcaption}</p>
          </div>
        </div>
      </div>
    </>
  );
}
