import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Gift, Snowflake, Sun } from "lucide-react";

const SeasonalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const currentMonth = new Date().getMonth();
  const isWinter = currentMonth === 11 || currentMonth === 0 || currentMonth === 1;
  const isSummer = currentMonth >= 5 && currentMonth <= 7;

  const getSeasonalContent = () => {
    if (isWinter) {
      return {
        icon: Snowflake,
        title: "Winter Sale",
        subtitle: "Cozy up with amazing deals!",
        description: "Get up to 50% off on winter essentials and warm clothing",
        bgGradient: "from-blue-600 via-purple-600 to-indigo-700",
        accentColor: "text-blue-100",
        buttonClass: "bg-white text-blue-600 hover:bg-blue-50"
      };
    } else if (isSummer) {
      return {
        icon: Sun,
        title: "Summer Collection",
        subtitle: "Beat the heat in style!",
        description: "Discover our cool summer collection with refreshing deals",
        bgGradient: "from-orange-500 via-red-500 to-pink-600",
        accentColor: "text-orange-100",
        buttonClass: "bg-white text-orange-600 hover:bg-orange-50"
      };
    } else {
      return {
        icon: Gift,
        title: "Seasonal Offers",
        subtitle: "Special deals await you!",
        description: "Explore our curated collection with exclusive seasonal discounts",
        bgGradient: "from-emerald-600 via-teal-600 to-cyan-700",
        accentColor: "text-emerald-100",
        buttonClass: "bg-white text-emerald-600 hover:bg-emerald-50"
      };
    }
  };

  const content = getSeasonalContent();
  const Icon = content.icon;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${content.bgGradient} py-8 px-4`}>
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-10"
        aria-label="Close banner"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-1">{content.title}</h3>
              <p className={`${content.accentColor} text-sm md:text-base`}>{content.subtitle}</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className={`${content.accentColor} mb-3 text-sm md:text-base max-w-md`}>
              {content.description}
            </p>
            <Button className={content.buttonClass}>
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-10 left-10">
          <Icon className="h-16 w-16 animate-pulse" />
        </div>
        <div className="absolute bottom-10 right-10">
          <Icon className="h-20 w-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute top-1/2 left-1/4">
          <Icon className="h-12 w-12 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
};

export default SeasonalBanner;
