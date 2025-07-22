import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StellanHero from "@/components/StellanHero";
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
    if (specialMessageData?.message) {
      toast({
        title: "Welcome! 🌸",
        description: specialMessageData.message,
        duration: 5000,
      });
    }
  }, [specialMessageData, toast]);

  return (
    <div className="min-h-screen bg-space-900 text-space-50 relative">
      <CosmicBackground />
      <Navigation />
      
      {/* Hero Section */}
      <StellanHero />
      
      {/* Video Section */}
      <section className="py-20 bg-space-800/30">
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

      {/* Quick Actions Section */}
      <section id="quick-actions" className="py-20 bg-space-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-space font-bold mb-6">
              Start Your <span className="text-cosmic-blue">Journey</span>
            </h2>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              Choose your path into frontier sciences and begin your exploration of the universe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cosmic-blue/30 transition-colors">
                <Telescope className="w-8 h-8 text-cosmic-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Workshops</h3>
              <p className="text-space-300 text-sm mb-4">
                Interactive hands-on sessions with telescope observations and VR experiences
              </p>
              <Button asChild variant="outline" size="sm" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-white">
                <Link href="/workshops">Learn More</Link>
              </Button>
            </GlassMorphism>

            <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cosmic-purple/30 transition-colors">
                <BookOpen className="w-8 h-8 text-cosmic-purple" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Courses</h3>
              <p className="text-space-300 text-sm mb-4">
                Structured learning programs in quantum mechanics and astrophysics
              </p>
              <Button asChild variant="outline" size="sm" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple hover:text-white">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </GlassMorphism>

            <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-cosmic-green/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cosmic-green/30 transition-colors">
                <Microscope className="w-8 h-8 text-cosmic-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Campaigns</h3>
              <p className="text-space-300 text-sm mb-4">
                Join real research projects like asteroid searches with NASA
              </p>
              <Button asChild variant="outline" size="sm" className="border-cosmic-green text-cosmic-green hover:bg-cosmic-green hover:text-white">
                <Link href="/campaigns">Join Research</Link>
              </Button>
            </GlassMorphism>

            <GlassMorphism className="p-6 text-center hover:bg-white/10 transition-colors group">
              <div className="w-16 h-16 bg-cosmic-orange/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cosmic-orange/30 transition-colors">
                <School className="w-8 h-8 text-cosmic-orange" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Schools</h3>
              <p className="text-space-300 text-sm mb-4">
                Partnership programs with revenue sharing for educational institutions
              </p>
              <Button asChild variant="outline" size="sm" className="border-cosmic-orange text-cosmic-orange hover:bg-cosmic-orange hover:text-white">
                <Link href="/schools">Partner With Us</Link>
              </Button>
            </GlassMorphism>
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

      {/* What Makes Zoonigia Special */}
      <section className="py-20 bg-space-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-space font-bold mb-6">
              What Makes Zoonigia <span className="text-cosmic-purple">Special</span>
            </h2>
            <p className="text-xl text-space-200 max-w-3xl mx-auto">
              We combine cutting-edge science with immersive experiences and interdisciplinary thinking to create transformative learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-space-800/50 border-space-700 hover:bg-space-800 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Telescope className="w-6 h-6 text-cosmic-blue" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-space-50">Immersive Workshops</h3>
                <p className="text-space-300 text-sm">
                  VR experiences, telescope sessions, and hands-on activities bring science to life
                </p>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-700 hover:bg-space-800 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Microscope className="w-6 h-6 text-cosmic-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-space-50">Research Campaigns</h3>
                <p className="text-space-300 text-sm">
                  Participate in real NASA collaborations and contribute to actual discoveries
                </p>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-700 hover:bg-space-800 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-cosmic-purple" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-space-50">Expert Community</h3>
                <p className="text-space-300 text-sm">
                  Learn from astrophysicists, researchers, and industry professionals
                </p>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-700 hover:bg-space-800 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-cosmic-yellow" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-space-50">Interdisciplinary Learning</h3>
                <p className="text-space-300 text-sm">
                  Blend scientific rigor with literary wonder and philosophical inquiry
                </p>
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
  );
};

export default Home;