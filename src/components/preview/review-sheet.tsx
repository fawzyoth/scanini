"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewSheetProps {
  open: boolean;
  onClose: () => void;
  restaurantId?: string;
}

const CATEGORIES = [
  { key: "meal", label: "Nourriture" },
  { key: "atmosphere", label: "Atmosphere" },
  { key: "service", label: "Service" },
  { key: "cleanliness", label: "Nettoyage" },
  { key: "price", label: "Prix" },
];

function InteractiveStars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            size={32}
            className={cn(
              "transition-colors",
              (hover || value) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSheet({ open, onClose, restaurantId }: ReviewSheetProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateRating(key: string, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (submitting) return;

    if (restaurantId) {
      setSubmitting(true);
      try {
        const overall = Math.round(
          Object.values(ratings).reduce((a, b) => a + b, 0) /
            Math.max(Object.values(ratings).length, 1)
        );
        await fetch("/api/public-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            rating: overall,
            meal: ratings.meal || 0,
            service: ratings.service || 0,
            atmosphere: ratings.atmosphere || 0,
            cleanliness: ratings.cleanliness || 0,
            comment: comment || null,
          }),
        });
      } catch {
        // silent fail
      }
      setSubmitting(false);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRatings({});
      setComment("");
      onClose();
    }, 1500);
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl max-h-[90%] flex flex-col animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <h3 className="text-xl font-bold text-gray-900 text-center mt-2 mb-6">
            Evaluez votre experience
          </h3>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-900">Merci!</p>
              <p className="text-sm text-gray-500 mt-1">Votre avis a ete envoye.</p>
            </div>
          ) : (
            <>
              {/* Rating categories */}
              <div className="space-y-5">
                {CATEGORIES.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900 w-28 shrink-0">
                      {cat.label}
                    </span>
                    <InteractiveStars
                      value={ratings[cat.key] || 0}
                      onChange={(v) => updateRating(cat.key, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Comment */}
              <div className="mt-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Voulez-vous laisser un commentaire?"
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full mt-5 py-3.5 bg-gray-900 text-white rounded-full text-base font-semibold hover:bg-gray-800 transition-colors"
              >
                Envoyer des commentaires
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
