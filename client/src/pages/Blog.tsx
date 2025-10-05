import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlassMorphism from "@/components/GlassMorphism";
import { 
  Calendar, 
  ArrowRight, 
  Search
} from "lucide-react";
import { BlogPost } from "@shared/schema";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();

  const { data: blogPosts, isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const filteredPosts = blogPosts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (blogLoading) {
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
              Blog
            </h1>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Discover inspiring stories and scientific insights from our community
            </p>
          </div>

          {/* Share Your Story - Moved to Top */}
          <div className="mb-16">
            <GlassMorphism className="p-8 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-semibold mb-4">Share Your Story</h3>
              <p className="text-space-300 mb-6">
                Have an inspiring story, research finding, or creative work to share? We'd love to feature it on our blog!
              </p>
              <Button className="cosmic-gradient hover:opacity-90 px-8">
                Submit Your Story
              </Button>
            </GlassMorphism>
          </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
