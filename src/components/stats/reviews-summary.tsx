import { Review } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { RatingBar } from "./rating-bar";
import { Star } from "lucide-react";

interface ReviewsSummaryProps {
  reviews: Review[];
}

export function ReviewsSummary({ reviews }: ReviewsSummaryProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average ratings</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Star size={20} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No reviews yet</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const avgMeal = reviews.reduce((sum, r) => sum + r.meal, 0) / reviews.length;
  const avgService = reviews.reduce((sum, r) => sum + r.service, 0) / reviews.length;
  const avgAtmosphere = reviews.reduce((sum, r) => sum + r.atmosphere, 0) / reviews.length;
  const avgCleanliness = reviews.reduce((sum, r) => sum + r.cleanliness, 0) / reviews.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Average ratings</h3>

      <div className="flex items-center gap-3 mb-6">
        <StarRating rating={avgRating} />
        <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
        <span className="text-sm text-gray-500">
          ({reviews.length} review{reviews.length > 1 ? "s" : ""})
        </span>
      </div>

      <div className="space-y-3">
        <RatingBar label="Meal" value={parseFloat(avgMeal.toFixed(1))} />
        <RatingBar label="Service" value={parseFloat(avgService.toFixed(1))} />
        <RatingBar label="Atmosphere" value={parseFloat(avgAtmosphere.toFixed(1))} />
        <RatingBar label="Cleanliness" value={parseFloat(avgCleanliness.toFixed(1))} />
      </div>
    </div>
  );
}
