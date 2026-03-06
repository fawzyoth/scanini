"use client";

import { Review } from "@/types";
import { Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface RatingDistributionProps {
  reviews: Review[];
}

export function RatingDistribution({ reviews }: RatingDistributionProps) {
  const { t } = useTranslation();
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.round(r.rating) === stars).length,
  }));

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("stats.ratingDistribution")}</h3>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Star size={20} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">{t("stats.noReviewsYet")}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {distribution.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12 shrink-0">
                <span className="text-sm font-medium text-gray-700">{stars}</span>
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
