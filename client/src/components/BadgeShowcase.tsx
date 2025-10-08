import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BadgeCard from "./BadgeCard";
import { useAuth } from "@/hooks/useAuth";

interface BadgeShowcaseProps {
  userId?: string;
}

export default function BadgeShowcase({ userId }: BadgeShowcaseProps) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const { data: userGamification, isLoading: gamificationLoading } = useQuery({
    queryKey: ["/api/user/gamification"],
    enabled: !!targetUserId,
  });

  const { data: allBadges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ["/api/badges"],
  });

  const earnedBadges = userGamification?.badges || [];
  const earnedBadgeIds = earnedBadges.map((b: any) => b.badgeId);
  const unearnedBadges = allBadges.filter((badge: any) => !earnedBadgeIds.includes(badge.id));

  const isLoading = gamificationLoading || badgesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  const categories = ["all", "course", "campaign", "workshop", "engagement", "special"];

  const filterBadgesByCategory = (badges: any[], category: string) => {
    if (category === "all") return badges;
    return badges.filter((badge: any) => (badge.badgeCategory || badge.category) === category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Achievement Badges</h2>
          <p className="text-space-400">
            You've earned {earnedBadges.length} out of {allBadges.length} badges
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-space-400">Completion</div>
          <div className="text-2xl font-bold text-cosmic-blue">
            {allBadges.length > 0 
              ? Math.round((earnedBadges.length / allBadges.length) * 100)
              : 0}%
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid grid-cols-6 bg-space-800/50 w-full">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize data-[state=active]:bg-cosmic-blue"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {/* Earned Badges */}
            {filterBadgesByCategory(earnedBadges, category).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Earned Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterBadgesByCategory(earnedBadges, category).map((badge: any) => (
                    <BadgeCard 
                      key={badge.id} 
                      badge={badge} 
                      isEarned={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Locked Badges */}
            {filterBadgesByCategory(unearnedBadges, category).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-space-400 mb-4">Locked Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filterBadgesByCategory(unearnedBadges, category).map((badge: any) => (
                    <BadgeCard 
                      key={badge.id} 
                      badge={badge} 
                      isEarned={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {filterBadgesByCategory([...earnedBadges, ...unearnedBadges], category).length === 0 && (
              <div className="text-center py-12">
                <p className="text-space-400">No badges in this category yet.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

