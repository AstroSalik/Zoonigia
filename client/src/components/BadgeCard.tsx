import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Lock, CheckCircle } from "lucide-react";

interface BadgeCardProps {
  badge: {
    id?: number;
    badgeId?: number;
    badgeName?: string;
    name?: string;
    badgeDescription?: string;
    description?: string;
    badgeImageUrl?: string | null;
    imageUrl?: string | null;
    badgeCategory?: string;
    category?: string;
    badgeTier?: string;
    tier?: string;
    badgePoints?: number;
    points?: number;
    earnedAt?: Date | string | null;
    progress?: number;
    requirement?: number;
  };
  isEarned?: boolean;
  userProgress?: number;
}

export default function BadgeCard({ badge, isEarned = false, userProgress = 0 }: BadgeCardProps) {
  const name = badge.badgeName || badge.name || "Unknown Badge";
  const description = badge.badgeDescription || badge.description || "";
  const imageUrl = badge.badgeImageUrl || badge.imageUrl;
  const category = badge.badgeCategory || badge.category || "general";
  const tier = badge.badgeTier || badge.tier || "bronze";
  const points = badge.badgePoints || badge.points || 0;
  const requirement = badge.requirement || 100;
  const progress = badge.progress || userProgress;

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "from-purple-400 to-pink-400";
      case "gold":
        return "from-yellow-400 to-orange-400";
      case "silver":
        return "from-gray-300 to-gray-400";
      default:
        return "from-amber-600 to-amber-700";
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "gold":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      case "silver":
        return "bg-gray-400/20 text-gray-300 border-gray-400";
      default:
        return "bg-amber-600/20 text-amber-500 border-amber-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    // Add more category-specific icons as needed
    return <Award className="w-6 h-6" />;
  };

  const progressPercentage = (progress / requirement) * 100;

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:scale-105 ${
        isEarned 
          ? "bg-space-800/50 border-cosmic-blue shadow-lg shadow-cosmic-blue/20" 
          : "bg-space-800/30 border-space-700 opacity-75"
      }`}
    >
      <CardContent className="p-6">
        {/* Badge Status Indicator */}
        <div className="absolute top-3 right-3">
          {isEarned ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <Lock className="w-5 h-5 text-space-500" />
          )}
        </div>

        {/* Badge Icon/Image */}
        <div className="flex flex-col items-center mb-4">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
              isEarned 
                ? `bg-gradient-to-br ${getTierColor(tier)}` 
                : "bg-space-700"
            }`}
          >
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="text-white">
                {getCategoryIcon(category)}
              </div>
            )}
          </div>

          {/* Tier Badge */}
          <Badge variant="outline" className={getTierBadgeColor(tier)}>
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
        </div>

        {/* Badge Info */}
        <div className="text-center space-y-2">
          <h3 className="font-bold text-white text-lg">{name}</h3>
          <p className="text-sm text-space-400 line-clamp-2 min-h-[40px]">{description}</p>
          
          {/* Points */}
          <div className="flex items-center justify-center gap-2 text-cosmic-orange">
            <Award className="w-4 h-4" />
            <span className="font-semibold">+{points} points</span>
          </div>

          {/* Progress Bar (if not earned) */}
          {!isEarned && requirement > 0 && (
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-space-400">
                <span>Progress</span>
                <span>{Math.min(progress, requirement)}/{requirement}</span>
              </div>
              <div className="w-full bg-space-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cosmic-blue to-cosmic-purple h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Earned Date */}
          {isEarned && badge.earnedAt && (
            <p className="text-xs text-green-400 mt-2">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

