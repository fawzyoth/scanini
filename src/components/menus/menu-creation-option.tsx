import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

interface MenuCreationOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  comingSoon?: boolean;
  onClick: () => void;
}

export function MenuCreationOption({ icon, title, description, badge, comingSoon, onClick }: MenuCreationOptionProps) {
  return (
    <button
      onClick={comingSoon ? undefined : onClick}
      disabled={comingSoon}
      className={cn(
        "flex flex-col items-center gap-4 p-8 text-center rounded-xl border border-gray-200 bg-white transition-all",
        comingSoon
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-indigo-300 hover:shadow-md cursor-pointer"
      )}
    >
      <div className="text-gray-500">{icon}</div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 flex items-center justify-center gap-2">
          {title}
          {comingSoon && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              Bientot
            </span>
          )}
          {!comingSoon && badge && <Badge variant="info">{badge}</Badge>}
        </h3>
        <p className="mt-1 text-sm text-gray-500 max-w-[240px]">{description}</p>
      </div>
    </button>
  );
}
