import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import BadgeShowcase from "@/components/BadgeShowcase";
import OrderHistory from "@/components/user/OrderHistory";
import RefundTracker from "@/components/user/RefundTracker";
import {
  BookOpen,
  Rocket,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Target,
  Star,
  PlayCircle,
  ArrowRight,
  Trophy,
  Zap,
  Receipt,
  RefreshCw
} from "lucide-react";
import { useLocation } from "wouter";

export default function UserDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/user/dashboard"],
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-space-900">
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-cosmic-blue border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-space-900">
        <Navigation />
        <div className="pt-24 container mx-auto px-4">
          <GlassMorphism className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Please Sign In</h2>
            <p className="text-gray-300 mb-6">You need to be signed in to view your dashboard</p>
            <Button onClick={() => navigate("/")} className="cosmic-gradient">
              Go to Home
            </Button>
          </GlassMorphism>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalCourses: 0,
    completedCourses: 0,
    activeCampaigns: 0,
    upcomingWorkshops: 0,
    totalHours: 0
  };

  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const campaigns = dashboardData?.campaignParticipations || [];
  const workshops = dashboardData?.workshopRegistrations || [];
  const certificates = dashboardData?.certificates || [];

  return (
    <div className="min-h-screen bg-space-900 text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cosmic-blue via-cosmic-purple to-cosmic-pink bg-clip-text text-transparent">
              Welcome back, {user.displayName || 'Explorer'}! 🚀
            </h1>
            <p className="text-gray-400 text-lg">
              Continue your journey through the frontiers of science
            </p>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-space-800 border border-space-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cosmic-blue">
                <TrendingUp className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-cosmic-blue">
                <Receipt className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="refunds" className="data-[state=active]:bg-cosmic-blue">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refunds
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <GlassMorphism className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Courses Enrolled</p>
                  <p className="text-3xl font-bold text-cosmic-blue">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-cosmic-blue opacity-50" />
              </div>
            </GlassMorphism>

            <GlassMorphism className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-cosmic-green">{stats.completedCourses}</p>
                </div>
                <Award className="w-8 h-8 text-cosmic-green opacity-50" />
              </div>
            </GlassMorphism>

            <GlassMorphism className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Campaigns</p>
                  <p className="text-3xl font-bold text-cosmic-purple">{stats.activeCampaigns}</p>
                </div>
                <Rocket className="w-8 h-8 text-cosmic-purple opacity-50" />
              </div>
            </GlassMorphism>

            <GlassMorphism className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Workshops</p>
                  <p className="text-3xl font-bold text-cosmic-orange">{stats.upcomingWorkshops}</p>
                </div>
                <Calendar className="w-8 h-8 text-cosmic-orange opacity-50" />
              </div>
            </GlassMorphism>

            <GlassMorphism className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Hours Learned</p>
                  <p className="text-3xl font-bold text-cosmic-yellow">{stats.totalHours}</p>
                </div>
                <Clock className="w-8 h-8 text-cosmic-yellow opacity-50" />
              </div>
            </GlassMorphism>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Continue Learning */}
              {enrolledCourses.length > 0 && (
                <Card className="bg-space-800/50 border-space-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Continue Learning</CardTitle>
                        <CardDescription>Pick up where you left off</CardDescription>
                      </div>
                      <PlayCircle className="w-6 h-6 text-cosmic-blue" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course: any) => (
                      <div key={course.id} className="p-4 rounded-lg bg-space-700/50 hover:bg-space-700 transition-all cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{course.title}</h4>
                            <p className="text-sm text-gray-400 line-clamp-1">{course.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-2 bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue">
                            {course.level}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white font-medium">{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-3 w-full cosmic-gradient"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course.id}`);
                          }}
                        >
                          Continue Course <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ))}
                    
                    {enrolledCourses.length > 3 && (
                      <Button 
                        variant="ghost" 
                        className="w-full text-cosmic-blue hover:text-blue-400"
                        onClick={() => navigate("/courses")}
                      >
                        View All Courses <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Active Campaigns */}
              {campaigns.length > 0 && (
                <Card className="bg-space-800/50 border-space-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Active Campaigns</CardTitle>
                        <CardDescription>Your ongoing research participation</CardDescription>
                      </div>
                      <Target className="w-6 h-6 text-cosmic-purple" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {campaigns.map((campaign: any) => (
                      <div 
                        key={campaign.id} 
                        className="p-4 rounded-lg bg-space-700/50 hover:bg-space-700 transition-all cursor-pointer"
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{campaign.title}</h4>
                            <p className="text-sm text-gray-400">{campaign.field}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.duration}</span>
                          </div>
                          {campaign.partner && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{campaign.partner}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {enrolledCourses.length === 0 && campaigns.length === 0 && (
                <Card className="bg-space-800/50 border-space-700">
                  <CardContent className="py-12 text-center">
                    <Zap className="w-16 h-16 mx-auto mb-4 text-cosmic-blue opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">Start Your Learning Journey</h3>
                    <p className="text-gray-400 mb-6">Explore our courses and campaigns to begin</p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => navigate("/courses")} className="cosmic-gradient">
                        Browse Courses
                      </Button>
                      <Button onClick={() => navigate("/campaigns")} variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple hover:text-white">
                        View Campaigns
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              
              {/* Achievements */}
              <Card className="bg-space-800/50 border-space-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Achievements</CardTitle>
                    <Trophy className="w-5 h-5 text-cosmic-yellow" />
                  </div>
                </CardHeader>
                <CardContent>
                  {certificates.length > 0 ? (
                    <div className="space-y-3">
                      {certificates.slice(0, 3).map((cert: any) => (
                        <div key={cert.id} className="p-3 rounded-lg bg-cosmic-yellow/10 border border-cosmic-yellow/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-cosmic-yellow" />
                            <span className="font-medium text-white text-sm">{cert.courseName}</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Completed {new Date(cert.issuedDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {certificates.length > 3 && (
                        <p className="text-sm text-gray-400 text-center">
                          +{certificates.length - 3} more certificates
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Award className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm text-gray-400">No certificates yet</p>
                      <p className="text-xs text-gray-500 mt-1">Complete courses to earn</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Workshops */}
              {workshops.length > 0 && (
                <Card className="bg-space-800/50 border-space-700">
                  <CardHeader>
                    <CardTitle className="text-white">Upcoming Workshops</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {workshops.map((workshop: any) => (
                      <div key={workshop.id} className="p-3 rounded-lg bg-space-700/50">
                        <h4 className="font-medium text-white text-sm mb-2">{workshop.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(workshop.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-cosmic-blue/20 to-cosmic-purple/20 border-cosmic-blue/50">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-white"
                    onClick={() => navigate("/courses")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore Courses
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple hover:text-white"
                    onClick={() => navigate("/campaigns")}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Join Campaigns
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-cosmic-orange text-cosmic-orange hover:bg-cosmic-orange hover:text-white"
                    onClick={() => navigate("/workshops")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Workshops
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Badges Section */}
          <div className="mt-12">
            <BadgeShowcase />
          </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrderHistory />
            </TabsContent>

            {/* Refunds Tab */}
            <TabsContent value="refunds">
              <RefundTracker />
            </TabsContent>
          </Tabs>

        </div>
      </div>

      <Footer />
    </div>
  );
}

