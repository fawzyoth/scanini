"use client";

import { Review } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { MessageSquare } from "lucide-react";

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent reviews</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <MessageSquare size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No reviews yet</p>
          <p className="text-xs text-gray-500 mt-1">Reviews from your customers will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent reviews</h3>
        <span className="text-sm text-gray-500">{reviews.length} total</span>
      </div>

      <div className="divide-y divide-gray-100">
        {reviews.map((review) => (
          <div key={review.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <StarRating rating={review.rating} size={16} />
              <span className="text-xs text-gray-400">
                {new Date(review.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {review.comment && (
              <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>Meal: <strong className="text-gray-700">{review.meal}/5</strong></span>
              <span>Service: <strong className="text-gray-700">{review.service}/5</strong></span>
              <span>Atmosphere: <strong className="text-gray-700">{review.atmosphere}/5</strong></span>
              <span>Cleanliness: <strong className="text-gray-700">{review.cleanliness}/5</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
