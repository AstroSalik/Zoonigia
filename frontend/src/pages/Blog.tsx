import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  Award,
  Star,
  Telescope,
  PenTool,
  Microscope,
  BookOpen
} from "lucide-react";
import { BlogPost } from "@shared/types";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setLocation] = useLocation();

  const { data: blogPosts, isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const filteredPosts = blogPosts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    // Add category filtering logic if needed
    return matchesSearch;
  });

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "asteroid_discovery":
        return <Telescope className="w-5 h-5" />;
      case "research_publication":
        return <Microscope className="w-5 h-5" />;
      case "poetry_publication":
        return <PenTool className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "asteroid_discovery":
        return "bg-cosmic-blue";
      case "research_publication":
        return "bg-cosmic-green";
      case "poetry_publication":
        return "bg-cosmic-purple";
      default:
        return "bg-cosmic-blue";
    }
  };

  if (blogLoading || achievementsLoading) {
    return (
      <div className="min-h-screen bg-space-900 text-space-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-blue"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-space font-bold mb-4">
              Blog & <span className="text-cosmic-blue">Achievers Gallery</span>
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Discover inspiring stories, scientific insights, and celebrate the achievements of our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Blog Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Latest Blog Posts</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-space-400" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-10 bg-space-700 border-space-600 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {filteredPosts && filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card key={post.id} className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-cosmic-blue/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-blue font-bold text-lg">
                              {post.authorName.split(' ').map(name => name[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{post.authorName}</h4>
                            <p className="text-sm text-space-400">{post.authorTitle || "Contributor"}</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-space-300 mb-4 line-clamp-3">
                          {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-space-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(post.publishedAt!).toLocaleDateString()}
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-cosmic-blue hover:text-blue-400 p-0"
                            onClick={() => setLocation(`/blog/${post.id}`)}
                          >
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  // Sample blog posts when no data is available
                  <>
                    <Card className="bg-space-800/50 border-space-700">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-purple font-bold text-lg">SC</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Dr. Sarah Chen</h4>
                            <p className="text-sm text-space-400">Astrophysicist</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl">Discovering Exoplanets: A Student's Journey</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-space-300 mb-4">
                          How our student researchers are contributing to the search for habitable worlds beyond our solar system through innovative data analysis techniques and collaborative research...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-space-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            Dec 10, 2024
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-cosmic-blue hover:text-blue-400 p-0"
                            onClick={() => setLocation(`/blog/sample-1`)}
                          >
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-space-800/50 border-space-700">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-cosmic-green/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-green font-bold text-lg">RS</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Rahul Sharma</h4>
                            <p className="text-sm text-space-400">Student, Grade 12</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl">My Experience with Quantum Computing</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-space-300 mb-4">
                          Exploring the fascinating world of quantum mechanics and its applications in modern computing through hands-on experiments and theoretical learning...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-space-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            Dec 8, 2024
                          </div>
                          <Button 
                            variant="ghost" 
                            className="text-cosmic-blue hover:text-blue-400 p-0"
                            onClick={() => setLocation(`/blog/sample-2`)}
                          >
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-space-800/50 border-space-700">
                      <CardHeader>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-cosmic-orange/20 flex items-center justify-center mr-4">
                            <span className="text-cosmic-orange font-bold text-lg">MR</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">Prof. Maria Rodriguez</h4>
                            <p className="text-sm text-space-400">NASA Scientist</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl">The Future of Space Education</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-space-300 mb-4">
                          How virtual reality and AI are revolutionizing the way we teach space science to the next generation of explorers and innovators...
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-space-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            Dec 5, 2024
                          </div>
                          <Button variant="ghost" className="text-cosmic-blue hover:text-blue-400 p-0">
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Achievers Gallery */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Achievers Gallery</h2>
              
              <div className="space-y-6">
                {achievements && achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <GlassMorphism key={achievement.id} className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-cosmic-blue/20 flex items-center justify-center mr-4">
                          <span className="text-cosmic-blue font-bold text-xl">
                            {achievement.studentName.split(' ').map(name => name[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{achievement.studentName}</h4>
                          <p className="text-sm text-space-400">{achievement.school}</p>
                        </div>
                      </div>
                      
                      <Badge className={`${getAchievementColor(achievement.achievementType)} text-space-900 mb-3`}>
                        <span className="flex items-center">
                          {getAchievementIcon(achievement.achievementType)}
                          <span className="ml-1">{achievement.achievementType.replace('_', ' ')}</span>
                        </span>
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-space-300">{achievement.description}</p>
                    </GlassMorphism>
                  ))
                ) : (
                  // Sample achievements when no data is available
                  <>
                    <GlassMorphism className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-cosmic-blue/20 flex items-center justify-center mr-4">
                          <span className="text-cosmic-blue font-bold text-xl">PP</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Priya Patel</h4>
                          <p className="text-sm text-space-400">St. Xavier's School, Mumbai</p>
                        </div>
                      </div>
                      
                      <Badge className="bg-cosmic-blue text-space-900 mb-3">
                        <span className="flex items-center">
                          <Telescope className="w-4 h-4 mr-1" />
                          Asteroid Discovery
                        </span>
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-2">Asteroid 2024ZG15 Discovery</h3>
                      <p className="text-space-300">
                        Successfully discovered and named a new asteroid through our NASA collaboration program, contributing to real space science research.
                      </p>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-cosmic-green/20 flex items-center justify-center mr-4">
                          <span className="text-cosmic-green font-bold text-xl">AK</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Arjun Krishnan</h4>
                          <p className="text-sm text-space-400">DPS School, Delhi</p>
                        </div>
                      </div>
                      
                      <Badge className="bg-cosmic-green text-space-900 mb-3">
                        <span className="flex items-center">
                          <Microscope className="w-4 h-4 mr-1" />
                          Research Publication
                        </span>
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-2">Solar Panel Efficiency Research</h3>
                      <p className="text-space-300">
                        Published research paper on "Solar Panel Efficiency Optimization" in International Journal of Renewable Energy with Zoonigia's mentorship.
                      </p>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-cosmic-purple/20 flex items-center justify-center mr-4">
                          <span className="text-cosmic-purple font-bold text-xl">SR</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Sneha Reddy</h4>
                          <p className="text-sm text-space-400">Hyderabad Public School</p>
                        </div>
                      </div>
                      
                      <Badge className="bg-cosmic-purple text-space-900 mb-3">
                        <span className="flex items-center">
                          <PenTool className="w-4 h-4 mr-1" />
                          Poetry Publication
                        </span>
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-2">"Dancing with the Stars"</h3>
                      <p className="text-space-300">
                        Featured poet in "The Cosmic Voyage" anthology with her inspiring poem about space exploration and human dreams.
                      </p>
                    </GlassMorphism>

                    <GlassMorphism className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-cosmic-orange/20 flex items-center justify-center mr-4">
                          <span className="text-cosmic-orange font-bold text-xl">KG</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Kavi Gupta</h4>
                          <p className="text-sm text-space-400">Modern School, Pune</p>
                        </div>
                      </div>
                      
                      <Badge className="bg-cosmic-orange text-space-900 mb-3">
                        <span className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          Workshop Excellence
                        </span>
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-2">VR Workshop Champion</h3>
                      <p className="text-space-300">
                        Demonstrated exceptional performance in our VR space exploration workshop, creating an innovative virtual Mars mission.
                      </p>
                    </GlassMorphism>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Featured Content */}
          <div className="mt-16">
            <h2 className="text-3xl font-space font-bold text-center mb-8">Featured Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlassMorphism className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Student Research</h3>
                <p className="text-space-300 mb-4">
                  Discover groundbreaking research conducted by our students with expert mentorship
                </p>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900">
                  Read Research Papers
                </Button>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <Star className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Success Stories</h3>
                <p className="text-space-300 mb-4">
                  Inspiring journeys of students who achieved remarkable milestones with Zoonigia
                </p>
                <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple hover:text-space-900">
                  View All Stories
                </Button>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center">
                <PenTool className="w-12 h-12 text-cosmic-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Creative Writing</h3>
                <p className="text-space-300 mb-4">
                  Explore beautiful poetry and creative writing inspired by space and science
                </p>
                <Button variant="outline" className="border-cosmic-green text-cosmic-green hover:bg-cosmic-green hover:text-space-900">
                  Read Poetry
                </Button>
              </GlassMorphism>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <GlassMorphism className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Share Your Story</h3>
              <p className="text-space-300 mb-6">
                Have an inspiring story, research finding, or creative work to share? We'd love to feature it on our blog!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="cosmic-gradient hover:opacity-90 px-8">
                  Submit Your Story
                </Button>
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8">
                  Join Our Newsletter
                </Button>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
