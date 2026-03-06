"use client";

interface PhoneShellProps {
  children: React.ReactNode;
}

export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div className="w-[375px] h-[812px] bg-black rounded-[3rem] p-3 shadow-2xl relative">
      {/* Dynamic Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-20" />

      {/* Screen */}
      <div className="w-full h-full bg-white rounded-[2.25rem] overflow-hidden flex flex-col relative">
        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-3 pb-1 text-xs font-semibold shrink-0 bg-white z-10">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="5" width="3" height="7" rx="0.5" />
              <rect x="4.5" y="3.5" width="3" height="8.5" rx="0.5" />
              <rect x="9" y="1.5" width="3" height="10.5" rx="0.5" />
              <rect x="13" y="0" width="3" height="12" rx="0.5" />
            </svg>
          </div>
        </div>

        {children}

        {/* Home indicator */}
        <div className="shrink-0 flex justify-center pb-2 bg-white">
          <div className="w-32 h-1 bg-gray-900 rounded-full" />
        </div>
      </div>
    </div>
  );
}
