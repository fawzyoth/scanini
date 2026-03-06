interface RatingBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export function RatingBar({ label, value, maxValue = 5 }: RatingBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-900 w-6 text-right">{value}</span>
    </div>
  );
}
