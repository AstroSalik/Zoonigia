import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, TrendingUp, Zap, Target, RefreshCw, Star, Crown, Flame } from "lucide-react";
import Navigation from "@/components/Navigation";
import GlassMorphism from "@/components/GlassMorphism";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  const { data: leaderboard = [], isLoading, refetch } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard", timeFilter],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard?limit=100&time=${timeFilter}`);
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: userGamification } = useQuery({
    queryKey: ["/api/user/gamification"],
    enabled: !!user,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    if (rank <= 10) return <Star className="w-5 h-5 text-cosmic-blue" />;
    return <span className="text-lg font-bold text-space-400">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
    if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400";
    if (rank === 3) return "bg-amber-600/20 text-amber-500 border-amber-600";
    if (rank <= 10) return "bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue";
    return "bg-space-700/50 text-space-300 border-space-600";
  };

  const getUserInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "??";
  };

  const getUserDisplayName = (firstName: string | null, lastName: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return "Anonymous User";
  };

  // Find current user's rank
  const userRank = leaderboard.findIndex((entry) => entry.userId === user?.id) + 1;

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-cosmic-yellow mr-3" />
              <h1 className="text-5xl font-space font-bold bg-gradient-to-r from-cosmic-blue via-cosmic-purple to-cosmic-orange bg-clip-text text-transparent">
                Leaderboard
              </h1>
            </div>
            <p className="text-xl text-space-300 max-w-2xl mx-auto mb-6">
              Compete with fellow space enthusiasts and climb to the top!
            </p>
            
            {/* Time Filter and Refresh */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex bg-space-800/50 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All Time' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTimeFilter(key as any)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      timeFilter === key 
                        ? "bg-cosmic-blue text-white" 
                        : "text-space-300 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Leaderboard */}
            <div className="lg:col-span-2">
              <GlassMorphism>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-cosmic-blue" />
                    Top 100 Space Explorers
                  </CardTitle>
                  <CardDescription className="text-space-300">
                    Rankings updated in real-time based on points earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full" />
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-space-400">No rankings yet. Be the first to earn points!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaderboard.map((entry, index) => {
                        const rank = index + 1;
                        const isCurrentUser = entry.userId === user?.id;

                        return (
                          <div
                            key={entry.userId}
                            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                              isCurrentUser
                                ? "bg-cosmic-blue/20 border-2 border-cosmic-blue"
                                : "bg-space-800/50 hover:bg-space-700/50"
                            }`}
                          >
                            {/* Rank */}
                            <div className="flex-shrink-0 w-12 flex items-center justify-center">
                              {getRankIcon(rank)}
                            </div>

                            {/* Avatar */}
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={entry.profileImageUrl || undefined} />
                              <AvatarFallback className="bg-cosmic-purple text-white">
                                {getUserInitials(entry.firstName, entry.lastName)}
                              </AvatarFallback>
                            </Avatar>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-white truncate">
                                  {getUserDisplayName(entry.firstName, entry.lastName)}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-cosmic-blue text-sm">(You)</span>
                                  )}
                                </p>
                                <Badge variant="outline" className={getRankBadgeColor(rank)}>
                                  Lvl {entry.level}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-space-400">
                                <span className="flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-orange-500" />
                                  {entry.currentStreak} day streak
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  {entry.longestStreak} longest
                                </span>
                              </div>
                            </div>

                            {/* Points */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-2xl font-bold text-cosmic-orange">
                                {entry.totalPoints.toLocaleString()}
                              </p>
                              <p className="text-xs text-space-400">points</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </GlassMorphism>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Stats */}
              {user && userGamification && (
                <GlassMorphism>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="w-5 h-5 text-cosmic-purple" />
                      Your Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-space-800/50 rounded-lg">
                      <p className="text-sm text-space-400 mb-1">Your Rank</p>
                      <p className="text-4xl font-bold text-cosmic-blue">
                        {userRank > 0 ? `#${userRank}` : "Unranked"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-space-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-cosmic-orange">
                          {userGamification.points?.totalPoints?.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-space-400">Total Points</p>
                      </div>
                      <div className="text-center p-3 bg-space-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-cosmic-purple">
                          {userGamification.points?.level || 1}
                        </p>
                        <p className="text-xs text-space-400">Level</p>
                      </div>
                      <div className="text-center p-3 bg-space-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-cosmic-yellow">
                          {userGamification.points?.currentStreak || 0}
                        </p>
                        <p className="text-xs text-space-400">Current Streak</p>
                      </div>
                      <div className="text-center p-3 bg-space-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-cosmic-green">
                          {userGamification.badges?.length || 0}
                        </p>
                        <p className="text-xs text-space-400">Badges Earned</p>
                      </div>
                    </div>
                  </CardContent>
                </GlassMorphism>
              )}

              {/* How to Earn Points */}
              <GlassMorphism>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="w-5 h-5 text-cosmic-yellow" />
                    Earn Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-space-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-cosmic-blue/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-cosmic-blue font-bold">+50</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Complete a Lesson</p>
                        <p className="text-xs text-space-400">Finish course lessons</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-space-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-cosmic-purple/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-cosmic-purple font-bold">+200</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Complete a Course</p>
                        <p className="text-xs text-space-400">Earn your certificate</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-space-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-cosmic-orange/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-cosmic-orange font-bold">+100</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Join a Campaign</p>
                        <p className="text-xs text-space-400">Participate in research</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-space-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-cosmic-yellow/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-cosmic-yellow font-bold">+25</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Daily Login</p>
                        <p className="text-xs text-space-400">Build your streak</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </GlassMorphism>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

