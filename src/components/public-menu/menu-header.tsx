import { Restaurant, Review } from "@/types";
import { StarRating } from "@/components/ui/star-rating";
import { Search, Star, Info, ChevronRight, Wifi, Phone, MapPin } from "lucide-react";

interface MenuHeaderProps {
  restaurant: Restaurant;
  reviews: Review[];
}

export function MenuHeader({ restaurant, reviews }: MenuHeaderProps) {
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      {/* Cover */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-amber-200 via-orange-300 to-red-300 overflow-hidden">
        {restaurant.coverImage && (
          <img src={restaurant.coverImage} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <Search size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mt-4">{restaurant.name}</h1>

        {reviews.length > 0 && (
          <button className="flex items-center gap-2 mt-3 w-full group">
            <Star size={18} className="text-gray-400" />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{avgRating.toFixed(0)}</span>
              <span className="text-gray-500">- Tres bon</span>
              <span className="text-gray-400">{reviews.length} avis</span>
            </div>
            <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600" />
          </button>
        )}

        <button className="flex items-center gap-2 mt-2 w-full group">
          <Info size={18} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {[
              restaurant.wifi && "Wi-Fi",
              restaurant.phone && "Telephone",
              restaurant.address && "Adresse",
            ].filter(Boolean).join(", ")}
          </span>
          <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>
    </div>
  );
}
