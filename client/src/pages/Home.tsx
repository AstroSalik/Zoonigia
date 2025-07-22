import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CinematicHero from "@/components/CinematicHero";
import GlassMorphism from "@/components/GlassMorphism";
import CosmicBackground from "@/components/OrbitalAnimation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { 
  Rocket, 
  Users, 
  School, 
  Microscope, 
  Play, 
  ChevronDown,
  Star,
  Telescope,
  Headphones,
  Lightbulb,
  BookOpen,
  Atom,
  Feather
} from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Check for special welcome message
  const { data: specialMessageData } = useQuery({
    queryKey: ["/api/auth/special-message"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (specialMessageData && 'message' in specialMessageData) {
      toast({
        title: "Welcome! 🌸",
        description: (specialMessageData as any).message,
        duration: 5000,
      });
    }
  }, [specialMessageData, toast]);
  
  return (
    <div className="min-h-screen bg-space-900 text-space-50 relative">
      <div className="relative z-10">
        <Navigation />
        {/* Hero Section */}
        <CinematicHero />
      {/* Video Section */}
      <section id="video-section" className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-space font-bold mb-6">
              Discover <span className="text-cosmic-blue">Zoonigia</span>
            </h2>
            <p className="text-xl text-space-200 mb-8">Watch our introduction video to see how we're revolutionizing frontier sciences</p>
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-space-800">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Tgr6BrgIBec"
                title="What is Zoonigia - Space Science Education Platform"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-space-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-blue mb-2">2,500+</div>
              <div className="text-space-300">Students Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-purple mb-2">150+</div>
              <div className="text-space-300">Schools Partnered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-green mb-2">50+</div>
              <div className="text-space-300">Workshops Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cosmic-orange mb-2">12</div>
              <div className="text-space-300">Global Collaborations</div>
            </div>
          </div>
        </div>
      </section>
      {/* Inspirational Quote Section */}
      <section className="py-20 bg-gradient-to-br from-space-900 via-space-800 to-space-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cosmic-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cosmic-purple rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-2xl md:text-4xl font-space italic text-cosmic-blue mb-6 leading-relaxed">
                "Astronomy is what leads a lost spirit beyond the horizons to the road of being acquainted with thyself."
              </blockquote>
              <div className="w-24 h-1 bg-gradient-to-r from-cosmic-blue to-cosmic-purple mx-auto mb-4"></div>
              <p className="text-xl text-space-300 font-medium">
                Salik Riyaz, Founder
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Interdisciplinary Learning Section */}
      <section className="py-20 bg-space-800/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cosmic-yellow to-cosmic-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-space font-bold mb-6">
                <span className="bg-gradient-to-r from-cosmic-yellow to-cosmic-orange bg-clip-text text-transparent">
                  Interdisciplinary Learning
                </span>
              </h2>
              <p className="text-xl text-space-300 max-w-4xl mx-auto leading-relaxed">
                Discover how scientific discovery becomes more meaningful when enriched by storytelling and deep thinking about existence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-all duration-300">
                <Atom className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scientific Rigor</h3>
                <p className="text-space-300">
                  Quantum mechanics, astrophysics, and cutting-edge research grounded in empirical evidence
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-all duration-300">
                <Feather className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Literary Wonder</h3>
                <p className="text-space-300">
                  Poetic narratives and storytelling that illuminate the beauty of cosmic phenomena
                </p>
              </GlassMorphism>
              
              <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-all duration-300">
                <Star className="w-12 h-12 text-cosmic-orange mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Philosophical Depth</h3>
                <p className="text-space-300">
                  Existential questions about our place in the universe and the nature of reality
                </p>
              </GlassMorphism>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Quick Actions</h2>
          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-3/5 lg:basis-2/5">
                  <div className="p-1">
                    <GlassMorphism className="p-6 hover:bg-white/20 transition-all duration-300 group h-full">
                      <div className="text-center">
                        <Users className="w-12 h-12 text-cosmic-blue mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-2">Register for Workshop</h3>
                        <p className="text-space-300 mb-4">Join our immersive workshops exploring frontier sciences through hands-on discovery</p>
                        <Link href="/workshops">
                          <Button className="bg-cosmic-blue hover:bg-blue-600">
                            Browse Workshops
                          </Button>
                        </Link>
                      </div>
                    </GlassMorphism>
                  </div>
                </CarouselItem>
                
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-3/5 lg:basis-2/5">
                  <div className="p-1">
                    <GlassMorphism className="p-6 hover:bg-white/20 transition-all duration-300 group h-full">
                      <div className="text-center">
                        <School className="w-12 h-12 text-cosmic-purple mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-2">Book School Workshop</h3>
                        <p className="text-space-300 mb-4">Bring Zoonigia's expertise directly to your institution</p>
                        <Link href="/schools">
                          <Button className="bg-cosmic-purple hover:bg-purple-600">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </GlassMorphism>
                  </div>
                </CarouselItem>
                
                <CarouselItem className="pl-2 md:pl-4 basis-4/5 md:basis-3/5 lg:basis-2/5">
                  <div className="p-1">
                    <GlassMorphism className="p-6 hover:bg-white/20 transition-all duration-300 group h-full">
                      <div className="text-center">
                        <Microscope className="w-12 h-12 text-cosmic-green mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-semibold mb-2">Enroll in Labs</h3>
                        <p className="text-space-300 mb-4">Access real-time research labs and hands-on experiments</p>
                        <Button className="bg-cosmic-green hover:bg-green-600 opacity-60" disabled>
                          Coming April 2025
                        </Button>
                      </div>
                    </GlassMorphism>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-space-600 bg-space-800/80 text-space-50 hover:bg-space-700" />
              <CarouselNext className="hidden md:flex -right-12 border-space-600 bg-space-800/80 text-space-50 hover:bg-space-700" />
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-space font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Basic astronomy course with telescope observations" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4 bg-cosmic-blue px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Telescope className="w-5 h-5 text-cosmic-blue mr-2" />
                  <h3 className="text-xl font-semibold">Basic Astronomy</h3>
                </div>
                <p className="text-space-300 mb-4">Comprehensive introduction to astronomy and space science</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cosmic-blue">₹1,200 per student</span>
                  <span className="text-sm text-space-400">6 weeks program</span>
                </div>
                <Link href="/courses">
                  <Button className="w-full bg-cosmic-blue hover:bg-blue-600">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Robotics and AI course with hands-on projects" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Headphones className="w-5 h-5 text-cosmic-purple mr-2" />
                  <h3 className="text-xl font-semibold">Robotics & AI</h3>
                </div>
                <p className="text-space-300 mb-4">Build intelligent systems and explore artificial intelligence</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cosmic-purple">₹2,500 per student</span>
                  <span className="text-sm text-space-400">8 weeks program</span>
                </div>
                <Link href="/courses">
                  <Button className="w-full bg-cosmic-purple hover:bg-purple-600">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-space-800/50 border-space-700 hover:scale-105 transition-transform">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400" 
                  alt="Quantum mechanics course with advanced physics" 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-cosmic-green mr-2" />
                  <h3 className="text-xl font-semibold">Quantum Mechanics</h3>
                </div>
                <p className="text-space-300 mb-4">Explore the fundamental principles of quantum physics</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cosmic-green">₹3,000 per student</span>
                  <span className="text-sm text-space-400">10 weeks program</span>
                </div>
                <Link href="/courses">
                  <Button className="w-full bg-cosmic-green hover:bg-green-600">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-space font-bold mb-6">Ready to Explore the Universe?</h2>
            <p className="text-xl text-space-200 mb-8">
              Join thousands of students and educators who are already discovering the wonders of science with Zoonigia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="cosmic-gradient hover:opacity-90 px-8 py-4 text-lg">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/workshops">
                <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-space-900 px-8 py-4 text-lg">
                  View All Workshops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
