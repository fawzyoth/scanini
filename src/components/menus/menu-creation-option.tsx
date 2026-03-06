import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

interface MenuCreationOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
}

export function MenuCreationOption({ icon, title, description, badge, onClick }: MenuCreationOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-4 p-8 text-center rounded-xl border border-gray-200",
        "hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white"
      )}
    >
      <div className="text-gray-500">{icon}</div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 flex items-center justify-center gap-2">
          {title}
          {badge && <Badge variant="info">{badge}</Badge>}
        </h3>
        <p className="mt-1 text-sm text-gray-500 max-w-[240px]">{description}</p>
      </div>
    </button>
  );
}
