import { Star, ChevronRight, MapPin, Clock } from "lucide-react";

const MENU_ITEMS = [
  {
    name: "Croissant Beurre",
    description: "Beurre AOP, feuilletage maison",
    price: "2.50",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=120&h=120&fit=crop&q=80",
  },
  {
    name: "Eggs Benedict",
    description: "Poached eggs, hollandaise, English muffin",
    price: "12.00",
    image: "https://images.unsplash.com/photo-1608039829572-9b0189ea6268?w=120&h=120&fit=crop&q=80",
  },
  {
    name: "Avocado Toast",
    description: "Sourdough, cherry tomatoes, microgreens",
    price: "9.50",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=120&h=120&fit=crop&q=80",
  },
  {
    name: "Cappuccino",
    description: "Double shot espresso, steamed milk",
    price: "4.00",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&h=120&fit=crop&q=80",
  },
];

export function AuthPhoneMockup() {
  return (
    <div className="w-[260px] h-[540px] bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-white/10">
      {/* Notch */}
      <div className="relative z-20 flex justify-center">
        <div className="w-20 h-5 bg-gray-800 rounded-b-xl" />
      </div>

      {/* Screen */}
      <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col -mt-5">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-0.5">
            <div className="w-3 h-2 border border-current rounded-sm relative">
              <div className="absolute inset-[1px] bg-current rounded-[1px]" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-hidden">
          {/* Cover image */}
          <div className="relative h-28">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&q=80"
              alt="Restaurant interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-2 left-3">
              <h2 className="text-white text-sm font-bold drop-shadow">My Restaurant</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={8} className="text-white/80" />
                <span className="text-[8px] text-white/80">Paris, France</span>
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-semibold">4.8</span>
              <span className="text-[9px] text-gray-400">(128)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={9} className="text-gray-400" />
              <span className="text-[9px] text-gray-500">Open now</span>
            </div>
            <ChevronRight size={10} className="text-gray-300 ml-auto" />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-3 py-2">
            <span className="text-[9px] font-semibold text-white bg-gray-900 rounded-full px-2.5 py-0.5">Breakfast</span>
            <span className="text-[9px] text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">Lunch</span>
            <span className="text-[9px] text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">Drinks</span>
          </div>

          {/* Menu items */}
          <div className="px-3 space-y-2 pb-3">
            {MENU_ITEMS.map((item) => (
              <div key={item.name} className="flex gap-2 items-center bg-gray-50 rounded-xl p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-900 leading-tight">{item.name}</p>
                  <p className="text-[8px] text-gray-400 mt-0.5 leading-snug line-clamp-1">{item.description}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-900 shrink-0">{item.price}&euro;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="shrink-0 flex justify-center pb-1.5">
          <div className="w-20 h-0.5 bg-gray-900 rounded-full" />
        </div>
      </div>
    </div>
  );
}
